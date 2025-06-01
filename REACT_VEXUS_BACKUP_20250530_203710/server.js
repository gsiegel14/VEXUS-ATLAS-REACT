const express = require('express');
const cors = require('cors');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const Airtable = require('airtable');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for the React frontend
app.use(cors({
  origin: 'http://localhost:5437', // React dev server
  credentials: true
}));

app.use(express.json());

// Initialize Google Secret Manager
const secretClient = new SecretManagerServiceClient({
  projectId: 'decoded-app-457000-s2',
  keyFilename: './google-credentials-production.json' // Use the service account key
});

// Cache for secrets to avoid repeated API calls
let secretsCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Function to get secrets from Google Secret Manager
async function getSecrets() {
  // Check cache first
  if (secretsCache && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
    return secretsCache;
  }

  try {
    console.log('Fetching secrets from Google Secret Manager...');
    
    const secretIds = [
      'AIRTABLE_API_KEY',
      'AIRTABLE_BASE_ID', 
      'AIRTABLE_TABLE_ID',
      'AIRTABLE_TABLE_NAME'
    ];

    const secrets = {};
    
    for (const secretId of secretIds) {
      const name = `projects/decoded-app-457000-s2/secrets/${secretId}/versions/latest`;
      const [version] = await secretClient.accessSecretVersion({ name });
      const secretValue = version.payload.data.toString();
      secrets[secretId] = secretValue;
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
    title: fields['Study'] || fields['Name'] || fields['Image'] ? `${fields['Vein type (hepatic, renal, portal)']} - ${fields['Estimated Waveform Severity']}` : 'Untitled',
    description: fields['Analysis'] || '',
    imageUrl: fields['Image'] && fields['Image'][0] ? fields['Image'][0].url : '',
    thumbnailUrl: fields['Image'] && fields['Image'][0] ? 
      (fields['Image'][0].thumbnails?.large?.url || fields['Image'][0].url) : '',
    quality: fields['Image Quality'] ? 
      (fields['Image Quality'].includes('High') ? 'High' : 
       fields['Image Quality'].includes('Medium') ? 'Medium' : 'Low') : 'Medium',
    veinType: fields['Vein type (hepatic, renal, portal)'] || 'Hepatic Vein',
    waveform: fields['Estimated Waveform Severity'] || 'Normal',
    subtype: fields['Waveform Subtype'],
    vexusGrade: fields['VEXUSGrade'] || fields['Grade'],
    clinicalContext: fields['Clinical Context'] || fields['Context'],
    analysis: fields['Analysis'],
    submittedBy: fields['Collaborator'] ? 
      (fields['Collaborator'].name || fields['Collaborator'].email) : 
      (fields['Created By'] ? fields['Created By'].name : undefined),
    institution: fields['Institution'],
    submissionDate: record.createdTime ? new Date(record.createdTime) : new Date(),
    approved: true, // Assume all records in table are approved
    tags: [], // No tags field visible in schema
    metadata: {
      createdTime: record.createdTime,
      imageQuality: fields['Image Quality'],
      qa: fields['QA'],
      collaborator: fields['Collaborator'],
      createdBy: fields['Created By'],
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
    
    // Only select the fields we need
    const fieldsToSelect = [
      'Vein type (hepatic, renal, portal)',
      'Estimated Waveform Severity',
      'Waveform Subtype',
      'Image Quality',
      'QA',
      'Analysis',
      'Image',
      'Collaborator',
      'Institution',
      'Created By'
    ];
    
    await base(secrets.AIRTABLE_TABLE_NAME)
      .select({
        fields: fieldsToSelect
        // Remove sorting since "Created time" field doesn't exist
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
    
    console.log(`📊 Fetched ${records.length} images from Airtable`);
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
    
    await base(secrets.AIRTABLE_TABLE_NAME)
      .select({
        maxRecords: 5
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
      message: 'Available fields in your Airtable',
      records: records,
      allFieldNames: [...new Set(records.flatMap(r => r.fieldNames))],
      sampleTransformed: records.length > 0 ? transformRecord(records[0]) : null
    });
  } catch (error) {
    console.error('Failed to fetch debug info:', error);
    res.status(500).json({ error: error.message });
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
    
    // Only select the fields we need
    const fieldsToSelect = [
      'Vein type (hepatic, renal, portal)',
      'Estimated Waveform Severity',
      'Waveform Subtype',
      'Image Quality',
      'QA',
      'Analysis',
      'Image',
      'Collaborator',
      'Institution',
      'Created By'
    ];
    
    await base(secrets.AIRTABLE_TABLE_NAME)
      .select({
        fields: fieldsToSelect,
        // Use the correct field name from Airtable schema
        filterByFormula: `{Vein type (hepatic, renal, portal)} = '${targetVeinType}'`
        // Remove sorting since "Created time" field doesn't exist
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
    
    console.log(`📊 Fetched ${records.length} ${targetVeinType} images from Airtable`);
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

// Start server
app.listen(PORT, () => {
  console.log('🚀 VEXUS Atlas Backend Server (Updated)');
  console.log('======================================');
  console.log(`🌐 Server running on http://localhost:${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📊 Images API: http://localhost:${PORT}/api/images`);
  console.log(`🔍 Debug fields: http://localhost:${PORT}/api/debug/fields`);
  console.log(`📋 Raw data: http://localhost:${PORT}/api/raw`);
  console.log('🔐 Using Google Secret Manager for configuration');
  console.log('📋 Ready to serve React frontend on http://localhost:5437');
  
  // Test connection on startup
  getSecrets()
    .then(() => console.log('✅ Initial secret fetch successful'))
    .catch(err => console.error('❌ Initial secret fetch failed:', err.message));
}); 