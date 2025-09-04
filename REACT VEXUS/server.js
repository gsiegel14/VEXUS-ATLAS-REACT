const express = require('express');
const cors = require('cors');
const path = require('path');
const https = require('https');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const Airtable = require('airtable');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001; // Match frontend configuration (was 8080)

// Enable CORS for production
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://vexus-atlas-314467722862.us-central1.run.app', 'https://gsiegel14--vexus-hepatic-model-hepaticmodel-predict.modal.run', 'https://gsiegel14--vexus-portal-model-portalmodel-predict.modal.run', 'https://gsiegel14--vexus-renal-model-renalmodel-predict.modal.run']
    : ['http://localhost:5436', 'http://localhost:5437', 'http://localhost:5438', 'http://localhost:5439', 'http://localhost:5440'], // React dev server
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'dist')));

// Initialize Google Secret Manager
const secretClient = new SecretManagerServiceClient({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || 'decoded-app-457000-s2',
  keyFilename: process.env.NODE_ENV === 'production' ? undefined : './google-credentials-production.json' // Use service account in production
});

// Cache for secrets to avoid repeated API calls
let secretsCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// SERP API Response Cache - 1 WEEK CACHING
let serpCache = new Map();
const SERP_CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 1 week (7 days) for SERP API responses
const MAX_CACHE_SIZE = 50; // Maximum number of cached responses (smaller for longer TTL)

// Helper function to generate cache key
const generateCacheKey = (endpoint, params) => {
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  return `${endpoint}:${sortedParams}`;
};

// Helper function to clean expired cache entries
const cleanExpiredCache = () => {
  const now = Date.now();
  let removedCount = 0;
  for (const [key, value] of serpCache.entries()) {
    if (now - value.timestamp > SERP_CACHE_DURATION) {
      serpCache.delete(key);
      removedCount++;
      console.log('🗑️  Cache entry expired and removed:', key);
    }
  }
  if (removedCount > 0) {
    console.log(`🧹 Cleaned ${removedCount} expired cache entries`);
  }
};

// Helper function to manage cache size
const manageCacheSize = () => {
  if (serpCache.size > MAX_CACHE_SIZE) {
    // Remove oldest entries if cache is too large
    const entries = Array.from(serpCache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    const entriesToRemove = entries.slice(0, serpCache.size - MAX_CACHE_SIZE + 5);
    entriesToRemove.forEach(([key]) => {
      serpCache.delete(key);
      console.log('🗑️  Cache entry removed due to size limit:', key);
    });
    console.log(`📦 Managed cache size: removed ${entriesToRemove.length} oldest entries`);
  }
};

// Helper function to get cached response
const getCachedResponse = (cacheKey) => {
  cleanExpiredCache();
  const cached = serpCache.get(cacheKey);
  
  if (cached && (Date.now() - cached.timestamp < SERP_CACHE_DURATION)) {
    const ageInDays = Math.floor((Date.now() - cached.timestamp) / (24 * 60 * 60 * 1000));
    console.log('🎯 Cache HIT:', { 
      cacheKey, 
      ageInDays,
      cacheSize: serpCache.size 
    });
    return cached.data;
  }
  
  return null;
};

// Helper function to set cached response
const setCachedResponse = (cacheKey, data) => {
  manageCacheSize();
  serpCache.set(cacheKey, {
    data,
    timestamp: Date.now()
  });
  
  console.log('💾 Response cached for 1 week:', { 
    cacheKey, 
    cacheSize: serpCache.size,
    ttlDays: 7
  });
};

// Reset cache on server start
secretsCache = null;
cacheTimestamp = null;
serpCache.clear();

// Function to get secrets from Google Secret Manager
async function getSecrets() {
  // Check cache first
  if (secretsCache && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
    return secretsCache;
  }

  try {
    console.log('Fetching secrets from Google Secret Manager...');
    
    // Required secrets for Airtable (in project decoded-app-457000-s2)
    const requiredSecretIds = [
      'AIRTABLE_API_KEY',
      'AIRTABLE_BASE_ID', 
      'AIRTABLE_TABLE_ID',
      'AIRTABLE_TABLE_NAME'
    ];

    const secrets = {};
    
    // Fetch required secrets from the main project
    for (const secretId of requiredSecretIds) {
      const name = `projects/decoded-app-457000-s2/secrets/${secretId}/versions/latest`;
      const [version] = await secretClient.accessSecretVersion({ name });
      const secretValue = version.payload.data.toString();
      secrets[secretId] = secretValue;
    }

    // Fetch googlescholarapi secret from the same project
    try {
      const name = `projects/decoded-app-457000-s2/secrets/googlescholarapi/versions/latest`;
      const [version] = await secretClient.accessSecretVersion({ name });
      const secretValue = version.payload.data.toString();
      secrets['googlescholarapi'] = secretValue;
      console.log(`✅ Google Scholar API secret loaded from project decoded-app-457000-s2`);
    } catch (error) {
      console.log(`⚠️  Google Scholar API secret not available:`, error.message);
      secrets['googlescholarapi'] = null;
    }

    // Update cache
    secretsCache = secrets;
    cacheTimestamp = Date.now();
    
    console.log('✅ Secrets loaded successfully');
    console.log('Base ID:', secrets.AIRTABLE_BASE_ID);
    console.log('Table Name:', secrets.AIRTABLE_TABLE_NAME);
    
    return secrets;
  } catch (error) {
    console.error('❌ Failed to fetch secrets:', error);
    throw error;
  }
}

// Initialize Airtable
let airtableBase = null;

async function initializeAirtable() {
  if (airtableBase) return airtableBase;
  
  const secrets = await getSecrets();
  
  Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: secrets.AIRTABLE_API_KEY,
  });

  airtableBase = Airtable.base(secrets.AIRTABLE_BASE_ID);
  return airtableBase;
}

