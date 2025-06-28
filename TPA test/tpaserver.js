const express = require('express');
const cors = require('cors');
const path = require('path');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const axios = require('axios');
const dotenv = require('dotenv');
const Airtable = require('airtable');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Enable CORS for development
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://tpa-pocus-atlas-*.run.app', 'https://tpa-pocus-atlas.run.app']
    : true, // Allow all origins in development
  credentials: true
}));

// Additional manual CORS headers for debugging
app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log(`🔍 Request from origin: ${origin}`);
  
  if (process.env.NODE_ENV !== 'production') {
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  }
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

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

// POCUS Atlas Configuration - Using POCUS Atlas Uploads table
const CARDIAC_FIELDS = [
  'Name',                                    // fldqKDZNZ0pUIqEBw - Image title
  'Section',                                 // fldNjetFW3gsQ3ybP - Filter for "Cardiac"
  'Category',                                // fldNOncMVqHzuSsxj - Subcategory for grouping
  'Caption',                                 // fld3P9ne8czEyo76G - Description
  'De-identified Image/Video',               // fld121TeOObfvH79I - Media files
  'Submissions Status',                      // fldEWEMV1jB3MZbmW - Filter for "Published"
  'Contributor (Name, credentials, twitter handle)', // fldjzj60urx6bA5Je - Attribution
  'Tags (seperated by ",")',                 // fldQ5icEOBPHxpqTt - Additional metadata
  'Subcategory',                             // fldes9eAAaiGkYVpE - Additional categorization
  'Created'                                  // fldlJs4FDCcom93c7 - Creation time
];

// Filter formula for cardiac images from POCUS Atlas
const CARDIAC_FILTER = `AND({Section} = 'Cardiac', {Submissions Status} = 'Published')`;

// Map POCUS Atlas categories to frontend categories
const CARDIAC_CATEGORIES = {
  'Cardiomyopathy': 'cardiomyopathy',
  'Congenital Heart Disease': 'congenitalHeartDisease', 
  'Pericardial Disease': 'pericardialDisease',
  'Valvulopathy': 'valvularDisease',
  'Valvular Disease': 'valvularDisease',
  'RV Dysfunction': 'rvDysfunction',
  'Other': 'other',
  'Cardiac Other': 'other',
  'Decreased Function': 'cardiomyopathy',
  'IVC': 'other',
  'Cardiac Normal Anatomy': 'other'
};

// Function to get secrets from Google Secret Manager
async function getSecrets() {
  // Check cache first
  if (secretsCache && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
    return secretsCache;
  }

  try {
    console.log('Fetching secrets from Google Secret Manager...');
    
    // Required secrets for POCUS Atlas Airtable (in project decoded-app-457000-s2)
    const requiredSecretIds = [
      'POCUS_AIRTABLE_API_KEY',
      'POCUS_AIRTABLE_BASE_ID', 
      'POCUS_AIRTABLE_TABLE_NAME'
    ];

    const secrets = {};
    
    // Fetch required secrets from the main project
    for (const secretId of requiredSecretIds) {
      try {
        const name = `projects/decoded-app-457000-s2/secrets/${secretId}/versions/latest`;
        const [version] = await secretClient.accessSecretVersion({ name });
        const secretValue = version.payload.data.toString().trim(); // Trim whitespace
        secrets[secretId] = secretValue;
        console.log(`✅ ${secretId} loaded from project decoded-app-457000-s2`);
      } catch (error) {
        console.log(`⚠️  ${secretId} not available:`, error.message);
        secrets[secretId] = null;
      }
    }

    // Fetch googlescholarapi secret from the same project
    try {
      const name = `projects/decoded-app-457000-s2/secrets/googlescholarapi/versions/latest`;
      const [version] = await secretClient.accessSecretVersion({ name });
      const secretValue = version.payload.data.toString().trim(); // Trim whitespace
      secrets['googlescholarapi'] = secretValue;
      console.log(`✅ Google Scholar API secret loaded from project decoded-app-457000-s2`);
    } catch (error) {
      console.log(`⚠️  Google Scholar API secret not available:`, error.message);
      secrets['googlescholarapi'] = null;
    }

    // Try fallback key first (from decoded-app-457000-s2 project)
    try {
      const fallbackName = `projects/decoded-app-457000-s2/secrets/AIRTABLE_API_KEY/versions/latest`;
      const [airtableVersion] = await secretClient.accessSecretVersion({ name: fallbackName });
      secrets['POCUS_AIRTABLE_API_KEY'] = airtableVersion.payload.data.toString().trim(); // Trim whitespace
      console.log('✅ AIRTABLE_API_KEY loaded from decoded-app-457000-s2 (primary)');
    } catch (error) {
      console.log('⚠️  AIRTABLE_API_KEY not available:', error.message);
      // fallback to dedicated POCUS_API_KEY secret
      try {
        const airtableApiName = `projects/314467722862/secrets/POCUS_API_KEY/versions/latest`;
        const [airtableVersion] = await secretClient.accessSecretVersion({ name: airtableApiName });
        secrets['POCUS_AIRTABLE_API_KEY'] = airtableVersion.payload.data.toString().trim(); // Trim whitespace
        console.log('✅ Fallback POCUS_API_KEY loaded from project 314467722862');
      } catch (innerErr) {
        console.log('⚠️  POCUS_API_KEY not available:', innerErr.message);
        secrets['POCUS_AIRTABLE_API_KEY'] = process.env.POCUS_AIRTABLE_API_KEY || process.env.AIRTABLE_API_KEY || null;
      }
    }

    // Update cache
    secretsCache = secrets;
    cacheTimestamp = Date.now();
    
    console.log('✅ Secrets loaded successfully');
    console.log('Base ID:', secrets.POCUS_AIRTABLE_BASE_ID);
    console.log('Table Name:', secrets.POCUS_AIRTABLE_TABLE_NAME);
    
    return secrets;
  } catch (error) {
    console.error('❌ Failed to fetch secrets:', error);
    throw error;
  }
}

