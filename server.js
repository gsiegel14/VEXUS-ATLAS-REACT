require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const https = require('https');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const Airtable = require('airtable');
const axios = require('axios');
const { ALLOWED_AUTHORS } = require('./research/authors');

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

// -------- Research feed: simple in-memory caches + utils --------
const MONTH_MS = 30 * 24 * 60 * 60 * 1000;
const MAX_CONCURRENT_SERP = 3;
let serpInFlight = 0;
const serpQueue = [];

const perAuthorCache = new Map(); // key -> { fetchedAt, data }
const combinedCache = new Map(); // key -> { builtAt, data }

function normalize(str) {
  if (!str || typeof str !== 'string') return '';
  return str.normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim();
}

function authorKey(author) {
  return normalize(author.canonical);
}

function perAuthorCacheKey(author, ylo, yhi) {
  return `per:${authorKey(author)}|${ylo || ''}|${yhi || ''}`;
}

function combinedCacheKey(authors, ylo, yhi) {
  const list = authors.map(a => authorKey(a)).join('|');
  return `combo:${list}|${ylo || ''}|${yhi || ''}`;
}

function withSerpConcurrency(fn) {
  return new Promise((resolve, reject) => {
    const run = () => {
      serpInFlight++;
      Promise.resolve()
        .then(fn)
        .then((v) => resolve(v))
        .catch((e) => reject(e))
        .finally(() => {
          serpInFlight--;
          const next = serpQueue.shift();
          if (next) next();
        });
    };
    if (serpInFlight < MAX_CONCURRENT_SERP) run();
    else serpQueue.push(run);
  });
}

function extractYear(result) {
  const direct = result?.publication_info?.year;
  if (typeof direct === 'number') return direct;
  if (typeof direct === 'string') {
    const m = direct.match(/(19|20)\d{2}/);
    if (m) return parseInt(m[0], 10);
  }
  // Try summary/snippet
  const summary = result?.publication_info?.summary || '';
  const text = `${summary} ${result?.snippet || ''}`;
  const m = text.match(/(19|20)\d{2}/);
  if (m) return parseInt(m[0], 10);
  return undefined;
}