// Function to transform Airtable record to expected format
function transformRecord(record) {
  const fields = record.fields;
  
  return {
    id: record.id,
    title: fields['Vein type'] && fields['Waveform'] ? 
           `${fields['Vein type']} - ${fields['Waveform']}` : 
           'Untitled',
    description: fields['Subtype'] || '',
    imageUrl: fields['Image'] && fields['Image'][0] ? fields['Image'][0].url : '',
    thumbnailUrl: fields['Image'] && fields['Image'][0] ? 
      (fields['Image'][0].thumbnails?.large?.url || fields['Image'][0].url) : '',
    
    // Essential fields for image cards
    veinType: fields['Vein type'] || 'Unknown',
    waveform: fields['Waveform'] || 'Unknown',           // This is the severity (Normal/Mild/Severe)
    severity: fields['Waveform'] || 'Unknown',           // Alias for waveform
    subtype: fields['Subtype'] || '',                    // Detailed waveform subtype
    quality: fields['Image Quality'] || 'Medium',        // Image quality assessment
    qa: fields['QA'] || '',                              // Quality assurance notes
    analysis: fields['Analysis'] || '',                  // Analysis text
    
    // Standard fields for compatibility
    submissionDate: record.createdTime ? new Date(record.createdTime) : new Date(),
    approved: true,
    tags: [],
    
    // Minimal metadata for essential fields only
    metadata: {
      createdTime: record.createdTime,
      veinType: fields['Vein type'],
      waveform: fields['Waveform'],
      subtype: fields['Subtype'],
      imageQuality: fields['Image Quality'],
      qa: fields['QA'],
      analysis: fields['Analysis'],
      rawFields: fields
    }
  };
}