// Initialize Airtable for POCUS Atlas
let airtableBase = null;

async function initializeAirtable() {
  if (airtableBase) return airtableBase;
  
  const secrets = await getSecrets();
  
  Airtable.configure({
    endpointUrl: 'https://api.airtable.com',
    apiKey: secrets.POCUS_AIRTABLE_API_KEY,
  });

  airtableBase = Airtable.base(secrets.POCUS_AIRTABLE_BASE_ID);
  return airtableBase;
}

// Helper function to detect video files
function isVideoFile(attachment) {
  if (!attachment) return false;
  
  // Check MIME type first (most reliable)
  if (attachment.type) {
    if (attachment.type.startsWith('video/')) return true;
    if (attachment.type === 'application/octet-stream' && attachment.filename) {
      // Sometimes videos are uploaded with generic MIME type
      return isVideoByFilename(attachment.filename);
    }
  }
  
  // Fallback to filename extension
  if (attachment.filename) {
    return isVideoByFilename(attachment.filename);
  }
  
  return false;
}

// Helper function to detect video by filename
function isVideoByFilename(filename) {
  if (!filename) return false;
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.mkv', '.wmv', '.flv', '.m4v'];
  const lowerFilename = filename.toLowerCase();
  return videoExtensions.some(ext => lowerFilename.endsWith(ext));
}

// Helper function to get video metadata
function getVideoMetadata(attachment) {
  if (!attachment) return null;
  
  return {
    filename: attachment.filename || 'unknown',
    type: attachment.type || 'unknown',
    size: attachment.size || 0,
    duration: attachment.duration || null, // Airtable sometimes provides this
    width: attachment.width || null,
    height: attachment.height || null,
    url: attachment.url,
    thumbnails: attachment.thumbnails || null
  };
}

// Helper function to get image metadata
function getImageMetadata(attachment) {
  if (!attachment) return null;
  
  return {
    filename: attachment.filename || 'unknown',
    type: attachment.type || 'unknown',
    size: attachment.size || 0,
    width: attachment.width || null,
    height: attachment.height || null,
    url: attachment.url,
    thumbnails: attachment.thumbnails || null
  };
}