function extractDOI(result) {
  const link = result?.link || '';
  try {
    const url = new URL(link);
    if (url.hostname.includes('doi.org')) {
      return url.pathname.replace(/^\//, '');
    }
  } catch (_) {}
  // Try resources if available
  const resources = Array.isArray(result?.resources) ? result.resources : [];
  for (const r of resources) {
    try {
      const u = new URL(r?.link);
      if (u.hostname.includes('doi.org')) return u.pathname.replace(/^\//, '');
    } catch (_) {}
  }
  return undefined;
}

function likelySameAuthor(allowedCanonical, candidateName) {
  const a = normalize(allowedCanonical);
  const c = normalize(candidateName);
  if (!a || !c) return false;
  if (a === c) return true;
  const at = a.split(' ');
  const ct = c.split(' ');
  const aFirst = at[0] || '';
  const aLast = at[at.length - 1] || '';
  const cLast = ct[ct.length - 1] || '';
  if (aLast && cLast && aLast === cLast) {
    // Check if candidate contains full first or just initial
    if (c.includes(aFirst)) return true;
    if (aFirst && ct[0] && ct[0][0] === aFirst[0]) return true;
  }
  return false;
}

function matchesAnyVariant(author, candidateName) {
  // Exact/close match against variants, then fallback to likelySameAuthor
  const c = normalize(candidateName);
  if (!c) return false;
  for (const v of author.variants || []) {
    if (normalize(v) === c) return true;
  }
  return likelySameAuthor(author.canonical, candidateName);
}

function postFilterByAuthorVariants(results, author) {
  if (!Array.isArray(results)) return [];
  return results.filter((r) => {
    const authors = r?.publication_info?.authors || [];
    for (const a of authors) {
      const nm = a?.name || '';
      if (matchesAnyVariant(author, nm)) return true;
    }
    return false;
  });
}

function dedupeResults(results) {
  const seenDOI = new Set();
  const seenHostTitle = new Set();
  const seenIds = new Set();
  const out = [];
  for (const r of results) {
    const doi = r.__dedupe?.doi;
    const id = r.result_id || r.position || r.link || r.title;
    const hostTitle = r.__dedupe?.hostTitle;
    if (doi) {
      if (seenDOI.has(doi)) continue;
      seenDOI.add(doi);
    } else if (hostTitle) {
      if (seenHostTitle.has(hostTitle)) continue;
      seenHostTitle.add(hostTitle);
    } else if (id) {
      if (seenIds.has(id)) continue;
      seenIds.add(id);
    }
    out.push(r);
  }
  return out;
}

function sortResults(results) {
  return results.slice().sort((a, b) => {
    const ay = a.year || 0;
    const by = b.year || 0;
    if (ay !== by) return by - ay;
    const ap = a.position || 1e9;
    const bp = b.position || 1e9;
    return ap - bp;
  });
}

async function fetchScholarForAuthor({ author, ylo, yhi, num, affiliation, apiKey }) {
  const serpApiUrl = new URL('https://serpapi.com/search.json');
  serpApiUrl.searchParams.append('engine', 'google_scholar');
  const query = `"${author.canonical}" "${affiliation || 'Denver Health'}"`;
  serpApiUrl.searchParams.append('q', query);
  serpApiUrl.searchParams.append('num', String(num || 10));
  serpApiUrl.searchParams.append('start', '0');
  if (ylo) serpApiUrl.searchParams.append('as_ylo', String(ylo));
  if (yhi) serpApiUrl.searchParams.append('as_yhi', String(yhi));
  // NOTE: We intentionally skip as_sdt (citations/patents) to avoid accidental inclusions; post-filter handles noise.
  serpApiUrl.searchParams.append('api_key', apiKey);
  console.log(`🔎 Scholar query for ${author.canonical}: ${query}`);
  const resp = await withSerpConcurrency(() => axios.get(serpApiUrl.toString(), { timeout: 12000 }));
  const data = resp.data || {};
  const organic = Array.isArray(data.organic_results) ? data.organic_results : [];
  console.log(`📄 Results for ${author.canonical} (${affiliation}): raw=${organic.length}`);

  // Map & minimally normalize structure; compute dedupe helpers
  const mapped = organic.map((r) => {
    let host = '';
    try { host = new URL(r.link).hostname.replace(/^www\./, ''); } catch (_) {}
    const titleNorm = normalize(r.title || '');
    const doi = extractDOI(r);
    const year = extractYear(r);
    return {
      result_id: r.result_id,
      title: r.title,
      link: r.link,
      publication_info: r.publication_info,
      snippet: r.snippet,
      position: r.position,
      resources: r.resources,
      year,
      __dedupe: {
        doi,
        hostTitle: host && titleNorm ? `${host}|${titleNorm}` : undefined,
      },
    };
  });

  return mapped;
}

async function getPerAuthorResults({ author, ylo, yhi, num, apiKey }) {
  const key = perAuthorCacheKey(author, ylo, yhi);
  const cached = perAuthorCache.get(key);
  if (cached && Date.now() - cached.fetchedAt < MONTH_MS) {
    console.log(`🟢 Per-author cache HIT for ${author.canonical} [${ylo || ''}-${yhi || ''}]`);
    return { data: cached.data, fromCache: true };
  }
  console.log(`🟠 Per-author cache MISS for ${author.canonical} [${ylo || ''}-${yhi || ''}]`);
  try {
    const affiliations = Array.isArray(author.affiliations) && author.affiliations.length > 0
      ? author.affiliations
      : ['Denver Health'];
    let filtered = [];
    for (let i = 0; i < Math.min(affiliations.length, 2); i++) {
      const aff = affiliations[i];
      const raw = await fetchScholarForAuthor({ author, ylo, yhi, num, affiliation: aff, apiKey });
      filtered = postFilterByAuthorVariants(raw, author);
      console.log(`🧮 Filtered for ${author.canonical} (${aff}): ${filtered.length}`);
      if (filtered.length > 0) break;
    }
    perAuthorCache.set(key, { fetchedAt: Date.now(), data: filtered });
    return { data: filtered, fromCache: false };
  } catch (err) {
    if (err?.response?.status === 429) {
      const retryAfter = err?.response?.headers?.['retry-after'];
      console.warn(`⛔️ SerpAPI 429 for ${author.canonical}; serving stale if available`);
      if (cached) return { data: cached.data, fromCache: true, rateLimited: true, retryAfter };
      throw Object.assign(new Error('Rate limited'), { rateLimited: true, retryAfter });
    }
    console.error(`❌ Per-author fetch failed for ${author.canonical}:`, err.message);
    if (cached) return { data: cached.data, fromCache: true, error: err };
    throw err;
  }
}

async function buildCombined({ authors, ylo, yhi, perAuthorLimit, apiKey }) {
  const tasks = authors.map((author) => () => getPerAuthorResults({ author, ylo, yhi, num: perAuthorLimit, apiKey }));
  const results = [];
  let rateLimited = false;
  let retryAfter;
  for (const task of tasks) {
    try {
      const { data, rateLimited: rl, retryAfter: ra } = await task();
      if (rl) { rateLimited = true; retryAfter = retryAfter || ra; }
      results.push(...data);
    } catch (err) {
      if (err?.rateLimited) { rateLimited = true; retryAfter = retryAfter || err.retryAfter; }
      // continue; partial results are acceptable
    }
  }
  const deduped = dedupeResults(results);
  const sorted = sortResults(deduped);
  return { items: sorted, rateLimited, retryAfter };
}

function scheduleBackgroundCombinedRefresh({ authors, ylo, yhi, perAuthorLimit, apiKey }) {
  const delay = Math.floor(Math.random() * 5000) + 2000; // 2-7s jitter
  setTimeout(async () => {
    try {
      const { items } = await buildCombined({ authors, ylo, yhi, perAuthorLimit, apiKey });
      const cKey = combinedCacheKey(authors, ylo, yhi);
      combinedCache.set(cKey, { builtAt: Date.now(), data: items });
      console.log(`🔄 Background refresh complete: combined cache rebuilt (${items.length} items)`);
    } catch (e) {
      console.warn('⚠️ Background combined refresh failed:', e.message);
    }
  }, delay);
}


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
      console.log('✅ Google Scholar API secret loaded from Secret Manager');
    } catch (error) {
      console.log('⚠️  Google Scholar API secret not available in Secret Manager:', error.message);
      secrets['googlescholarapi'] = null;
    }

    // Environment fallback for local dev
    if (!secrets['googlescholarapi']) {
      const envKey = process.env.SERPAPI_KEY || process.env.GOOGLE_SCHOLAR_API_KEY || process.env.SERPAPI_API_KEY;
      if (envKey) {
        secrets['googlescholarapi'] = envKey;
        console.log('✅ Google Scholar API key loaded from environment');
      }
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

// Global Research feed (authors-only by default)
app.get('/api/research/all', async (req, res) => {
  try {
    const secrets = await getSecrets();
    if (!secrets.googlescholarapi) {
      return res.status(503).json({ error: 'googlescholarapi not configured' });
    }

    const authorsOnly = req.query.authors_only !== '0'; // default true
    const start = Math.max(0, parseInt(String(req.query.start || '0'), 10) || 0);
    const num = Math.min(50, Math.max(1, parseInt(String(req.query.num || '20'), 10) || 20));
    const year_from = req.query.year_from ? parseInt(String(req.query.year_from), 10) : undefined;
    const year_to = req.query.year_to ? parseInt(String(req.query.year_to), 10) : undefined;

    if (!authorsOnly) {
      const q = String(req.query.q || '').trim();
      if (!q) return res.status(400).json({ error: 'q is required when authors_only=0' });
      const serpApiUrl = new URL('https://serpapi.com/search.json');
      serpApiUrl.searchParams.append('engine', 'google_scholar');
      serpApiUrl.searchParams.append('q', q);
      serpApiUrl.searchParams.append('start', String(start));
      serpApiUrl.searchParams.append('num', String(num));
      if (year_from) serpApiUrl.searchParams.append('as_ylo', String(year_from));
      if (year_to) serpApiUrl.searchParams.append('as_yhi', String(year_to));
      serpApiUrl.searchParams.append('api_key', secrets.googlescholarapi);
      const resp = await withSerpConcurrency(() => axios.get(serpApiUrl.toString(), { timeout: 12000 }));
      const data = resp.data || {};
      const organic = Array.isArray(data.organic_results) ? data.organic_results : [];
      const mapped = organic.map((r) => ({
        result_id: r.result_id,
        title: r.title,
        link: r.link,
        publication_info: r.publication_info,
        snippet: r.snippet,
        position: r.position,
        resources: r.resources,
        year: extractYear(r),
      }));
      return res.json({
        results: mapped,
        total: mapped.length,
        start,
        num,
        source: 'live',
        authors_only: false,
        year_from,
        year_to,
      });
    }

    // Authors-only path
    const authors = ALLOWED_AUTHORS;
    const cKey = combinedCacheKey(authors, year_from, year_to);
    const cVal = combinedCache.get(cKey);
    const perAuthorCapParam = req.query.per_author ? parseInt(String(req.query.per_author), 10) : undefined;
    const computedPerAuthor = Math.ceil(num / Math.max(1, authors.length)) + 2;
    const perAuthorLimit = Math.max(1, Math.min(8, perAuthorCapParam || computedPerAuthor));

    if (cVal) {
      const age = Date.now() - cVal.builtAt;
      const fresh = age < MONTH_MS;
      if (!fresh) {
        // Serve stale and refresh in background
        scheduleBackgroundCombinedRefresh({ authors, ylo: year_from, yhi: year_to, perAuthorLimit, apiKey: secrets.googlescholarapi });
      }
      const total = cVal.data.length;
      const page = cVal.data.slice(start, start + num);
      return res.json({
        results: page,
        total,
        start,
        num,
        source: fresh ? 'cache' : 'stale',
        cache_age_ms: age,
        authors_only: true,
        year_from,
        year_to,
      });
    }

    // Cache missing: build now
    const { items, rateLimited, retryAfter } = await buildCombined({ authors, ylo: year_from, yhi: year_to, perAuthorLimit, apiKey: secrets.googlescholarapi });
    combinedCache.set(cKey, { builtAt: Date.now(), data: items });
    const total = items.length;
    const page = items.slice(start, start + num);
    return res.json({
      results: page,
      total,
      start,
      num,
      source: rateLimited ? 'live_partial' : 'live',
      rateLimited: !!rateLimited,
      retryAfter,
      cache_age_ms: 0,
      authors_only: true,
      year_from,
      year_to,
    });
  } catch (error) {
    console.error('❌ /api/research/all error:', error.message);
    // Fallback to any combined cache (default key without years) if available
    try {
      const authors = ALLOWED_AUTHORS;
      const cKey = combinedCacheKey(authors, undefined, undefined);
      const cVal = combinedCache.get(cKey);
      if (cVal) {
        const total = cVal.data.length;
        const start = 0;
        const num = Math.min(20, total);
        return res.status(200).json({
          results: cVal.data.slice(start, start + num),
          total,
          start,
          num,
          source: 'stale',
          cache_age_ms: Date.now() - cVal.builtAt,
          authors_only: true,
        });
      }
    } catch (_) {}
    res.status(500).json({ error: error.message || 'Unknown error' });
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
      // Warm combined cache on boot if cold (authors-only, default years)
      (async () => {
        try {
          const secrets = await getSecrets();
          if (!secrets.googlescholarapi) return;
          const authors = ALLOWED_AUTHORS;
          const key = combinedCacheKey(authors, undefined, undefined);
          if (!combinedCache.get(key)) {
            console.log('🔥 Warming research combined cache on boot...');
            const perAuthorLimit = Math.min(8, Math.ceil(20 / Math.max(1, authors.length)) + 2);
            const { items } = await buildCombined({ authors, ylo: undefined, yhi: undefined, perAuthorLimit, apiKey: secrets.googlescholarapi });
            combinedCache.set(key, { builtAt: Date.now(), data: items });
            console.log(`✅ Warmed combined cache (${items.length} items)`);
          }
        } catch (e) {
          console.warn('⚠️ Warm-on-boot failed:', e.message);
        }
      })();

      // Nightly background refresh of per-author and combined cache (authors-only, default years)
      const ONE_DAY_MS = 24 * 60 * 60 * 1000;
      setInterval(async () => {
        try {
          const secrets = await getSecrets();
          if (!secrets.googlescholarapi) return;
          console.log('🌙 Nightly research cache refresh starting...');
          const authors = ALLOWED_AUTHORS;
          const perAuthorLimit = Math.min(8, Math.ceil(20 / Math.max(1, authors.length)) + 2);
          // Refresh per-author cache
          for (const author of authors) {
            try { await getPerAuthorResults({ author, ylo: undefined, yhi: undefined, num: perAuthorLimit, apiKey: secrets.googlescholarapi }); } catch (_) {}
          }
          // Rebuild combined
          const { items } = await buildCombined({ authors, ylo: undefined, yhi: undefined, perAuthorLimit, apiKey: secrets.googlescholarapi });
          const key = combinedCacheKey(authors, undefined, undefined);
          combinedCache.set(key, { builtAt: Date.now(), data: items });
          console.log('🌙 Nightly research cache refresh complete');
        } catch (e) {
          console.warn('⚠️ Nightly refresh error:', e.message);
        }
      }, ONE_DAY_MS);
    })
    .catch(error => {
      console.error('❌ Initial secret fetch failed:', error);
    });
});

module.exports = app; 
