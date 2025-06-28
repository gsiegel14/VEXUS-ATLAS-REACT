const express = require('express');
const cors = require('cors');
const path = require('path');
const https = require('https');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const Airtable = require('airtable');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5555;

// Enable CORS for development and production
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://pocus-atlas-314467722862.us-central1.run.app']
    : ['http://localhost:5555', 'http://localhost:8081', 'http://localhost:5436', 'http://localhost:5437'], 
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'dist')));

// Initialize Google Secret Manager
const secretClient = new SecretManagerServiceClient({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || 'decoded-app-457000-s2',
  keyFilename: process.env.NODE_ENV === 'production' ? undefined : './google-credentials-production.json'
});

// Cache for secrets to avoid repeated API calls
let secretsCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Reset cache on server start
secretsCache = null;
cacheTimestamp = null;

// Function to get secrets from Google Secret Manager
async function getSecrets() {
  // Check cache first
  if (secretsCache && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
    return secretsCache;
  }

  try {
    console.log('Fetching secrets from Google Secret Manager...');
    
    const secrets = {};

    // Try to get POCUS-specific API key first, fallback to VEXUS key
    try {
      const name = `projects/314467722862/secrets/POCUS_API_KEY/versions/latest`;
      const [version] = await secretClient.accessSecretVersion({ name });
      const secretValue = version.payload.data.toString();
      secrets['AIRTABLE_API_KEY'] = secretValue;
      console.log('✅ POCUS API Key loaded from project 314467722862');
    } catch (error) {
      console.log('⚠️  POCUS_API_KEY not found, trying fallback...');
      try {
        const fallbackName = `projects/decoded-app-457000-s2/secrets/AIRTABLE_API_KEY/versions/latest`;
        const [version] = await secretClient.accessSecretVersion({ name: fallbackName });
        const secretValue = version.payload.data.toString();
        secrets['AIRTABLE_API_KEY'] = secretValue;
        console.log('✅ Fallback Airtable API Key loaded from decoded-app-457000-s2');
      } catch (innerError) {
        console.log('❌ No API key available:', innerError.message);
        secrets['AIRTABLE_API_KEY'] = null;
      }
    }

    // Get POCUS base ID
    try {
      const name = `projects/decoded-app-457000-s2/secrets/POCUS_AIRTABLE_BASE_ID/versions/latest`;
      const [version] = await secretClient.accessSecretVersion({ name });
      const secretValue = version.payload.data.toString().trim();
      secrets['AIRTABLE_BASE_ID'] = secretValue;
      console.log('✅ POCUS Base ID loaded');
    } catch (error) {
      console.log('⚠️  POCUS Base ID not available:', error.message);
      secrets['AIRTABLE_BASE_ID'] = 'appqeNK596oLLcJdd';
    }

    // Get POCUS table name
    try {
      const name = `projects/decoded-app-457000-s2/secrets/POCUS_AIRTABLE_TABLE_NAME/versions/latest`;
      const [version] = await secretClient.accessSecretVersion({ name });
      const secretValue = version.payload.data.toString().trim();
      secrets['AIRTABLE_TABLE_NAME'] = secretValue;
      console.log('✅ POCUS Table Name loaded');
    } catch (error) {
      console.log('⚠️  POCUS Table Name not available:', error.message);
      secrets['AIRTABLE_TABLE_NAME'] = 'Airtable Uploads';
    }

    // Fetch googlescholarapi secret
    try {
      const name = `projects/decoded-app-457000-s2/secrets/googlescholarapi/versions/latest`;
      const [version] = await secretClient.accessSecretVersion({ name });
      const secretValue = version.payload.data.toString();
      secrets['googlescholarapi'] = secretValue;
      console.log('✅ Google Scholar API secret loaded');
    } catch (error) {
      console.log('⚠️  Google Scholar API secret not available:', error.message);
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

// Cardiac category mapping
const CARDIAC_CATEGORIES = {
  'Cardiomyopathy': 'cardiomyopathy',
  'Congenital Heart Disease': 'congenitalHeartDisease',
  'Pericardial Disease': 'pericardialDisease',
  'Valvular Disease': 'valvularDisease',
  'RV Dysfunction': 'rvDysfunction',
  'Other': 'other',
  'Cardiac Other': 'other',
  'Decreased Function': 'cardiomyopathy',
  'IVC': 'other'
};

// Function to transform POCUS record to expected format
function transformRecord(record) {
  const fields = record.fields;
  
  // Debug logging for media files
  const attachmentField = fields['De-identified Image/Video'];
  let isVideo = false;
  if (attachmentField && attachmentField.length > 0) {
    const attachment = attachmentField[0];
    isVideo = attachment.type?.startsWith('video/') || attachment.filename?.toLowerCase().includes('.mp4');
    
    console.log(`🎬 Processing media file for record ${record.id}:`, {
      filename: attachment.filename,
      type: attachment.type,
      url: attachment.url,
      size: attachment.size,
      isVideo: isVideo,
      hasThumbnails: !!attachment.thumbnails
    });
    
    if (attachment.thumbnails) {
      console.log(`📷 Thumbnails available:`, Object.keys(attachment.thumbnails));
    }
  }
  
  return {
    id: record.id,
    title: fields['Name'] || 'Untitled Cardiac Study',
    description: fields['Caption'] || '',
    imageUrl: fields['De-identified Image/Video'] && fields['De-identified Image/Video'][0] ? 
              fields['De-identified Image/Video'][0].url : '',
    thumbnailUrl: fields['De-identified Image/Video'] && fields['De-identified Image/Video'][0] ? 
      (fields['De-identified Image/Video'][0].thumbnails?.large?.url || fields['De-identified Image/Video'][0].url) : '',
    isVideo: isVideo,
    
    // POCUS cardiac-specific fields
    category: fields['Category'] || 'Other',
    section: fields['Section'] || 'Cardiac',
    submissionDate: record.createdTime ? new Date(record.createdTime) : new Date(),
    contributor: fields['Contributor (Name, credentials, twitter handle)'] || 'POCUS Atlas',
    tags: fields['Tags (seperated by ",")'] ? 
      (Array.isArray(fields['Tags (seperated by ",")']) ? fields['Tags (seperated by ",")'] : 
       fields['Tags (seperated by ",")'].split(',').map(tag => tag.trim())) : [],
    status: fields['Submissions Status'] || 'Published',
    
    metadata: {
      subcategory: fields['Subcategory'] || [],
      webHierarchy: fields['Web-hierarchy'],
      type: fields['Type'],
      rawFields: fields
    }
  };
}

// Function to categorize cardiac images
function categorizeImages(records) {
  const categorized = {
    cardiomyopathy: [],
    congenitalHeartDisease: [],
    pericardialDisease: [],
    valvularDisease: [],
    rvDysfunction: [],
    other: []
  };

  records.forEach(record => {
    const categoryKey = CARDIAC_CATEGORIES[record.category] || 'other';
    categorized[categoryKey].push(record);
  });

  return categorized;
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
      googleScholarAPI: !!secrets.googlescholarapi,
      pocusAirtableAPI: true,
      server: 'POCUS Atlas Server',
      port: PORT,
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

// Get all cardiac images from Airtable
app.get('/api/pocus/images', async (req, res) => {
  try {
    const secrets = await getSecrets();
    const base = await initializeAirtable();
    
    const records = [];
    
    console.log('🔍 Fetching cardiac images from POCUS Atlas...');
    
    await base(secrets.AIRTABLE_TABLE_NAME)
      .select({
        filterByFormula: `AND({Section} = 'Cardiac', {Submissions Status} = 'Published')`
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
    
    console.log(`📊 Found ${records.length} cardiac images`);
    
    // Categorize the records
    const categorized = categorizeImages(records);
    res.json(categorized);
  } catch (error) {
    console.error('❌ Failed to fetch POCUS images:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get images by cardiac category
app.get('/api/pocus/images/category/:categoryName', async (req, res) => {
  try {
    const { categoryName } = req.params;
    const secrets = await getSecrets();
    const base = await initializeAirtable();
    const records = [];
    
    console.log(`🔍 Fetching cardiac images for category: ${categoryName}`);
    
    await base(secrets.AIRTABLE_TABLE_NAME)
      .select({
        filterByFormula: `AND({Section} = 'Cardiac', {Submissions Status} = 'Published')`
      })
      .eachPage((pageRecords, fetchNextPage) => {
        pageRecords.forEach(record => {
          try {
            const transformedRecord = transformRecord(record);
            const categoryKey = CARDIAC_CATEGORIES[transformedRecord.category] || 'other';
            if (categoryKey === categoryName) {
              records.push(transformedRecord);
            }
          } catch (error) {
            console.warn('Failed to transform record:', record.id, error.message);
          }
        });
        fetchNextPage();
      });
    
    console.log(`📊 Found ${records.length} images for category ${categoryName}`);
    res.json(records);
  } catch (error) {
    console.error(`❌ Failed to fetch images for category ${req.params.categoryName}:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Debug endpoint to see available fields
app.get('/api/pocus/debug/fields', async (req, res) => {
  try {
    const secrets = await getSecrets();
    const base = await initializeAirtable();
    
    const sampleRecord = await base(secrets.AIRTABLE_TABLE_NAME)
      .select({ maxRecords: 1 })
      .firstPage();
    
    if (sampleRecord.length > 0) {
      res.json({
        availableFields: Object.keys(sampleRecord[0].fields),
        sampleRecord: sampleRecord[0].fields
      });
    } else {
      res.json({ message: 'No records found' });
    }
  } catch (error) {
    console.error('❌ Failed to fetch debug fields:', error);
    res.status(500).json({ error: error.message });
  }
});

// Debug endpoint to check secret loading status
app.get('/api/pocus/debug/secrets', async (req, res) => {
  try {
    const secrets = await getSecrets();
    
    res.json({
      message: 'POCUS Atlas secret loading status',
      secrets: {
        AIRTABLE_API_KEY: secrets.AIRTABLE_API_KEY ? 'Loaded' : 'Missing',
        AIRTABLE_BASE_ID: secrets.AIRTABLE_BASE_ID ? 'Loaded' : 'Missing',
        AIRTABLE_TABLE_NAME: secrets.AIRTABLE_TABLE_NAME ? 'Loaded' : 'Missing',
        googlescholarapi: secrets.googlescholarapi ? 'Loaded' : 'Missing',
        baseId: secrets.AIRTABLE_BASE_ID,
        tableName: secrets.AIRTABLE_TABLE_NAME
      }
    });
  } catch (error) {
    console.error('❌ Failed to get secrets debug info:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get raw data endpoint for debugging
app.get('/api/pocus/raw', async (req, res) => {
  try {
    const secrets = await getSecrets();
    const base = await initializeAirtable();
    const records = [];
    
    await base(secrets.AIRTABLE_TABLE_NAME)
      .select({ maxRecords: 10 })
      .eachPage((pageRecords, fetchNextPage) => {
        pageRecords.forEach(record => {
          records.push({
            id: record.id,
            fields: record.fields,
            createdTime: record.createdTime
          });
        });
        fetchNextPage();
      });
    
    res.json(records);
  } catch (error) {
    console.error('❌ Failed to fetch raw records:', error);
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
    
    const response = await axios.get(serpApiUrl.toString());
    const data = response.data;
    
    console.log(`📊 Found ${data.organic_results?.length || 0} results for "${q}"`);
    res.json(data);
  } catch (error) {
    console.error('❌ Google Scholar API Error:', error.message);
    res.status(500).json({
      error: error.message,
      details: 'Failed to fetch Google Scholar results'
    });
  }
});

// Proxy endpoint for video content to avoid CORS/mixed content issues
app.get('/api/pocus/video-proxy', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Video URL is required' });
    }

    // Forward Range header if present (for streaming)
    const rangeHeader = req.headers['range'];
    console.log(`🎥 Proxying video${rangeHeader ? ' with range ' + rangeHeader : ''}: ${url.substring(0, 120)}...`);

    const upstreamResponse = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream',
      headers: {
        ...(rangeHeader ? { Range: rangeHeader } : {}),
        'User-Agent': req.headers['user-agent'] || 'Mozilla/5.0',
        'Accept': 'video/*,*/*;q=0.9'
      },
      validateStatus: status => (status >= 200 && status < 300) || status === 206
    });

    // Set status code (support 206 Partial Content)
    res.status(upstreamResponse.status);

    // Forward important headers
    const headersToForward = [
      'content-type',
      'content-length',
      'content-range',
      'accept-ranges',
      'cache-control'
    ];
    headersToForward.forEach(h => {
      if (upstreamResponse.headers[h]) {
        res.setHeader(h, upstreamResponse.headers[h]);
      }
    });
    // Always allow CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Range, Accept-Ranges');

    upstreamResponse.data.pipe(res);
  } catch (error) {
    console.error('❌ Video proxy error:', error.message);
    res.status(500).json({ error: 'Failed to proxy video' });
  }
});

// Catch-all handler: send back React's index.html file for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 POCUS Atlas Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🫀 POCUS API: http://localhost:${PORT}/api/pocus/images`);
  console.log(`🔍 Debug: http://localhost:${PORT}/api/pocus/debug/secrets`);
  
  // Initial secret fetch
  getSecrets()
    .then(() => {
      console.log('✅ Initial secret fetch successful');
    })
    .catch(error => {
      console.error('❌ Initial secret fetch failed:', error);
    });
});

module.exports = app; 