// Transform POCUS record from Airtable Uploads table
function transformPocusRecord(record) {
  const fields = record.fields;
  
  // Process media files with comprehensive detection
  const attachmentField = fields['De-identified Image/Video'];
  let isVideo = false;
  let mediaMetadata = null;
  let primaryUrl = '';
  let thumbnailUrl = '';
  
  if (attachmentField && attachmentField[0]) {
    const attachment = attachmentField[0];
    isVideo = isVideoFile(attachment);
    
    // Get appropriate metadata
    if (isVideo) {
      mediaMetadata = getVideoMetadata(attachment);
      console.log(`🎬 Processing VIDEO for record ${record.id}:`, {
        filename: mediaMetadata.filename,
        type: mediaMetadata.type,
        size: `${(mediaMetadata.size / 1024 / 1024).toFixed(2)}MB`,
        dimensions: mediaMetadata.width && mediaMetadata.height ? 
          `${mediaMetadata.width}x${mediaMetadata.height}` : 'unknown',
        duration: mediaMetadata.duration || 'unknown',
        url: mediaMetadata.url?.substring(0, 100) + '...'
      });
    } else {
      mediaMetadata = getImageMetadata(attachment);
      console.log(`🖼️  Processing IMAGE for record ${record.id}:`, {
        filename: mediaMetadata.filename,
        type: mediaMetadata.type,
        size: `${(mediaMetadata.size / 1024 / 1024).toFixed(2)}MB`,
        dimensions: mediaMetadata.width && mediaMetadata.height ? 
          `${mediaMetadata.width}x${mediaMetadata.height}` : 'unknown',
        url: mediaMetadata.url?.substring(0, 100) + '...'
      });
    }
    
    primaryUrl = attachment.url || '';
    
    // For videos, prefer thumbnail if available, otherwise use video URL
    if (isVideo) {
      thumbnailUrl = attachment.thumbnails?.large?.url || 
                     attachment.thumbnails?.small?.url || 
                     attachment.url || '';
    } else {
      // For images, use thumbnail if available
      thumbnailUrl = attachment.thumbnails?.large?.url || 
                     attachment.thumbnails?.small?.url || 
                     attachment.url || '';
    }
  }
  
  return {
    id: record.id,
    title: fields['Name'] || 'Untitled Cardiac Study',
    description: fields['Caption'] || '',
    imageUrl: primaryUrl,
    thumbnailUrl: thumbnailUrl,
    isVideo: isVideo,
    mediaType: isVideo ? 'video' : 'image',
    mediaMetadata: mediaMetadata,
    
    // Cardiac-specific fields from POCUS Atlas
    category: fields['Category'] || 'Other',
    section: fields['Section'] || 'Cardiac',
    submissionDate: fields['Created'] ? new Date(fields['Created']) : new Date(),
    contributor: fields['Contributor (Name, credentials, twitter handle)'] || '',
    tags: fields['Tags (seperated by ",")'] ? 
          fields['Tags (seperated by ",")'].split(',').map(tag => tag.trim()).filter(Boolean) : [],
    status: fields['Submissions Status'] || '',
    
    metadata: {
      subcategory: fields['Subcategory'] || [],
      section: fields['Section'],
      submissionStatus: fields['Submissions Status'],
      mediaInfo: mediaMetadata,
      rawFields: fields
    }
  };
}