// API Routes

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const secrets = await getSecrets();
    const base = await initializeAirtable();
    
    // Test Airtable connection
    await base(secrets.AIRTABLE_TABLE_NAME).select({ maxRecords: 1 }).firstPage();
    
    res.json({ 
      status: 'healthy',
      secretManager: true,
      airtable: true,
      googleScholarAPI: !!secrets.googlescholarapi,
      serpCache: {
        size: serpCache.size,
        maxSize: MAX_CACHE_SIZE,
        ttlDays: 7,
        utilizationPercent: Math.round((serpCache.size / MAX_CACHE_SIZE) * 100)
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({ 
      status: 'unhealthy', 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get Airtable configuration
app.get('/api/config', async (req, res) => {
  try {
    const secrets = await getSecrets();
    res.json({
      baseId: secrets.AIRTABLE_BASE_ID,
      tableId: secrets.AIRTABLE_TABLE_ID,
      tableName: secrets.AIRTABLE_TABLE_NAME,
      // Don't send the API key to frontend for security
    });
  } catch (error) {
    console.error('Failed to get config:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get all images from Airtable
app.get('/api/images', async (req, res) => {
  try {
    const secrets = await getSecrets();
    const base = await initializeAirtable();
    const filterByApproved = req.query.approved !== 'false';
    
    const records = [];
    
    // Essential fields for image cards/tiles only
    const fieldsToSelect = [
      'Vein type',           // Hepatic/Portal/Renal Vein
      'Waveform',            // Normal/Mild/Severe (severity)
      'Subtype',             // Detailed waveform subtype
      'Image Quality',       // High/Medium/Low
      'QA',                  // Quality assurance notes
      'Analysis',            // Analysis text
      'Image'                // The actual image attachment
    ];
    
    await base(secrets.AIRTABLE_TABLE_NAME)
      .select({
        fields: fieldsToSelect
      })
      .eachPage((pageRecords, fetchNextPage) => {
        pageRecords.forEach(record => {
          try {
            const transformedRecord = transformRecord(record);
            records.push(transformedRecord);
          } catch (error) {
            console.warn('Failed to transform record:', record.id, error.message);
          }
        });
        fetchNextPage();
      });
    
    console.log(`📊 Fetched ${records.length} images from Airtable (essential fields only)`);
    res.json(records);
  } catch (error) {
    console.error('Failed to fetch images:', error);
    res.status(500).json({ error: error.message });
  }
});

// Debug endpoint to see available fields
app.get('/api/debug/fields', async (req, res) => {
  try {
    const secrets = await getSecrets();
    const base = await initializeAirtable();
    
    const records = [];
    
    // Essential fields for image cards/tiles only
    const fieldsToSelect = [
      'Vein type',           // Hepatic/Portal/Renal Vein
      'Waveform',            // Normal/Mild/Severe (severity)
      'Subtype',             // Detailed waveform subtype
      'Image Quality',       // High/Medium/Low
      'QA',                  // Quality assurance notes
      'Analysis',            // Analysis text
      'Image'                // The actual image attachment
    ];
    
    await base(secrets.AIRTABLE_TABLE_NAME)
      .select({
        fields: fieldsToSelect,
        maxRecords: 3
      })
      .eachPage((pageRecords, fetchNextPage) => {
        pageRecords.forEach(record => {
          records.push({
            id: record.id,
            fields: record.fields,
            fieldNames: Object.keys(record.fields)
          });
        });
        fetchNextPage();
      });
    
    res.json({
      message: 'Essential fields for image cards/tiles',
      fieldsUsed: fieldsToSelect,
      records: records,
      allFieldNames: [...new Set(records.flatMap(r => r.fieldNames))],
      sampleTransformed: records.length > 0 ? transformRecord(records[0]) : null
    });
  } catch (error) {
    console.error('Failed to fetch debug info:', error);
    res.status(500).json({ error: error.message });
  }
});

// Debug endpoint to check secret loading status
app.get('/api/debug/secrets', async (req, res) => {
  try {
    const secrets = await getSecrets();
    
    res.json({
      message: 'Secret loading status',
      secrets: {
        AIRTABLE_API_KEY: secrets.AIRTABLE_API_KEY ? 'Loaded' : 'Missing',
        AIRTABLE_BASE_ID: secrets.AIRTABLE_BASE_ID ? 'Loaded' : 'Missing',
        AIRTABLE_TABLE_ID: secrets.AIRTABLE_TABLE_ID ? 'Loaded' : 'Missing',
        AIRTABLE_TABLE_NAME: secrets.AIRTABLE_TABLE_NAME ? 'Loaded' : 'Missing',
        googlescholarapi: secrets.googlescholarapi ? 'Loaded' : 'Missing',
        googlescholarapi_length: secrets.googlescholarapi ? secrets.googlescholarapi.length : 0,
        googlescholarapi_preview: secrets.googlescholarapi ? secrets.googlescholarapi.substring(0, 10) + '...' : 'null'
      }
    });
  } catch (error) {
    console.error('Failed to get secrets debug info:', error);
    res.status(500).json({ error: error.message });
  }
});

// Cache management endpoint for Google Scholar API
app.get('/api/admin/cache', (req, res) => {
  const { action } = req.query;
  
  try {
    if (action === 'clear') {
      const clearedEntries = serpCache.size;
      serpCache.clear();
      
      console.log('🗑️  SERP cache manually cleared:', { 
        clearedEntries,
        timestamp: new Date().toISOString()
      });
      
      return res.json({
        success: true,
        message: 'Cache cleared successfully',
        clearedEntries,
        timestamp: new Date().toISOString()
      });
    }
    
    if (action === 'cleanup') {
      const sizeBefore = serpCache.size;
      cleanExpiredCache();
      const sizeAfter = serpCache.size;
      
      console.log('🧹 SERP cache cleanup performed:', { 
        sizeBefore,
        sizeAfter,
        removedEntries: sizeBefore - sizeAfter,
        timestamp: new Date().toISOString()
      });
      
      return res.json({
        success: true,
        message: 'Cache cleanup completed',
        sizeBefore,
        sizeAfter,
        removedEntries: sizeBefore - sizeAfter,
        timestamp: new Date().toISOString()
      });
    }
    
    // Default: return cache status
    const cacheEntries = Array.from(serpCache.entries()).map(([key, value]) => ({
      key,
      timestamp: new Date(value.timestamp).toISOString(),
      ageInDays: Math.floor((Date.now() - value.timestamp) / (24 * 60 * 60 * 1000)),
      ttlRemainingDays: Math.max(0, 7 - Math.floor((Date.now() - value.timestamp) / (24 * 60 * 60 * 1000))),
      expired: (Date.now() - value.timestamp) > SERP_CACHE_DURATION,
      dataSize: JSON.stringify(value.data).length
    }));
    
    res.json({
      cache: {
        size: serpCache.size,
        maxSize: MAX_CACHE_SIZE,
        ttlDays: 7,
        utilizationPercent: Math.round((serpCache.size / MAX_CACHE_SIZE) * 100),
        entries: cacheEntries
      },
      actions: {
        clear: '/api/admin/cache?action=clear',
        cleanup: '/api/admin/cache?action=cleanup'
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Cache management endpoint error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to manage cache',
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Get images by category (vein type)
app.get('/api/images/category/:veinType', async (req, res) => {
  try {
    const secrets = await getSecrets();
    const base = await initializeAirtable();
    const { veinType } = req.params;
    const filterByApproved = req.query.approved !== 'false';
    
    // Map URL parameter to actual field values
    const veinTypeMap = {
      'hepatic': 'Hepatic Vein',
      'portal': 'Portal Vein', 
      'renal': 'Renal Vein',
      'Hepatic Vein': 'Hepatic Vein',
      'Portal Vein': 'Portal Vein',
      'Renal Vein': 'Renal Vein'
    };
    
    const targetVeinType = veinTypeMap[veinType] || veinType;
    
    const records = [];
    
    // Essential fields for image cards/tiles only
    const fieldsToSelect = [
      'Vein type',           // Hepatic/Portal/Renal Vein
      'Waveform',            // Normal/Mild/Severe (severity)
      'Subtype',             // Detailed waveform subtype
      'Image Quality',       // High/Medium/Low
      'QA',                  // Quality assurance notes
      'Analysis',            // Analysis text
      'Image'                // The actual image attachment
    ];
    
    await base(secrets.AIRTABLE_TABLE_NAME)
      .select({
        fields: fieldsToSelect,
        // Use the correct field name from Airtable schema
        filterByFormula: `{Vein type} = '${targetVeinType}'`
      })
      .eachPage((pageRecords, fetchNextPage) => {
        pageRecords.forEach(record => {
          try {
            const transformedRecord = transformRecord(record);
            records.push(transformedRecord);
          } catch (error) {
            console.warn('Failed to transform record:', record.id, error.message);
          }
        });
        fetchNextPage();
      });
    
    console.log(`📊 Fetched ${records.length} ${targetVeinType} images from Airtable (essential fields only)`);
    res.json(records);
  } catch (error) {
    console.error(`Failed to fetch ${veinType} images:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Get raw data endpoint for debugging
app.get('/api/raw', async (req, res) => {
  try {
    const secrets = await getSecrets();
    const base = await initializeAirtable();
    
    const records = [];
    
    await base(secrets.AIRTABLE_TABLE_NAME)
      .select({
        maxRecords: 10
      })
      .eachPage((pageRecords, fetchNextPage) => {
        pageRecords.forEach(record => {
          records.push({
            id: record.id,
            createdTime: record.createdTime,
            fields: record.fields
          });
        });
        fetchNextPage();
      });
    
    res.json({
      message: 'Raw Airtable data',
      count: records.length,
      records: records
    });
  } catch (error) {
    console.error('Failed to fetch raw data:', error);
    res.status(500).json({ error: error.message });
  }
});

// Google Scholar API endpoint
app.get('/api/scholar/search', async (req, res) => {
  try {
    const secrets = await getSecrets();
    const { q, start = 0, num = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Query parameter "q" is required' });
    }

    if (!secrets.googlescholarapi) {
      return res.status(503).json({ 
        error: 'Google Scholar search is not available', 
        details: 'googlescholarapi is not configured' 
      });
    }

    const serpApiUrl = new URL('https://serpapi.com/search.json');
    serpApiUrl.searchParams.append('engine', 'google_scholar');
    serpApiUrl.searchParams.append('q', q);
    serpApiUrl.searchParams.append('start', start.toString());
    serpApiUrl.searchParams.append('num', num.toString());
    serpApiUrl.searchParams.append('api_key', secrets.googlescholarapi);
    
    console.log('🔍 Fetching Google Scholar results for:', q);
    console.log('🔗 SerpAPI URL:', serpApiUrl.toString().replace(secrets.googlescholarapi, '[API_KEY_HIDDEN]'));
    
    const cacheKey = generateCacheKey('/api/scholar/search', { q, start, num });
    const cachedResponse = getCachedResponse(cacheKey);
    
    if (cachedResponse) {
      res.json(cachedResponse);
    } else {
      const response = await axios.get(serpApiUrl.toString());
      
      const data = response.data;
      
      // Log some basic info for debugging
      console.log(`📊 Found ${data.organic_results?.length || 0} results for "${q}"`);
      
      setCachedResponse(cacheKey, data);
      res.json(data);
    }
  } catch (error) {
    console.error('❌ Google Scholar API Error Details:');
    console.error('Error message:', error.message);
    console.error('Response status:', error.response?.status);
    console.error('Response data:', error.response?.data);
    console.error('Full error:', error);
    
    const errorResponse = {
      error: error.message,
      details: 'Failed to fetch Google Scholar results',
      status: error.response?.status,
      serpApiError: error.response?.data
    };
    
    res.status(500).json(errorResponse);
  }
});

// Modal API Proxy endpoints
app.post('/api/hepatic', async (req, res) => {
  try {
    console.log('Proxying request to Hepatic Modal endpoint');
    
    const axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'VEXUS-Atlas/1.0',
      },
      timeout: 60000, // Increased timeout to 60 seconds
      maxRedirects: 5,
      // SSL configuration to handle handshake issues
      httpsAgent: new (require('https').Agent)({
        rejectUnauthorized: false, // Allow self-signed certificates
        secureProtocol: 'TLSv1_2_method', // Force TLS 1.2
        ciphers: 'ECDHE+AESGCM:ECDHE+CHACHA20:DHE+AESGCM:DHE+CHACHA20:!aNULL:!MD5:!DSS',
        honorCipherOrder: true
      })
    };

    // Retry logic for SSL issues
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        attempts++;
        console.log(`🔄 Attempt ${attempts} for hepatic endpoint`);
        
        const response = await axios.post(
          'https://gsiegel14--vexus-hepatic-model-hepaticmodel-predict.modal.run/',
          req.body,
          axiosConfig
        );
        
        console.log('✅ Hepatic Modal API success');
        return res.json(response.data);
        
      } catch (retryError) {
        console.log(`❌ Attempt ${attempts} failed:`, retryError.message);
        
        if (attempts === maxAttempts) {
          throw retryError; // Throw on final attempt
        }
        
        // Wait 1 second before retry
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
  } catch (error) {
    console.error('Hepatic Modal API Error:', error.message);
    console.error('Error code:', error.code);
    console.error('Error stack:', error.stack);
    
    res.status(error.response?.status || 500).json({
      error: 'Failed to process hepatic analysis',
      details: error.message,
      code: error.code,
      endpoint: 'hepatic'
    });
  }
});

app.post('/api/portal', async (req, res) => {
  try {
    console.log('Proxying request to Portal Modal endpoint');
    
    const axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'VEXUS-Atlas/1.0',
      },
      timeout: 60000, // Increased timeout to 60 seconds
      maxRedirects: 5,
      // SSL configuration to handle handshake issues
      httpsAgent: new (require('https').Agent)({
        rejectUnauthorized: false, // Allow self-signed certificates
        secureProtocol: 'TLSv1_2_method', // Force TLS 1.2
        ciphers: 'ECDHE+AESGCM:ECDHE+CHACHA20:DHE+AESGCM:DHE+CHACHA20:!aNULL:!MD5:!DSS',
        honorCipherOrder: true
      })
    };

    // Retry logic for SSL issues
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        attempts++;
        console.log(`🔄 Attempt ${attempts} for portal endpoint`);
        
        const response = await axios.post(
          'https://gsiegel14--vexus-portal-model-portalmodel-predict.modal.run/',
          req.body,
          axiosConfig
        );
        
        console.log('✅ Portal Modal API success');
        return res.json(response.data);
        
      } catch (retryError) {
        console.log(`❌ Attempt ${attempts} failed:`, retryError.message);
        
        if (attempts === maxAttempts) {
          throw retryError; // Throw on final attempt
        }
        
        // Wait 1 second before retry
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
  } catch (error) {
    console.error('Portal Modal API Error:', error.message);
    console.error('Error code:', error.code);
    console.error('Error stack:', error.stack);
    
    res.status(error.response?.status || 500).json({
      error: 'Failed to process portal analysis',
      details: error.message,
      code: error.code,
      endpoint: 'portal'
    });
  }
});

app.post('/api/renal', async (req, res) => {
  try {
    console.log('Proxying request to Renal Modal endpoint');
    
    const axiosConfig = {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'VEXUS-Atlas/1.0',
      },
      timeout: 60000, // Increased timeout to 60 seconds
      maxRedirects: 5,
      // SSL configuration to handle handshake issues
      httpsAgent: new (require('https').Agent)({
        rejectUnauthorized: false, // Allow self-signed certificates
        secureProtocol: 'TLSv1_2_method', // Force TLS 1.2
        ciphers: 'ECDHE+AESGCM:ECDHE+CHACHA20:DHE+AESGCM:DHE+CHACHA20:!aNULL:!MD5:!DSS',
        honorCipherOrder: true
      })
    };

    // Retry logic for SSL issues
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        attempts++;
        console.log(`🔄 Attempt ${attempts} for renal endpoint`);
        
        const response = await axios.post(
          'https://gsiegel14--vexus-renal-model-renalmodel-predict.modal.run/',
          req.body,
          axiosConfig
        );
        
        console.log('✅ Renal Modal API success');
        return res.json(response.data);
        
      } catch (retryError) {
        console.log(`❌ Attempt ${attempts} failed:`, retryError.message);
        
        if (attempts === maxAttempts) {
          throw retryError; // Throw on final attempt
        }
        
        // Wait 1 second before retry
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
  } catch (error) {
    console.error('Renal Modal API Error:', error.message);
    console.error('Error code:', error.code);
    console.error('Error stack:', error.stack);
    
    res.status(error.response?.status || 500).json({
      error: 'Failed to process renal analysis',
      details: error.message,
      code: error.code,
      endpoint: 'renal'
    });
  }
});

// Catch-all handler: send back React's index.html file for client-side routing
app.use((req, res) => {
  // Only serve index.html for non-API routes
  if (req.path.startsWith('/api/')) {
    res.status(404).json({ error: 'API endpoint not found' });
  } else {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  }
});

// Start server
app.listen(PORT, () => {
  console.log('🚀 VEXUS Atlas Backend Server (With 1-Week Caching)');
  console.log('===============================================');
  console.log(`🌐 Server running on http://localhost:${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📊 Images API: http://localhost:${PORT}/api/images`);
  console.log(`🔍 Google Scholar API: http://localhost:${PORT}/api/scholar/search`);
  console.log(`🗂️  Cache management: http://localhost:${PORT}/api/admin/cache`);
  console.log(`🔍 Debug fields: http://localhost:${PORT}/api/debug/fields`);
  console.log(`📋 Raw data: http://localhost:${PORT}/api/raw`);
  console.log('🔐 Using Google Secret Manager for configuration');
  console.log('💾 SERP API responses cached for 1 WEEK (reduces API calls)');
  console.log('📋 Ready to serve React frontend on http://localhost:5439');
  
  // Test connection on startup
  getSecrets()
    .then(() => console.log('✅ Initial secret fetch successful'))
    .catch(err => console.error('❌ Initial secret fetch failed:', err.message));
}); 