// Categorize POCUS images by cardiac categories with media type stats
function categorizePocusImages(records) {
  const categorized = {
    cardiomyopathy: [],
    congenitalHeartDisease: [],
    pericardialDisease: [],
    valvularDisease: [],
    rvDysfunction: [],
    other: []
  };

  // Track media statistics
  let totalVideos = 0;
  let totalImages = 0;
  const mediaStats = {
    cardiomyopathy: { videos: 0, images: 0 },
    congenitalHeartDisease: { videos: 0, images: 0 },
    pericardialDisease: { videos: 0, images: 0 },
    valvularDisease: { videos: 0, images: 0 },
    rvDysfunction: { videos: 0, images: 0 },
    other: { videos: 0, images: 0 }
  };

  records.forEach(record => {
    const categoryKey = CARDIAC_CATEGORIES[record.category] || 'other';
    categorized[categoryKey].push(record);
    
    // Count media types
    if (record.isVideo) {
      totalVideos++;
      mediaStats[categoryKey].videos++;
    } else {
      totalImages++;
      mediaStats[categoryKey].images++;
    }
    
    // Debug: log uncategorized items
    if (!CARDIAC_CATEGORIES[record.category]) {
      console.log(`⚠️  Uncategorized cardiac item: "${record.category}" -> mapped to "other"`);
    }
  });

  // Log media statistics
  console.log(`📊 Media Statistics: ${totalVideos} videos, ${totalImages} images`);
  Object.entries(mediaStats).forEach(([category, stats]) => {
    if (stats.videos > 0 || stats.images > 0) {
      console.log(`   ${category}: ${stats.videos} videos, ${stats.images} images`);
    }
  });

  // Add metadata to response
  categorized._metadata = {
    totalRecords: records.length,
    totalVideos: totalVideos,
    totalImages: totalImages,
    categoryStats: mediaStats,
    generatedAt: new Date().toISOString()
  };

  return categorized;
}

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const secrets = await getSecrets();
    
    // Test POCUS Airtable connection
    const pocusAirtableWorking = secrets.POCUS_AIRTABLE_API_KEY && 
                                 secrets.POCUS_AIRTABLE_BASE_ID && 
                                 secrets.POCUS_AIRTABLE_TABLE_NAME;
    
    res.json({ 
      status: 'healthy',
      secretManager: true,
      googleScholarAPI: !!secrets.googlescholarapi,
      pocusAirtableAPI: pocusAirtableWorking,
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

// POCUS Atlas API endpoints

// Get all cardiac images from POCUS Atlas
app.get('/api/pocus/images', async (req, res) => {
  try {
    console.log('🔍 Fetching cardiac images from POCUS Atlas...');
    const secrets = await getSecrets();
    const base = await initializeAirtable();
    
    const records = [];
    
    await base(secrets.POCUS_AIRTABLE_TABLE_NAME)
      .select({
        fields: CARDIAC_FIELDS,
        filterByFormula: CARDIAC_FILTER
      })
      .eachPage((pageRecords, fetchNextPage) => {
        pageRecords.forEach(record => {
          try {
            const transformedRecord = transformPocusRecord(record);
            records.push(transformedRecord);
          } catch (error) {
            console.warn('Failed to transform POCUS record:', record.id, error.message);
          }
        });
        fetchNextPage();
      });
    
    // Categorize the records
    const categorized = categorizePocusImages(records);
    
    console.log(`📊 Found ${records.length} cardiac images`);
    console.log(`📊 Categorized: ${Object.entries(categorized).map(([key, imgs]) => `${key}: ${imgs.length}`).join(', ')}`);
    
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
    const { mediaType } = req.query; // Optional filter: 'video', 'image', or 'all'
    console.log(`🔍 Fetching ${categoryName} ${mediaType || 'all media'} from POCUS Atlas...`);
    
    const secrets = await getSecrets();
    const base = await initializeAirtable();
    
    // Map category name to actual Airtable category values
    const categoryMap = {
      'cardiomyopathy': ['Cardiomyopathy', 'Decreased Function'],
      'congenitalHeartDisease': ['Congenital Heart Disease'],
      'pericardialDisease': ['Pericardial Disease'],
      'valvulopathy': ['Valvulopathy'],
      'rvDysfunction': ['RV Dysfunction'],
      'other': ['Other', 'Cardiac Other', 'IVC', 'Cardiac Normal Anatomy']
    };
    
    const targetCategories = categoryMap[categoryName] || [categoryName];
    const categoryFilter = targetCategories.map(cat => `{Category} = '${cat}'`).join(', ');
    const fullFilter = `AND(OR(${categoryFilter}), {Section} = 'Cardiac', {Submissions Status} = 'Published')`;
    
    const records = [];
    
    await base(secrets.POCUS_AIRTABLE_TABLE_NAME)
      .select({
        fields: CARDIAC_FIELDS,
        filterByFormula: fullFilter
      })
      .eachPage((pageRecords, fetchNextPage) => {
        pageRecords.forEach(record => {
          try {
            const transformedRecord = transformPocusRecord(record);
            
            // Filter by media type if specified
            if (mediaType === 'video' && !transformedRecord.isVideo) return;
            if (mediaType === 'image' && transformedRecord.isVideo) return;
            
            records.push(transformedRecord);
          } catch (error) {
            console.warn('Failed to transform POCUS record:', record.id, error.message);
          }
        });
        fetchNextPage();
      });
    
    const videoCount = records.filter(r => r.isVideo).length;
    const imageCount = records.filter(r => !r.isVideo).length;
    
    console.log(`📊 Found ${records.length} ${categoryName} items (${videoCount} videos, ${imageCount} images)`);
    
    res.json({
      category: categoryName,
      mediaType: mediaType || 'all',
      totalCount: records.length,
      videoCount: videoCount,
      imageCount: imageCount,
      records: records
    });
  } catch (error) {
    console.error(`❌ Failed to fetch ${categoryName} images:`, error);
    res.status(500).json({ error: error.message });
  }
});

// Get only videos from all categories
app.get('/api/pocus/videos', async (req, res) => {
  try {
    console.log('🎬 Fetching all cardiac videos from POCUS Atlas...');
    const secrets = await getSecrets();
    const base = await initializeAirtable();
    
    const records = [];
    
    await base(secrets.POCUS_AIRTABLE_TABLE_NAME)
      .select({
        fields: CARDIAC_FIELDS,
        filterByFormula: CARDIAC_FILTER
      })
      .eachPage((pageRecords, fetchNextPage) => {
        pageRecords.forEach(record => {
          try {
            const transformedRecord = transformPocusRecord(record);
            if (transformedRecord.isVideo) {
              records.push(transformedRecord);
            }
          } catch (error) {
            console.warn('Failed to transform POCUS record:', record.id, error.message);
          }
        });
        fetchNextPage();
      });
    
    // Categorize videos
    const categorized = categorizePocusImages(records);
    
    console.log(`🎬 Found ${records.length} cardiac videos`);
    res.json(categorized);
  } catch (error) {
    console.error('❌ Failed to fetch POCUS videos:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get only images from all categories
app.get('/api/pocus/images-only', async (req, res) => {
  try {
    console.log('🖼️  Fetching all cardiac images from POCUS Atlas...');
    const secrets = await getSecrets();
    const base = await initializeAirtable();
    
    const records = [];
    
    await base(secrets.POCUS_AIRTABLE_TABLE_NAME)
      .select({
        fields: CARDIAC_FIELDS,
        filterByFormula: CARDIAC_FILTER
      })
      .eachPage((pageRecords, fetchNextPage) => {
        pageRecords.forEach(record => {
          try {
            const transformedRecord = transformPocusRecord(record);
            if (!transformedRecord.isVideo) {
              records.push(transformedRecord);
            }
          } catch (error) {
            console.warn('Failed to transform POCUS record:', record.id, error.message);
          }
        });
        fetchNextPage();
      });
    
    // Categorize images
    const categorized = categorizePocusImages(records);
    
    console.log(`🖼️  Found ${records.length} cardiac images`);
    res.json(categorized);
  } catch (error) {
    console.error('❌ Failed to fetch POCUS images:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get media statistics
app.get('/api/pocus/stats', async (req, res) => {
  try {
    console.log('📊 Fetching POCUS media statistics...');
    const secrets = await getSecrets();
    const base = await initializeAirtable();
    
    const records = [];
    
    await base(secrets.POCUS_AIRTABLE_TABLE_NAME)
      .select({
        fields: CARDIAC_FIELDS,
        filterByFormula: CARDIAC_FILTER
      })
      .eachPage((pageRecords, fetchNextPage) => {
        pageRecords.forEach(record => {
          try {
            const transformedRecord = transformPocusRecord(record);
            records.push(transformedRecord);
          } catch (error) {
            console.warn('Failed to transform POCUS record:', record.id, error.message);
          }
        });
        fetchNextPage();
      });
    
    // Generate comprehensive statistics
    const stats = {
      total: records.length,
      videos: records.filter(r => r.isVideo).length,
      images: records.filter(r => !r.isVideo).length,
      categories: {},
      mediaTypes: {},
      fileSizes: {
        totalSize: 0,
        averageSize: 0,
        largestFile: null,
        smallestFile: null
      },
      contributors: new Set(),
      tags: new Set()
    };
    
    // Analyze by category
    Object.keys(CARDIAC_CATEGORIES).forEach(category => {
      const categoryRecords = records.filter(r => CARDIAC_CATEGORIES[r.category] === category);
      stats.categories[category] = {
        total: categoryRecords.length,
        videos: categoryRecords.filter(r => r.isVideo).length,
        images: categoryRecords.filter(r => !r.isVideo).length
      };
    });
    
    // Analyze file sizes and collect metadata
    let totalSize = 0;
    let largestFile = null;
    let smallestFile = null;
    
    records.forEach(record => {
      if (record.mediaMetadata && record.mediaMetadata.size) {
        const size = record.mediaMetadata.size;
        totalSize += size;
        
        if (!largestFile || size > largestFile.size) {
          largestFile = { ...record.mediaMetadata, title: record.title };
        }
        if (!smallestFile || size < smallestFile.size) {
          smallestFile = { ...record.mediaMetadata, title: record.title };
        }
      }
      
      // Collect unique contributors and tags
      if (record.contributor) stats.contributors.add(record.contributor);
      record.tags.forEach(tag => stats.tags.add(tag));
    });
    
    stats.fileSizes.totalSize = totalSize;
    stats.fileSizes.averageSize = records.length > 0 ? totalSize / records.length : 0;
    stats.fileSizes.largestFile = largestFile;
    stats.fileSizes.smallestFile = smallestFile;
    
    // Convert sets to arrays for JSON response
    stats.contributors = Array.from(stats.contributors);
    stats.tags = Array.from(stats.tags);
    
    console.log(`📊 Generated statistics for ${records.length} records`);
    res.json(stats);
  } catch (error) {
    console.error('❌ Failed to fetch POCUS statistics:', error);
    res.status(500).json({ error: error.message });
  }
});

// Debug endpoint to see available fields in POCUS Atlas
app.get('/api/pocus/debug/fields', async (req, res) => {
  try {
    const secrets = await getSecrets();
    const base = await initializeAirtable();
    
    const records = [];
    
    await base(secrets.POCUS_AIRTABLE_TABLE_NAME)
      .select({
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
      message: 'POCUS Atlas Uploads table field structure',
      tableName: secrets.POCUS_AIRTABLE_TABLE_NAME,
      baseId: secrets.POCUS_AIRTABLE_BASE_ID,
      fieldsUsed: CARDIAC_FIELDS,
      filter: CARDIAC_FILTER,
      records: records,
      allFieldNames: [...new Set(records.flatMap(r => r.fieldNames))],
      sampleTransformed: records.length > 0 ? transformPocusRecord(records[0]) : null
    });
  } catch (error) {
    console.error('Failed to fetch POCUS debug info:', error);
    res.status(500).json({ error: error.message });
  }
});

// Debug endpoint to check POCUS secret loading status
app.get('/api/pocus/debug/secrets', async (req, res) => {
  try {
    const secrets = await getSecrets();
    
    res.json({
      message: 'POCUS Atlas secret loading status',
      secrets: {
        POCUS_AIRTABLE_API_KEY: secrets.POCUS_AIRTABLE_API_KEY ? 'Loaded' : 'Missing',
        POCUS_AIRTABLE_BASE_ID: secrets.POCUS_AIRTABLE_BASE_ID ? 'Loaded' : 'Missing',
        POCUS_AIRTABLE_TABLE_NAME: secrets.POCUS_AIRTABLE_TABLE_NAME ? 'Loaded' : 'Missing',
        googlescholarapi: secrets.googlescholarapi ? 'Loaded' : 'Missing',
        baseId: secrets.POCUS_AIRTABLE_BASE_ID,
        tableName: secrets.POCUS_AIRTABLE_TABLE_NAME
      }
    });
  } catch (error) {
    console.error('Failed to get POCUS secrets debug info:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/pocus/raw', async (req, res) => {
  try {
    const base = await initializeAirtable();
    const secrets = await getSecrets();
    const records = [];
    
    await base(secrets['POCUS_AIRTABLE_TABLE_NAME'])
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
    console.log('🔗 SerpAPI URL:', serpApiUrl.toString().replace(secrets.googlescholarapi, '[API_KEY_HIDDEN]'));
    
    const response = await axios.get(serpApiUrl.toString());
    
    const data = response.data;
    
    // Log some basic info for debugging
    console.log(`📊 Found ${data.organic_results?.length || 0} results for "${q}"`);
    
    res.json(data);
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

// Faculty research endpoint - specific search for individual faculty members
app.get('/api/faculty/:facultyId/research', async (req, res) => {
  try {
    const secrets = await getSecrets();
    const { facultyId } = req.params;
    const { limit = 5 } = req.query;

    if (!secrets.googlescholarapi) {
      return res.status(503).json({ 
        error: 'Google Scholar search is not available', 
        details: 'googlescholarapi is not configured' 
      });
    }

    // Map faculty IDs to search queries
    const facultySearchQueries = {
      'matthew-riscinti': 'Matthew Riscinti emergency ultrasound',
      'amanda-toney': 'Amanda Toney pediatric emergency ultrasound',
      'nhu-nguyen-le': 'Nhu-Nguyen Le emergency ultrasound',
      'fred-milgrim': 'Fred Milgrim emergency medicine ultrasound',
      'molly-thiessen': 'Molly Thiessen emergency ultrasound',
      'gabe-siegel': 'Gabriel Siegel emergency ultrasound',
      'peter-alsharif': 'Peter Alsharif emergency ultrasound',
      'nithin-ravi': 'Nithin Ravi pediatric emergency ultrasound'
    };

    const query = facultySearchQueries[facultyId] || `${facultyId} emergency ultrasound`;

    const serpApiUrl = new URL('https://serpapi.com/search.json');
    serpApiUrl.searchParams.append('engine', 'google_scholar');
    serpApiUrl.searchParams.append('q', query);
    serpApiUrl.searchParams.append('start', '0');
    serpApiUrl.searchParams.append('num', limit.toString());
    serpApiUrl.searchParams.append('api_key', secrets.googlescholarapi);
    
    console.log(`🔍 Fetching research for faculty ${facultyId}:`, query);
    
    const response = await axios.get(serpApiUrl.toString());
    
    const data = response.data;
    
    console.log(`📊 Found ${data.organic_results?.length || 0} research papers for "${facultyId}"`);
    
    res.json(data);
  } catch (error) {
    console.error(`❌ Failed to fetch research for faculty ${req.params.facultyId}:`, error);
    
    const errorResponse = {
      error: error.message,
      details: `Failed to fetch research for faculty ${req.params.facultyId}`,
      status: error.response?.status,
      serpApiError: error.response?.data
    };
    
    res.status(500).json(errorResponse);
  }
});

// Combined research endpoint for master research page
app.get('/api/research/all', async (req, res) => {
  try {
    const secrets = await getSecrets();
    const { q, start = 0, num = 20 } = req.query;

    if (!secrets.googlescholarapi) {
      return res.status(503).json({ 
        error: 'Google Scholar search is not available', 
        details: 'googlescholarapi is not configured' 
      });
    }

    // Default query for Denver emergency ultrasound research
    const searchQuery = q || 'Denver Health emergency ultrasound OR "Denver emergency ultrasound" OR "Denver Health ultrasound"';

    const serpApiUrl = new URL('https://serpapi.com/search.json');
    serpApiUrl.searchParams.append('engine', 'google_scholar');
    serpApiUrl.searchParams.append('q', searchQuery);
    serpApiUrl.searchParams.append('start', start.toString());
    serpApiUrl.searchParams.append('num', num.toString());
    serpApiUrl.searchParams.append('api_key', secrets.googlescholarapi);
    
    console.log('🔍 Fetching combined research results for:', searchQuery);
    
    const response = await axios.get(serpApiUrl.toString());
    
    const data = response.data;
    
    console.log(`📊 Found ${data.organic_results?.length || 0} combined research results`);
    
    res.json(data);
  } catch (error) {
    console.error('❌ Failed to fetch combined research:', error);
    
    const errorResponse = {
      error: error.message,
      details: 'Failed to fetch combined research results',
      status: error.response?.status,
      serpApiError: error.response?.data
    };
    
    res.status(500).json(errorResponse);
  }
});

// Test endpoint to list available bases
app.get('/api/pocus/debug/bases', async (req, res) => {
  try {
    const secrets = await getSecrets();
    const apiKey = secrets['POCUS_AIRTABLE_API_KEY'];
    
    if (!apiKey) {
      return res.status(500).json({ error: 'No API key available' });
    }
    
    // Use Airtable Meta API to list bases
    const response = await axios.get('https://api.airtable.com/v0/meta/bases', {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    res.json({
      message: 'Available bases for current API key',
      bases: response.data.bases.map(base => ({
        id: base.id,
        name: base.name,
        permissionLevel: base.permissionLevel
      }))
    });
  } catch (error) {
    console.error('❌ Failed to fetch bases:', error);
    res.status(500).json({ 
      error: error.message,
      details: error.response?.data || 'No additional details'
    });
  }
});

// Test endpoint to list tables in the POCUS base
app.get('/api/pocus/debug/tables', async (req, res) => {
  try {
    const secrets = await getSecrets();
    const apiKey = secrets['POCUS_AIRTABLE_API_KEY'];
    const baseId = secrets['POCUS_AIRTABLE_BASE_ID'];
    
    if (!apiKey || !baseId) {
      return res.status(500).json({ error: 'API key or base ID not available' });
    }
    
    // Use Airtable Meta API to list tables in the base
    const response = await axios.get(`https://api.airtable.com/v0/meta/bases/${baseId}/tables`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });
    
    res.json({
      message: `Available tables in base ${baseId}`,
      baseId: baseId,
      tables: response.data.tables.map(table => ({
        id: table.id,
        name: table.name,
        primaryFieldId: table.primaryFieldId,
        fields: table.fields.map(field => ({
          id: field.id,
          name: field.name,
          type: field.type
        }))
      }))
    });
  } catch (error) {
    console.error('❌ Failed to fetch tables:', error);
    res.status(500).json({ 
      error: error.message,
      details: error.response?.data || 'No additional details'
    });
  }
});

// Image proxy endpoint for Airtable images with expired tokens
app.get('/api/pocus/image-proxy', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (urlError) {
      return res.status(400).json({ error: 'Invalid image URL format' });
    }

    console.log(`🖼️ Proxying image: ${url.substring(0, 120)}...`);

    const headers = {
      'User-Agent': 'Mozilla/5.0 (compatible; POCUS-Atlas/1.0)',
      'Referer': 'https://airtable.com/',
      'Origin': 'https://airtable.com',
      'Accept': 'image/*,*/*;q=0.9',
      'Cache-Control': 'no-cache'
    };

    const response = await axios({
      method: 'GET',
      url: url,
      headers: headers,
      responseType: 'stream',
      timeout: 30000,
      validateStatus: (status) => status < 400,
      maxRedirects: 5
    });

    // Set CORS headers
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    // Forward image-specific headers
    const imageHeaders = [
      'content-length',
      'content-type',
      'last-modified',
      'etag',
      'cache-control'
    ];

    imageHeaders.forEach(header => {
      if (response.headers[header]) {
        res.set(header, response.headers[header]);
      }
    });

    // Set default content type if not provided
    if (!response.headers['content-type']) {
      const url_lower = url.toLowerCase();
      if (url_lower.includes('.jpg') || url_lower.includes('.jpeg')) {
        res.set('Content-Type', 'image/jpeg');
      } else if (url_lower.includes('.png')) {
        res.set('Content-Type', 'image/png');
      } else if (url_lower.includes('.gif')) {
        res.set('Content-Type', 'image/gif');
      } else {
        res.set('Content-Type', 'image/jpeg'); // default
      }
    }

    res.status(response.status);

    // Handle streaming with error recovery
    response.data.on('error', (streamError) => {
      console.error('❌ Image stream error:', streamError.message);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Image stream interrupted' });
      }
    });

    response.data.on('end', () => {
      console.log('✅ Image stream completed successfully');
    });

    response.data.pipe(res);

  } catch (error) {
    console.error('❌ Image proxy error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: req.query.url?.substring(0, 100) + '...'
    });

    if (!res.headersSent) {
      if (error.code === 'ECONNABORTED') {
        res.status(408).json({ error: 'Image request timeout' });
      } else if (error.response?.status === 404) {
        res.status(404).json({ error: 'Image not found' });
      } else if (error.response?.status === 403) {
        res.status(403).json({ error: 'Image access forbidden' });
      } else {
        res.status(500).json({ error: 'Failed to proxy image' });
      }
    }
  }
});

// Enhanced video proxy endpoint with comprehensive streaming support
app.get('/api/pocus/video-proxy', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'Video URL is required' });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch (urlError) {
      return res.status(400).json({ error: 'Invalid video URL format' });
    }

    const rangeHeader = req.headers.range;
    console.log(`🎥 Proxying video${rangeHeader ? ' with range ' + rangeHeader : ''}: ${url.substring(0, 120)}...`);

    // Enhanced headers for better compatibility
    const headers = {
      'User-Agent': 'Mozilla/5.0 (compatible; POCUS-Atlas/1.0)',
      'Referer': 'https://airtable.com/',
      'Origin': 'https://airtable.com',
      'Accept': 'video/*,*/*;q=0.9',
      'Accept-Encoding': 'identity', // Prevent compression for video streaming
      'Cache-Control': 'no-cache'
    };

    if (rangeHeader) {
      headers['Range'] = rangeHeader;
      console.log(`📊 Range request: ${rangeHeader}`);
    }

    const response = await axios({
      method: 'GET',
      url: url,
      headers: headers,
      responseType: 'stream',
      timeout: 30000, // 30 second timeout
      validateStatus: (status) => status < 400 || status === 206 || status === 416,
      maxRedirects: 5
    });

    // Set CORS headers for video streaming
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Range, Content-Type');
    res.set('Access-Control-Expose-Headers', 'Content-Length, Content-Range, Accept-Ranges');

    // Forward video-specific headers
    const videoHeaders = [
      'content-length',
      'content-type', 
      'content-range',
      'accept-ranges',
      'last-modified',
      'etag',
      'cache-control'
    ];

    videoHeaders.forEach(header => {
      if (response.headers[header]) {
        res.set(header, response.headers[header]);
      }
    });

    // Set appropriate content type if not provided
    if (!response.headers['content-type']) {
      res.set('Content-Type', 'video/mp4');
    }

    // Enable range requests for video seeking
    if (!response.headers['accept-ranges']) {
      res.set('Accept-Ranges', 'bytes');
    }

    res.status(response.status);

    // Handle streaming with error recovery
    response.data.on('error', (streamError) => {
      console.error('❌ Video stream error:', streamError.message);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Video stream interrupted' });
      }
    });

    response.data.on('end', () => {
      console.log('✅ Video stream completed successfully');
    });

    response.data.pipe(res);

  } catch (error) {
    console.error('❌ Video proxy error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: req.query.url?.substring(0, 100) + '...'
    });

    if (!res.headersSent) {
      if (error.code === 'ECONNABORTED') {
        res.status(408).json({ error: 'Video request timeout' });
      } else if (error.response?.status === 404) {
        res.status(404).json({ error: 'Video not found' });
      } else if (error.response?.status === 403) {
        res.status(403).json({ error: 'Video access forbidden' });
      } else {
        res.status(500).json({ error: 'Failed to proxy video' });
      }
    }
  }
});

// Video metadata endpoint
app.get('/api/pocus/video-info', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'Video URL is required' });
    }

    console.log(`🔍 Getting video info for: ${url.substring(0, 120)}...`);

    // Make HEAD request to get video metadata without downloading
    const response = await axios({
      method: 'HEAD',
      url: url,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; POCUS-Atlas/1.0)',
        'Referer': 'https://airtable.com/',
        'Accept': 'video/*,*/*;q=0.9'
      },
      timeout: 10000,
      validateStatus: (status) => status < 400
    });

    const videoInfo = {
      url: url,
      contentType: response.headers['content-type'] || 'unknown',
      contentLength: response.headers['content-length'] ? parseInt(response.headers['content-length']) : null,
      acceptRanges: response.headers['accept-ranges'] || 'none',
      lastModified: response.headers['last-modified'] || null,
      etag: response.headers['etag'] || null,
      supportsStreaming: response.headers['accept-ranges'] === 'bytes',
      fileSizeMB: response.headers['content-length'] ? 
        (parseInt(response.headers['content-length']) / 1024 / 1024).toFixed(2) : null
    };

    console.log(`📊 Video info retrieved:`, videoInfo);
    res.json(videoInfo);

  } catch (error) {
    console.error('❌ Failed to get video info:', error.message);
    res.status(500).json({ 
      error: 'Failed to get video information',
      details: error.message 
    });
  }
});

// Catch all handler for React routes
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
  
  // Test connection on startup
  getSecrets()
    .then(() => console.log('✅ Initial secret fetch successful'))
    .catch(err => console.error('❌ Initial secret fetch failed:', err.message));
});

module.exports = app; 