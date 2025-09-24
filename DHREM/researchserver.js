const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const axios = require('axios');
const fs = require('fs').promises;
const crypto = require('crypto');
// Inline authors list (replaces external research/authors.js)
const ALLOWED_AUTHORS = [
  { canonical: 'Matthew Riscinti', slug: 'matthew-riscinti', variants: ['Matthew Riscinti', 'M. Riscinti', 'M Riscinti'] },
  { canonical: 'Amanda Toney', slug: 'amanda-toney', authorId: '0ng0NC8AAAAJ', variants: ['Amanda Toney', 'A. Toney', 'A Toney'] },
  { canonical: 'Nhu-Nguyen Le', slug: 'nhu-nguyen-le', authorId: 'McxOucoAAAAJ', variants: ['Nhu-Nguyen Le', 'N. Le', 'N Le', 'Nhu Nguyen Le'] },
  { canonical: 'Fred Milgrim', slug: 'fred-milgrim', authorId: '_95Go9AAAAAJ', variants: ['Fred Milgrim', 'F. Milgrim', 'F Milgrim', 'Fred N. Milgrim'] },
  { canonical: 'Molly Thiessen', slug: 'molly-thiessen', authorId: 'J8hM6OAAAAAJ', variants: ['Molly Thiessen', 'M. Thiessen', 'M Thiessen'] },
  { canonical: 'Gabriel Siegel', slug: 'gabriel-siegel', authorId: 'XKnXMIkAAAAJ', variants: ['Gabriel Siegel', 'G. Siegel', 'G Siegel', 'Gabe Siegel'] },
  { canonical: 'Peter Alsharif', slug: 'peter-alsharif', authorId: 'DGtqTA0AAAAJ', variants: ['Peter Alsharif', 'P. Alsharif', 'P Alsharif'] },
  { canonical: 'Nithin Ravi', slug: 'nithin-ravi', variants: ['Nithin Ravi', 'N. Ravi', 'N Ravi'] },
  { canonical: 'Juliana Wilson', slug: 'juliana-wilson', variants: ['Juliana Wilson', 'J. Wilson', 'J Wilson'] },
  { canonical: 'Samuel Lam', slug: 'samuel-lam', variants: ['Samuel Lam', 'S. Lam', 'S Lam', 'Samuel H.F.L. Lam', 'Samuel H. F. L. Lam'] },
  { canonical: 'Joe Brown', slug: 'joe-brown', variants: ['Joe Brown', 'J. Brown', 'J Brown', 'Joseph Brown'] },
  { canonical: 'Philippe Ayres', slug: 'philippe-ayres', authorId: 'IJP4K9QAAAAJ', variants: ['Philippe Ayres', 'P. Ayres', 'P Ayres'] },
  { canonical: 'Michael Heffler', slug: 'michael-heffler', authorId: 'nqM3RiUAAAAJ', variants: ['Michael Heffler', 'M. Heffler', 'M Heffler'] },
  { canonical: 'Priya Prasher', slug: 'priya-prasher', authorId: 'pXMunFoAAAAJ', variants: ['Priya Prasher', 'P. Prasher', 'P Prasher'] },
];

// In-memory cache for discovered author IDs (avoids repeated lookups during a process lifetime)
const discoveredAuthorIdCache = new Map();

const app = express();
const PORT = process.env.PORT || 4001;

// Production-ready middleware
if (process.env.NODE_ENV === 'production') {
  // Security middleware for production
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }));
  
  // Compression for production
  app.use(compression());
}

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [
        'https://dhrem-research-*.run.app', // Cloud Run domain pattern
        'https://research.denverhealth.org', // Custom domain if configured
        'https://dhrem-research.denverhealth.org'
      ] 
    : ['http://localhost:4001', 'http://localhost:5173', 'http://localhost:8080', 'http://localhost:8081'],
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting for production
const createRateLimit = (windowMs, max, message) => rateLimit({
  windowMs,
  max,
  message: { error: message },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limiting
app.use('/api/', createRateLimit(
  15 * 60 * 1000, // 15 minutes
  process.env.NODE_ENV === 'production' ? 100 : 1000, // 100 requests per 15 minutes in production
  'Too many requests from this IP, please try again later.'
));

// Strict rate limiting for Google Scholar API
app.use('/api/scholar/', createRateLimit(
  60 * 1000, // 1 minute
  process.env.NODE_ENV === 'production' ? 10 : 50, // 10 requests per minute in production
  'Too many search requests, please wait before trying again.'
));

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'dist')));

// Structured logging utility
const log = {
  info: (message, meta = {}) => {
    console.log(JSON.stringify({
      level: 'info',
      timestamp: new Date().toISOString(),
      message,
      ...meta
    }));
  },
  error: (message, error = null, meta = {}) => {
    console.error(JSON.stringify({
      level: 'error',
      timestamp: new Date().toISOString(),
      message,
      error: error ? {
        message: error.message,
        stack: error.stack,
        status: error.response?.status,
        data: error.response?.data
      } : null,
      ...meta
    }));
  },
  warn: (message, meta = {}) => {
    console.warn(JSON.stringify({
      level: 'warn',
      timestamp: new Date().toISOString(),
      message,
      ...meta
    }));
  }
};

// Initialize Google Secret Manager with production-ready configuration
// Use REST API to avoid gRPC/OpenSSL decoder issues
const PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || '314467722862';

// Set credentials path for local development
if (process.env.NODE_ENV !== 'production' && !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(__dirname, 'google-credentials-production.json');
}

const secretClient = new SecretManagerServiceClient({
  projectId: PROJECT_ID,
  fallback: 'rest' // Force REST transport to avoid gRPC issues
});

// Enhanced caching for secrets
let secretsCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = process.env.NODE_ENV === 'production' ? 10 * 60 * 1000 : 5 * 60 * 1000; // 10 minutes in production

// Google Scholar API Monthly Caching System
const CACHE_DIR = path.join(__dirname, 'cache');
const MONTHLY_CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds (faster refresh)
const CACHE_VERSION = '1.2'; // Increment this to invalidate all caches

// Ensure cache directory exists
async function ensureCacheDir() {
  try {
    await fs.access(CACHE_DIR);
  } catch {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    log.info('Created cache directory', { path: CACHE_DIR });
  }
}

// Generate cache key from query parameters
function generateCacheKey(query, start = 0, num = 10, facultyId = null) {
  const keyData = {
    query: query.toLowerCase().trim(),
    start: parseInt(start),
    num: parseInt(num),
    facultyId,
    version: CACHE_VERSION
  };
  
  const keyString = JSON.stringify(keyData);
  return crypto.createHash('sha256').update(keyString).digest('hex');
}

// Get cache file path
function getCacheFilePath(cacheKey) {
  return path.join(CACHE_DIR, `${cacheKey}.json`);
}

// Check if cache is valid (not expired)
function isCacheValid(cacheData) {
  if (!cacheData || !cacheData.timestamp || !cacheData.version) {
    return false;
  }
  
  // Check version compatibility
  if (cacheData.version !== CACHE_VERSION) {
    return false;
  }
  
  // Check if cache is within monthly duration
  const now = Date.now();
  const cacheAge = now - cacheData.timestamp;
  return cacheAge < MONTHLY_CACHE_DURATION;
}

// Read from cache
async function readFromCache(cacheKey) {
  try {
    const cacheFilePath = getCacheFilePath(cacheKey);
    const cacheContent = await fs.readFile(cacheFilePath, 'utf8');
    const cacheData = JSON.parse(cacheContent);
    
    if (isCacheValid(cacheData)) {
      log.info('Cache hit - returning cached data', { 
        cacheKey: cacheKey.substring(0, 8) + '...', 
        age: Math.round((Date.now() - cacheData.timestamp) / (1000 * 60 * 60 * 24)) + ' days',
        resultsCount: cacheData.data?.organic_results?.length || 0
      });
      return cacheData.data;
    } else {
      log.info('Cache expired - will fetch fresh data', { 
        cacheKey: cacheKey.substring(0, 8) + '...',
        expired: true
      });
      // Clean up expired cache file
      await fs.unlink(cacheFilePath).catch(() => {});
      return null;
    }
  } catch (error) {
    if (error.code !== 'ENOENT') {
      log.warn('Error reading cache file', { cacheKey: cacheKey.substring(0, 8) + '...', error: error?.message });
    }
    return null;
  }
}

// Write to cache
async function writeToCache(cacheKey, data) {
  try {
    await ensureCacheDir();
    
    const cacheData = {
      timestamp: Date.now(),
      version: CACHE_VERSION,
      data: data,
      metadata: {
        resultsCount: data?.organic_results?.length || 0,
        cachedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + MONTHLY_CACHE_DURATION).toISOString()
      }
    };
    
    const cacheFilePath = getCacheFilePath(cacheKey);
    await fs.writeFile(cacheFilePath, JSON.stringify(cacheData, null, 2));
    
    log.info('Data cached successfully', { 
      cacheKey: cacheKey.substring(0, 8) + '...',
      resultsCount: cacheData.metadata.resultsCount,
      expiresAt: cacheData.metadata.expiresAt
    });
  } catch (error) {
    log.error('Error writing to cache', error, { cacheKey: cacheKey.substring(0, 8) + '...' });
  }
}

// Clean up expired cache files (run periodically)
async function cleanupExpiredCache() {
  try {
    await ensureCacheDir();
    const files = await fs.readdir(CACHE_DIR);
    let cleanedCount = 0;
    
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      
      try {
        const filePath = path.join(CACHE_DIR, file);
        const content = await fs.readFile(filePath, 'utf8');
        const cacheData = JSON.parse(content);
        
        if (!isCacheValid(cacheData)) {
          await fs.unlink(filePath);
          cleanedCount++;
        }
      } catch (error) {
        // If we can't read/parse the file, delete it
        await fs.unlink(path.join(CACHE_DIR, file)).catch(() => {});
        cleanedCount++;
      }
    }
    
    if (cleanedCount > 0) {
      log.info('Cleaned up expired cache files', { cleanedCount });
    }
  } catch (error) {
    log.error('Error during cache cleanup', error);
  }
}

// Get cache statistics
async function getCacheStats() {
  try {
    await ensureCacheDir();
    const files = await fs.readdir(CACHE_DIR);
    const jsonFiles = files.filter(f => f.endsWith('.json'));
    
    let validCaches = 0;
    let expiredCaches = 0;
    let totalSize = 0;
    
    for (const file of jsonFiles) {
      try {
        const filePath = path.join(CACHE_DIR, file);
        const stats = await fs.stat(filePath);
        totalSize += stats.size;
        
        const content = await fs.readFile(filePath, 'utf8');
        const cacheData = JSON.parse(content);
        
        if (isCacheValid(cacheData)) {
          validCaches++;
        } else {
          expiredCaches++;
        }
      } catch {
        expiredCaches++;
      }
    }
    
    return {
      totalFiles: jsonFiles.length,
      validCaches,
      expiredCaches,
      totalSizeKB: Math.round(totalSize / 1024),
      cacheDir: CACHE_DIR
    };
  } catch (error) {
    log.error('Error getting cache stats', error);
    return { error: error.message };
  }
}

const sanitizeScholarResult = (result) => {
  if (!result || typeof result !== 'object') return result;
  return { ...result };
};

const sanitizeOrganicResults = (results) => {
  if (!Array.isArray(results)) return [];
  return results.map(sanitizeScholarResult);
};

const sanitizeResearchPayload = (payload) => {
  if (!payload || typeof payload !== 'object') return payload;
  const cleaned = { ...payload };
  if (Array.isArray(cleaned.organic_results)) {
    cleaned.organic_results = sanitizeOrganicResults(cleaned.organic_results);
  }
  return cleaned;
};

// Discover a Google Scholar author_id by canonical name using SerpAPI profiles, with monthly caching
async function discoverAuthorIdByName(canonicalName) {
  try {
    const discoveryKey = generateCacheKey(`profiles:${canonicalName}`, 0, 1, 'authorDiscovery');
    const cached = await readFromCache(discoveryKey);
    if (cached && cached.authorId) {
      return cached.authorId;
    }

    const secrets = await getSecrets();
    if (!secrets.googlescholarapi) return null;

    const url = new URL('https://serpapi.com/search.json');
    url.searchParams.append('engine', 'google_scholar_profiles');
    url.searchParams.append('mauthors', canonicalName);
    url.searchParams.append('api_key', secrets.googlescholarapi);

    const response = await axios.get(url.toString(), { timeout: 20000 });
    const profiles = Array.isArray(response.data?.profiles) ? response.data.profiles : [];
    const best = profiles[0];
    const authorId = best?.author_id || null;

    await writeToCache(discoveryKey, { authorId, candidates: profiles.map(p => ({ author_id: p.author_id, name: p.name })) });
    return authorId;
  } catch (e) {
    log.warn('Author ID discovery failed', { nameTried: canonicalName, error: e?.message });
    return null;
  }
}

// Fetch author articles via SerpAPI author endpoint and map to organic_results shape
async function fetchAuthorArticlesById(authorId, options = {}) {
  const config = typeof options === 'number' ? { limit: options } : { ...options };

  const limit = Number.isFinite(config.limit) && config.limit > 0 ? config.limit : null;
  const pageSizeCandidate = Number.isFinite(config.pageSize) && config.pageSize > 0
    ? config.pageSize
    : (limit ? Math.min(limit, 100) : 100);
  const pageSize = Math.min(pageSizeCandidate, 100); // SerpAPI caps at 100 per request
  const maxPages = Number.isFinite(config.maxPages) && config.maxPages > 0 ? config.maxPages : 10;
  const sort = config.sort || 'pubdate';

  const providedApiKey = typeof config.apiKey === 'string' && config.apiKey.trim().length > 0
    ? config.apiKey.trim()
    : null;

  let apiKey = providedApiKey;
  if (!apiKey) {
    const secrets = await getSecrets();
    apiKey = secrets.googlescholarapi;
  }

  if (!apiKey) {
    return [];
  }

  const aggregatedArticles = [];
  let start = 0;
  let pageCount = 0;

  while (true) {
    const url = new URL('https://serpapi.com/search.json');
    url.searchParams.append('engine', 'google_scholar_author');
    url.searchParams.append('author_id', authorId);
    url.searchParams.append('sort', sort);
    url.searchParams.append('num', String(pageSize));
    url.searchParams.append('api_key', apiKey);
    if (start > 0) {
      url.searchParams.append('start', String(start));
    }

    const response = await axios.get(url.toString(), {
      timeout: 30000,
      headers: { 'User-Agent': 'DHREM-Research-Portal/1.0' }
    });

    const pageArticles = Array.isArray(response.data?.articles) ? response.data.articles : [];
    aggregatedArticles.push(...pageArticles);

    const reachedLimit = Boolean(limit) && aggregatedArticles.length >= limit;
    const pagination = response.data?.serpapi_pagination;
    const hasNextPage = pagination?.next && pageArticles.length === pageSize;

    pageCount += 1;

    if (reachedLimit || !hasNextPage || pageCount >= maxPages) {
      break;
    }

    if (typeof pagination.next_offset === 'number') {
      start = pagination.next_offset;
    } else if (typeof pagination.current_start_index === 'number') {
      start = pagination.current_start_index + pageSize;
    } else {
      start += pageSize;
    }
  }

  const normalizedArticles = limit
    ? aggregatedArticles.slice(0, limit)
    : aggregatedArticles;

  return normalizedArticles.map((a, idx) => {
    // Enhanced parsing for Google Scholar author API response
    let authorsSummary = '';
    let publication = '';
    let year = '';
    
    // Try multiple ways to extract authors
    if (Array.isArray(a.authors)) {
      authorsSummary = a.authors.map(x => x.name || x).join(', ');
    } else if (typeof a.authors === 'string') {
      authorsSummary = a.authors;
    } else if (a.publication_info?.summary) {
      // Extract authors from publication_info.summary if available
      const summary = a.publication_info.summary;
      // Look for author patterns like "P Ayres" or "Philippe Ayres"
      const authorMatch = summary.match(/^([^-\d]+?)(?:\s*-\s*|$)/);
      if (authorMatch) {
        authorsSummary = authorMatch[1].trim();
      }
    }
    
    // Try multiple ways to extract publication
    if (a.publication) {
      publication = a.publication;
    } else if (a.publication_info?.summary) {
      // Extract publication from summary if available
      const summary = a.publication_info.summary;
      const pubMatch = summary.match(/-\s*([^-]+?)(?:\s*-\s*\d{4}|$)/);
      if (pubMatch) {
        publication = pubMatch[1].trim();
      }
    }
    
    // Try multiple ways to extract year
    if (a.year) {
      year = String(a.year);
    } else if (a.publication_info?.summary) {
      // Extract year from summary if available
      const summary = a.publication_info.summary;
      const yearMatch = summary.match(/\b(19|20)\d{2}\b/);
      if (yearMatch) {
        year = yearMatch[0];
      }
    }
    
    // Build summary with available information
    const summaryParts = [];
    if (authorsSummary) summaryParts.push(authorsSummary);
    if (publication) summaryParts.push(publication);
    if (year) summaryParts.push(year);
    const summary = summaryParts.join(' - ');

    return {
      position: idx + 1,
      title: a.title || '',
      link: a.link || '',
      snippet: a.snippet || '',
      publication_info: { summary },
      inline_links: {
        cited_by: {
          total: a?.cited_by?.value || 0,
          link: a?.cited_by?.link || ''
        }
      }
    };
  });
}

// Production-ready function to get secrets with retry logic
async function getSecrets(retryCount = 0) {
  const MAX_RETRIES = 3;
  
  // Check cache first
  if (secretsCache && cacheTimestamp && (Date.now() - cacheTimestamp < CACHE_DURATION)) {
    return secretsCache;
  }

  try {
    log.info('Fetching secrets from Google Secret Manager', { retryCount });
    
    const secrets = {};

    // Fetch Google Scholar API secret with better error handling
    // Try environment variables first for local development
    const envKey = process.env.SERPAPI_KEY || process.env.GOOGLE_SCHOLAR_API_KEY || process.env.SERPAPI_API_KEY;
    
    if (envKey) {
      secrets['googlescholarapi'] = envKey;
      log.info('Google Scholar API key loaded from environment');
    } else {
      // Fallback to Secret Manager
      try {
        const name = `projects/${PROJECT_ID}/secrets/googlescholarapi/versions/latest`;
        const [version] = await secretClient.accessSecretVersion({ 
          name,
          timeout: 15000 // 15 second timeout
        });
        
        const secretValue = version.payload.data.toString();
        if (!secretValue || secretValue.trim() === '') {
          throw new Error('Google Scholar API secret is empty');
        }
        
        secrets['googlescholarapi'] = secretValue;
        log.info('Google Scholar API secret loaded successfully from Secret Manager', { 
          project: PROJECT_ID 
        });
      } catch (error) {
        log.error('Google Scholar API secret not available from Secret Manager', {
          error: error.message,
          project: PROJECT_ID
        });
        secrets['googlescholarapi'] = null;
        log.warn('No Google Scholar API key available from Secret Manager or environment');
      }
    }


    // Update cache
    secretsCache = secrets;
    cacheTimestamp = Date.now();
    
    log.info('Secrets loaded and cached successfully', { 
      cacheExpiry: new Date(Date.now() + CACHE_DURATION).toISOString() 
    });
    
    return secrets;
  } catch (error) {
    log.error('Failed to fetch secrets', error, { retryCount });
    
    // Retry logic for production resilience
    if (retryCount < MAX_RETRIES) {
      const delay = Math.pow(2, retryCount) * 1000; // Exponential backoff
      log.info(`Retrying secret fetch in ${delay}ms`, { retryCount: retryCount + 1 });
      await new Promise(resolve => setTimeout(resolve, delay));
      return getSecrets(retryCount + 1);
    }
    
    throw error;
  }
}

// Request validation middleware
const validateSearchParams = (req, res, next) => {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({ 
      error: 'Query parameter "q" is required',
      details: 'Please provide a search query'
    });
  }
  
  if (typeof q !== 'string' || q.trim().length === 0) {
    return res.status(400).json({ 
      error: 'Query parameter "q" must be a non-empty string',
      details: 'Please provide a valid search query'
    });
  }
  
  if (q.length > 500) {
    return res.status(400).json({ 
      error: 'Query parameter "q" is too long',
      details: 'Search query must be less than 500 characters'
    });
  }
  
  next();
};

// Enhanced health check endpoint with detailed monitoring
app.get('/api/health', async (req, res) => {
  const startTime = Date.now();
  
  try {
    const secrets = await getSecrets();
    const responseTime = Date.now() - startTime;
    
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || 'unknown',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      responseTime,
      services: {
        secretManager: true,
        googleScholarAPI: !!secrets.googlescholarapi,
        cacheStatus: secretsCache ? 'active' : 'empty',
        cacheAge: cacheTimestamp ? Date.now() - cacheTimestamp : null
      }
    };
    
    log.info('Health check completed', { responseTime, status: 'healthy' });
    res.json(healthStatus);
  } catch (error) {
    const responseTime = Date.now() - startTime;
    log.error('Health check failed', error, { responseTime });
    
    res.status(500).json({ 
      status: 'unhealthy', 
      error: error.message,
      timestamp: new Date().toISOString(),
      responseTime
    });
  }
});

// Production-ready Google Scholar API endpoint with monthly caching
app.get('/api/scholar/search', validateSearchParams, async (req, res) => {
  const startTime = Date.now();
  const { q, start = 0, num = 10 } = req.query;
  const requestId = `search-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    // Validate numeric parameters
    const startNum = parseInt(start);
    const numResults = Math.min(parseInt(num), 20); // Limit to 20 results max
    
    if (isNaN(startNum) || startNum < 0) {
      return res.status(400).json({ error: 'Invalid start parameter' });
    }
    
    if (isNaN(numResults) || numResults < 1) {
      return res.status(400).json({ error: 'Invalid num parameter' });
    }

    // Generate cache key for this search
    const cacheKey = generateCacheKey(q, startNum, numResults);
    
    // Try to get data from cache first
    const cachedData = await readFromCache(cacheKey);
    if (cachedData) {
      const responseTime = Date.now() - startTime;
      
      // Return cached data with updated metadata
      return res.json({
        ...cachedData,
        metadata: {
          ...cachedData.metadata,
          requestId,
          responseTime,
          timestamp: new Date().toISOString(),
          fromCache: true,
          cacheAge: Math.round((Date.now() - cachedData.metadata?.originalTimestamp || Date.now()) / (1000 * 60 * 60 * 24)) + ' days'
        }
      });
    }

    // Cache miss - fetch from API
    const secrets = await getSecrets();
    
    if (!secrets.googlescholarapi) {
      return res.status(503).json({ 
        error: 'Google Scholar search service unavailable', 
        details: 'API configuration not available',
        retryAfter: 300 // 5 minutes
      });
    }

    const serpApiUrl = new URL('https://serpapi.com/search.json');
    serpApiUrl.searchParams.append('engine', 'google_scholar');
    serpApiUrl.searchParams.append('q', q);
    serpApiUrl.searchParams.append('start', startNum.toString());
    serpApiUrl.searchParams.append('num', numResults.toString());
    serpApiUrl.searchParams.append('api_key', secrets.googlescholarapi);
    // Sort by date (most recent first)
    serpApiUrl.searchParams.append('scisbd', '1');
    
    log.info('Google Scholar search request initiated - cache miss', { 
      requestId, 
      query: q, 
      start: startNum, 
      num: numResults,
      cacheKey: cacheKey.substring(0, 8) + '...'
    });
    
    const response = await axios.get(serpApiUrl.toString(), {
      timeout: 30000, // 30 second timeout
      headers: {
        'User-Agent': 'DHREM-Research-Portal/1.0'
      }
    });
    
    const data = response.data;
    const responseTime = Date.now() - startTime;
    
    // Add original timestamp for cache age tracking
    const enhancedData = {
      ...data,
      metadata: {
        requestId,
        responseTime,
        timestamp: new Date().toISOString(),
        originalTimestamp: Date.now(),
        fromCache: false
      }
    };
    
    // Cache the response for future requests
    await writeToCache(cacheKey, enhancedData);
    
    log.info('Google Scholar search completed and cached', { 
      requestId,
      resultsCount: data.organic_results?.length || 0,
      responseTime,
      cacheKey: cacheKey.substring(0, 8) + '...'
    });
    
    res.json(enhancedData);
  } catch (error) {
    const responseTime = Date.now() - startTime;
    log.error('Google Scholar API error', error, { 
      requestId, 
      query: q, 
      responseTime 
    });
    
    // Handle different types of errors appropriately
    let statusCode = 500;
    let errorMessage = 'Internal server error';
    
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      statusCode = 504;
      errorMessage = 'Request timeout - please try again';
    } else if (error.response?.status === 429) {
      statusCode = 429;
      errorMessage = 'Rate limit exceeded - please wait before trying again';
    } else if (error.response?.status >= 400 && error.response?.status < 500) {
      statusCode = 502;
      errorMessage = 'External service error';
    }
    
    const errorResponse = {
      error: errorMessage,
      details: 'Failed to fetch Google Scholar results',
      requestId,
      timestamp: new Date().toISOString(),
      responseTime
    };
    
    // Include retry information for certain errors
    if (statusCode === 429 || statusCode === 504) {
      errorResponse.retryAfter = 60; // 1 minute
    }
    
    res.status(statusCode).json(errorResponse);
  }
});

// Faculty research endpoint with monthly caching
app.get('/api/faculty/:facultyId/research', async (req, res) => {
  const startTime = Date.now();
  const { facultyId } = req.params;
  const { limit, authorId } = req.query;
  const requestId = `faculty-${facultyId}-${Date.now()}`;

  try {
    // Validate faculty ID
    if (!facultyId || typeof facultyId !== 'string' || facultyId.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Invalid faculty ID',
        details: 'Faculty ID must be a non-empty string'
      });
    }

    const parsedLimit = parseInt(limit, 10);
    const limitNum = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : null;

    // Internal mapping from faculty route IDs to Google Scholar author IDs (when known)
    const facultyAuthorIdMap = {
      // With degree suffixes (legacy)
      'amanda-toney-md': '0ng0NC8AAAAJ',
      'fred-n-milgrim-md': '_95Go9AAAAAJ',
      'peter-alsharif-md': 'DGtqTA0AAAAJ',
      'gabriel-siegel-md': 'XKnXMIkAAAAJ',
      'matthew-riscinti-md': '4BryFtQAAAAJ',
      'nhu-nguyen-le-md': 'McxOucoAAAAJ',
      'molly-thiessen-md': 'J8hM6OAAAAAJ',
      'michael-heffler-md': 'nqM3RiUAAAAJ',
      'priya-prasher-md': 'pXMunFoAAAAJ',
      // Normalized slugs without degree suffix
      'amanda-toney': '0ng0NC8AAAAJ',
      'fred-milgrim': '_95Go9AAAAAJ',
      'peter-alsharif': 'DGtqTA0AAAAJ',
      'gabriel-siegel': 'XKnXMIkAAAAJ',
      'matthew-riscinti': '4BryFtQAAAAJ',
      'nhu-nguyen-le': 'McxOucoAAAAJ',
      'molly-thiessen': 'J8hM6OAAAAAJ',
      'philippe-ayres': 'IJP4K9QAAAAJ',
      'michael-heffler': 'nqM3RiUAAAAJ',
      'priya-prasher': 'pXMunFoAAAAJ'
    };

    let effectiveAuthorId = (typeof authorId === 'string' && authorId.trim().length > 0)
      ? authorId.trim()
      : (facultyAuthorIdMap[facultyId] || null);

    // If no explicit mapping/param, attempt to use any previously discovered author ID
    if (!effectiveAuthorId) {
      const cachedDiscovered = discoveredAuthorIdCache.get(facultyId);
      if (cachedDiscovered) {
        effectiveAuthorId = cachedDiscovered;
      }
    }

    // If still not available, try to discover by canonical name
    if (!effectiveAuthorId) {
      // Derive a base slug by stripping common degree suffixes from route id
      const baseSlug = facultyId.replace(/-(md|do|mph|phd|ms|mhs|mba|dnp|rn|np|mpp|mha|dds|dmd|faem|facc|facs|frcp|frca)(-.+)?$/i, '');

      // Try to find a canonical name from allowed authors list
      let canonicalName = null;
      const allowed = Array.isArray(ALLOWED_AUTHORS) ? ALLOWED_AUTHORS : [];
      const matchBySlug = allowed.find(a => a.slug === baseSlug);
      if (matchBySlug) {
        canonicalName = matchBySlug.canonical;
      }

      // Fall back skipped to avoid hoisting issues; canonicalName will be derived below if needed

      // Final fallback: humanized name from route id without degree suffixes
      if (!canonicalName) {
        canonicalName = facultyId
          .replace(/-/g, ' ')
          .replace(/\b(md|do|mph|phd|ms|mhs|mba|dnp|rn|np|mpp|mha|dds|dmd)\b/gi, '')
          .replace(/\s+/g, ' ')
          .trim();
      }

      if (canonicalName) {
        const discoveredId = await discoverAuthorIdByName(canonicalName);
        if (discoveredId) {
          effectiveAuthorId = discoveredId;
          discoveredAuthorIdCache.set(facultyId, discoveredId);
          log.info('Discovered author ID for faculty', { facultyId, canonicalName, authorId: discoveredId });
        }
      }
    }

    // Check if this faculty member has a Google Scholar author ID
    // If not, return empty results immediately (no Google Scholar endpoint available)
    if (!effectiveAuthorId) {
      const responseTime = Date.now() - startTime;
      
      log.info('Faculty member has no Google Scholar author ID - returning empty results', {
        requestId,
        facultyId,
        responseTime
      });

      return res.json({
        organic_results: [],
        search_information: {
          query_displayed: `No Google Scholar profile available for ${facultyId}`,
          total_results: 0
        },
        metadata: {
          requestId,
          facultyId,
          responseTime,
          timestamp: new Date().toISOString(),
          fromCache: false,
          noAuthorId: true,
          reason: 'No Google Scholar author endpoint available'
        }
      });
    }

    // If a Google Scholar author ID (from query or mapping) is available, fetch directly from the author's profile
    if (effectiveAuthorId) {
      const authorProfileCacheKey = generateCacheKey(`author:${effectiveAuthorId}`, 0, 0, facultyId);

      const cachedAuthorProfile = await readFromCache(authorProfileCacheKey);
      if (cachedAuthorProfile) {
        const responseTime = Date.now() - startTime;
        const sanitizedProfile = sanitizeResearchPayload(cachedAuthorProfile);
        const cachedOrganic = Array.isArray(sanitizedProfile.organic_results)
          ? sanitizedProfile.organic_results
          : [];
        return res.json({
          ...sanitizedProfile,
          organic_results: limitNum ? cachedOrganic.slice(0, limitNum) : cachedOrganic,
          metadata: {
            ...sanitizedProfile.metadata,
            requestId,
            facultyId,
            responseTime,
            timestamp: new Date().toISOString(),
            fromCache: true,
            cacheAge: Math.round((Date.now() - (sanitizedProfile.metadata?.originalTimestamp || Date.now())) / (1000 * 60 * 60 * 24)) + ' days'
          }
        });
      }

      const secrets = await getSecrets();
      if (!secrets.googlescholarapi) {
        return res.status(503).json({ 
          error: 'Google Scholar search service unavailable', 
          details: 'API configuration not available',
          retryAfter: 300
        });
      }

      log.info('Faculty author profile search initiated', {
        requestId,
        facultyId,
        authorId: effectiveAuthorId
      });

      const organicResults = await fetchAuthorArticlesById(effectiveAuthorId, {
        apiKey: secrets.googlescholarapi,
        pageSize: 100,
        maxPages: 10,
        sort: 'pubdate'
      });
      const sanitizedOrganic = sanitizeOrganicResults(organicResults);

      const responseTime = Date.now() - startTime;

      const enhancedData = {
        organic_results: sanitizedOrganic,
        search_information: {
          query_displayed: `author:${effectiveAuthorId}`,
          total_results: sanitizedOrganic.length
        },
        metadata: {
          requestId,
          facultyId,
          responseTime,
          timestamp: new Date().toISOString(),
          originalTimestamp: Date.now(),
          fromCache: false,
          authorId: effectiveAuthorId
        }
      };

      await writeToCache(authorProfileCacheKey, enhancedData);

      log.info('Faculty author profile search completed and cached', {
        requestId,
        facultyId,
        authorId: effectiveAuthorId,
        resultsCount: organicResults.length,
        responseTime
      });

      return res.json({
        ...enhancedData,
        organic_results: limitNum ? sanitizedOrganic.slice(0, limitNum) : sanitizedOrganic
      });
    }

    // Enhanced faculty search queries with exact name matching for precise results
    // Note: Only include faculty members who have Google Scholar author IDs
    // Faculty without author IDs (like Samuel Lam and Joe Brown) should return empty results above
    const facultySearchQueries = {
      'matthew-riscinti-md': '"Matthew Riscinti"',
      'amanda-toney-md': '"Amanda Toney"',
      'nhu-nguyen-le-md': '"Nhu-Nguyen Le"',
      'fred-n-milgrim-md': '"Fred Milgrim"',
      'molly-thiessen-md': '"Molly Thiessen"',
      'gabriel-siegel-md': '"Gabriel Siegel"',
      'peter-alsharif-md': '"Peter Alsharif"',
      'nithin-ravi-md-mph': '"Nithin Ravi"',
      'michael-heffler-md': '"Michael Heffler"',
      'priya-prasher-md': '"Priya Prasher"',
      'juliana-wilson-do': '"Juliana Wilson"',
      'philippe-ayres': '"Philippe Ayres"',
      // Removed Samuel Lam and Joe Brown - they don't have Google Scholar author IDs
      'gabe-siegel': '"Gabriel Siegel"',
      'peter-alsharif': '"Peter Alsharif"',
      'nithin-ravi': '"Nithin Ravi"',
      'michael-heffler': '"Michael Heffler"',
      'priya-prasher': '"Priya Prasher"'
    };

    const query = facultySearchQueries[facultyId] || `"${facultyId.replace(/-/g, ' ')}"`;

    // Generate cache key for this faculty search
    const cacheKey = generateCacheKey(query, 0, limitNum || 0, facultyId);
    
    // Try to get data from cache first
    const cachedData = await readFromCache(cacheKey);
    if (cachedData) {
      const responseTime = Date.now() - startTime;
      const sanitized = sanitizeResearchPayload(cachedData);
      
      // Return cached data with updated metadata
      return res.json({
        ...sanitized,
        metadata: {
          ...sanitized.metadata,
          requestId,
          facultyId,
          responseTime,
          timestamp: new Date().toISOString(),
          fromCache: true,
          cacheAge: Math.round((Date.now() - (sanitized.metadata?.originalTimestamp || Date.now())) / (1000 * 60 * 60 * 24)) + ' days'
        }
      });
    }

    // Cache miss - fetch from API
    const secrets = await getSecrets();

    if (!secrets.googlescholarapi) {
      return res.status(503).json({ 
        error: 'Google Scholar search service unavailable', 
        details: 'API configuration not available',
        retryAfter: 300
      });
    }

    const fallbackLimit = limitNum || 20;

    const serpApiUrl = new URL('https://serpapi.com/search.json');
    serpApiUrl.searchParams.append('engine', 'google_scholar');
    serpApiUrl.searchParams.append('q', query);
    serpApiUrl.searchParams.append('start', '0');
    serpApiUrl.searchParams.append('num', fallbackLimit.toString());
    serpApiUrl.searchParams.append('api_key', secrets.googlescholarapi);
    // Sort by date (most recent first)
    serpApiUrl.searchParams.append('scisbd', '1');
    
    log.info('Faculty research search initiated - cache miss', { 
      requestId, 
      facultyId, 
      query,
      limit: fallbackLimit,
      cacheKey: cacheKey.substring(0, 8) + '...'
    });
    
    const response = await axios.get(serpApiUrl.toString(), {
      timeout: 30000,
      headers: {
        'User-Agent': 'DHREM-Research-Portal/1.0'
      }
    });
    
    const data = response.data;
    const responseTime = Date.now() - startTime;
    
    // Add original timestamp for cache age tracking
    const sanitizedOrganic = sanitizeOrganicResults(data.organic_results);

    const enhancedData = {
      ...data,
      organic_results: sanitizedOrganic,
      metadata: {
        requestId,
        facultyId,
        responseTime,
        timestamp: new Date().toISOString(),
        originalTimestamp: Date.now(),
        fromCache: false
      }
    };
    
    // Cache the response for future requests
    await writeToCache(cacheKey, enhancedData);
    
    log.info('Faculty research search completed and cached', { 
      requestId,
      facultyId,
      resultsCount: sanitizedOrganic.length,
      responseTime,
      cacheKey: cacheKey.substring(0, 8) + '...'
    });
    
    res.json(enhancedData);
  } catch (error) {
    const responseTime = Date.now() - startTime;
    log.error('Faculty research fetch failed', error, { 
      requestId, 
      facultyId, 
      responseTime 
    });
    
    let statusCode = 500;
    let errorMessage = 'Failed to fetch faculty research';
    
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      statusCode = 504;
      errorMessage = 'Request timeout - please try again';
    } else if (error.response?.status === 429) {
      statusCode = 429;
      errorMessage = 'Rate limit exceeded - please wait before trying again';
    }
    
    const errorResponse = {
      error: errorMessage,
      details: `Failed to fetch research for faculty ${facultyId}`,
      requestId,
      facultyId,
      timestamp: new Date().toISOString(),
      responseTime
    };
    
    if (statusCode === 429 || statusCode === 504) {
      errorResponse.retryAfter = 60;
    }
    
    res.status(statusCode).json(errorResponse);
  }
});

// Combined research endpoint now searches each author individually and aggregates results
app.get('/api/research/all', async (req, res) => {
  const startTime = Date.now();
  const { 
    q, 
    start = 0, 
    num = 20,
    profilesOnly: profilesOnlyParam,
    includeAllAuthors: includeAllAuthorsParam,
    offlineOnly: offlineOnlyParam,
    perAuthorLimit: perAuthorLimitParam,
    maxAuthors: maxAuthorsParam,
    force: forceParam,
    all: allParam
  } = req.query;
  const requestId = `research-all-${Date.now()}`;

  try {
    const startNum = parseInt(start);
    const returnAll = String(allParam ?? 'false').toLowerCase() === 'true' || String(num).toLowerCase() === 'all';
    const numResults = returnAll ? Number.MAX_SAFE_INTEGER : Math.min(parseInt(num) || 20, 50); // cap if not returning all

    // Behavior flags
    const profilesOnly = String(profilesOnlyParam ?? 'true').toLowerCase() === 'true';
    const includeAllAuthors = String(includeAllAuthorsParam ?? 'false').toLowerCase() === 'true';
    const offlineOnly = String(offlineOnlyParam ?? 'false').toLowerCase() === 'true';
    const force = String(forceParam ?? 'false').toLowerCase() === 'true';

    if (isNaN(startNum) || startNum < 0) {
      return res.status(400).json({ error: 'Invalid start parameter' });
    }

    if (isNaN(numResults) || numResults < 1) {
      return res.status(400).json({ error: 'Invalid num parameter' });
    }

    const baseQuery = typeof q === 'string' && q.trim().length > 0
      ? q.trim()
      : 'emergency ultrasound OR "emergency ultrasonography"';

    // Cache key for aggregated response at the requested page, include behavior flags to avoid collisions
    const flagsKey = `profilesOnly=${profilesOnly}|includeAll=${includeAllAuthors}|offlineOnly=${offlineOnly}|perAuthor=${parseInt(perAuthorLimitParam) || 'auto'}|maxAuthors=${parseInt(maxAuthorsParam) || (includeAllAuthors ? 'all' : 3)}`;
    const aggregatedCacheKey = generateCacheKey(baseQuery, startNum, numResults, `research-all-aggregated-v2|${flagsKey}`);

    const cachedAggregated = force ? null : await readFromCache(aggregatedCacheKey);
    if (cachedAggregated) {
      const responseTime = Date.now() - startTime;
      const sanitized = sanitizeResearchPayload(cachedAggregated);
      return res.json({
        ...sanitized,
        metadata: {
          ...sanitized.metadata,
          requestId,
          responseTime,
          timestamp: new Date().toISOString(),
          fromCache: true,
          cacheAge: Math.round((Date.now() - (sanitized.metadata?.originalTimestamp || Date.now())) / (1000 * 60 * 60 * 24)) + ' days'
        }
      });
    }

    const allowedAuthors = Array.isArray(ALLOWED_AUTHORS) ? ALLOWED_AUTHORS : [];
    if (allowedAuthors.length === 0) {
      return res.status(500).json({
        error: 'No allowed authors configured',
        details: 'The research authors list is empty'
      });
    }

    // Limit per-author fetch count and total authors per request to avoid vendor rate limits
    const parsedPerAuthorLimit = parseInt(perAuthorLimitParam);
    const perAuthorFetchCount = Math.max(3, Math.min(Number.isFinite(parsedPerAuthorLimit) ? parsedPerAuthorLimit : numResults, 100));
    const requestedMaxAuthors = Math.min(
      includeAllAuthors ? allowedAuthors.length : (Number.isFinite(parseInt(maxAuthorsParam)) ? parseInt(maxAuthorsParam) : 3),
      allowedAuthors.length
    );
    const MAX_AUTHORS_PER_REQUEST = requestedMaxAuthors;
    const THROTTLE_DELAY_MS = 1000; // 1s between vendor calls (faster processing)
    const aggregatedResults = [];
    const authorStats = [];
    let secrets = null;

    let processedAuthors = 0;
    for (const author of allowedAuthors) {
      if (processedAuthors >= MAX_AUTHORS_PER_REQUEST) {
        authorStats.push({ author: 'rate-limit-guard', results: 0, fromCache: true, note: 'author processing capped' });
        break;
      }
      // Prefer exact author profiles when available
      let resolvedAuthorId = author.authorId;
      if (!resolvedAuthorId && author.canonical) {
        resolvedAuthorId = await discoverAuthorIdByName(author.canonical);
      }

      if (resolvedAuthorId) {
        const authorKeySuffix = `author-id-${resolvedAuthorId}`;
        const authorCacheKey = generateCacheKey(`author:${resolvedAuthorId}`, 0, perAuthorFetchCount, authorKeySuffix);

        let authorData = await readFromCache(authorCacheKey);
        let authorFromCache = !!authorData;
        if (!authorData) {
          if (offlineOnly) {
            authorStats.push({ author: author.canonical, results: 0, fromCache: false, authorId: resolvedAuthorId, note: 'offlineOnly cache miss' });
            continue;
          }
          try {
            const authorStartTime = Date.now();
            const organic = await fetchAuthorArticlesById(resolvedAuthorId, { limit: perAuthorFetchCount });
            authorData = {
              organic_results: organic,
              metadata: {
                requestId: `${requestId}-${author.slug || author.canonical}`,
                author: author.canonical,
                baseQuery,
                authorId: resolvedAuthorId,
                responseTime: Date.now() - authorStartTime,
                timestamp: new Date().toISOString(),
                originalTimestamp: Date.now(),
                fromCache: false
              }
            };
            authorData.organic_results = sanitizeOrganicResults(authorData.organic_results);
            await writeToCache(authorCacheKey, authorData);
            processedAuthors++;
            await new Promise(r => setTimeout(r, THROTTLE_DELAY_MS));
          } catch (authorError) {
            log.error('Author profile fetch failed', authorError, {
              requestId,
              author: author.canonical,
              authorId: resolvedAuthorId
            });
            authorStats.push({
              author: author.canonical,
              results: 0,
              fromCache: false,
              authorId: resolvedAuthorId,
              error: authorError?.message || 'author fetch failed'
            });
            continue;
          }
        }

        const authorResults = Array.isArray(authorData?.organic_results)
          ? sanitizeOrganicResults(authorData.organic_results)
          : [];

        aggregatedResults.push(...authorResults);
        authorStats.push({
          author: author.canonical,
          results: authorResults.length,
          fromCache: authorFromCache,
          authorId: resolvedAuthorId
        });
        continue; // move to next author
      }
      const variantTerms = Array.isArray(author.variants) && author.variants.length > 0
        ? author.variants
        : [author.canonical];
      const authorFilter = variantTerms
        .map(name => `"${name}"`)
        .join(' OR ');
      const authorQuery = `(${baseQuery}) (${authorFilter})`;
      const authorKeySuffix = `author-${author.slug || author.canonical}`;
      const authorCacheKey = generateCacheKey(authorQuery, 0, perAuthorFetchCount, authorKeySuffix);

      let authorData = await readFromCache(authorCacheKey);
      let authorFromCache = !!authorData;

      if (!authorData) {
        if (offlineOnly) {
          authorStats.push({ author: author.canonical, results: 0, fromCache: false, query: authorQuery, note: 'offlineOnly cache miss' });
          continue;
        }
        if (!secrets) {
          secrets = await getSecrets();
          if (!secrets.googlescholarapi) {
            return res.status(503).json({
              error: 'Google Scholar search service unavailable',
              details: 'API configuration not available',
              retryAfter: 300
            });
          }
        }

        const serpApiUrl = new URL('https://serpapi.com/search.json');
        serpApiUrl.searchParams.append('engine', 'google_scholar');
        serpApiUrl.searchParams.append('q', authorQuery);
        serpApiUrl.searchParams.append('start', '0');
        serpApiUrl.searchParams.append('num', perAuthorFetchCount.toString());
        serpApiUrl.searchParams.append('api_key', secrets.googlescholarapi);
        // Sort by date (most recent first)
        serpApiUrl.searchParams.append('scisbd', '1');

        log.info('Author research search initiated - cache miss', {
          requestId,
          author: author.canonical,
          query: authorQuery,
          num: perAuthorFetchCount,
          cacheKey: authorCacheKey.substring(0, 8) + '...'
        });

        try {
          const authorStartTime = Date.now();
          const response = await axios.get(serpApiUrl.toString(), {
            timeout: 30000,
            headers: {
              'User-Agent': 'DHREM-Research-Portal/1.0'
            }
          });

          const authorResponseTime = Date.now() - authorStartTime;
          authorData = {
            ...response.data,
            metadata: {
              requestId: `${requestId}-${author.slug || author.canonical}`,
              author: author.canonical,
              baseQuery,
              authorQuery,
              responseTime: authorResponseTime,
              timestamp: new Date().toISOString(),
              originalTimestamp: Date.now(),
              fromCache: false
            }
          };

          authorData.organic_results = sanitizeOrganicResults(authorData.organic_results);

          await writeToCache(authorCacheKey, authorData);

          log.info('Author research search completed and cached', {
            requestId,
            author: author.canonical,
            resultsCount: authorData.organic_results?.length || 0,
            responseTime: authorResponseTime,
            cacheKey: authorCacheKey.substring(0, 8) + '...'
          });
          processedAuthors++;
          await new Promise(r => setTimeout(r, THROTTLE_DELAY_MS));
        } catch (authorError) {
          log.error('Author research search failed', authorError, {
            requestId,
            author: author.canonical
          });

          authorStats.push({
            author: author.canonical,
            results: 0,
            fromCache: false,
            query: authorQuery,
            error: authorError.message
          });
          continue;
        }
      }

      const authorResults = Array.isArray(authorData?.organic_results)
        ? sanitizeOrganicResults(authorData.organic_results)
        : [];

      aggregatedResults.push(...authorResults);
      authorStats.push({
        author: author.canonical,
        results: authorResults.length,
        fromCache: authorFromCache,
        query: authorQuery
      });
    }

    // Merge duplicate results across authors and keep the best metadata
    // Use a stable citation key that prefers result_id, otherwise normalized title + year, and finally link
    const normalizeTitleForKey = (title) => {
      return (title || '')
        .toLowerCase()
        .replace(/\s+/g, ' ')
        .trim()
        .replace(/[^a-z0-9]+/g, '');
    };

    const extractYearForKey = (summary) => {
      if (typeof summary !== 'string') return '';
      const m = summary.match(/\b(19|20)\d{2}\b/);
      return m ? String(parseInt(m[0], 10)) : '';
    };

    const parseClusterId = (link) => {
      if (typeof link !== 'string') return null;
      const m = link.match(/(?:[?&])cluster=(\d+)/);
      return m ? `cluster:${m[1]}` : null;
    };

    const createCitationKey = (r) => {
      if (r && r.result_id) return r.result_id;
      const cluster = parseClusterId(r?.link);
      if (cluster) return cluster;
      const normTitle = normalizeTitleForKey(r?.title);
      const year = extractYearForKey(r?.publication_info?.summary || '');
      if (normTitle) return `${normTitle}:${year}`;
      return (r?.link || '').split('#')[0] || '';
    };

    const mergedByKey = new Map();
    for (const result of aggregatedResults) {
      const citationKey = createCitationKey(result);
      if (!citationKey) continue;

      const sanitized = sanitizeScholarResult(result);
      if (!mergedByKey.has(citationKey)) {
        mergedByKey.set(citationKey, sanitized);
      } else {
        const existing = mergedByKey.get(citationKey);
        // keep max citations just in case vendor varies
        const existingCites = existing?.inline_links?.cited_by?.total || 0;
        const resultCites = sanitized?.inline_links?.cited_by?.total || 0;
        if (resultCites > existingCites) {
          if (!existing.inline_links) existing.inline_links = {};
          if (!existing.inline_links.cited_by) existing.inline_links.cited_by = {};
          existing.inline_links.cited_by.total = resultCites;
        }
        // prefer link if missing
        if (!existing.link && sanitized.link) existing.link = sanitized.link;
        // merge resources if available
        if (Array.isArray(sanitized.resources) && sanitized.resources.length > 0) {
          const resSet = new Map();
          (existing.resources || []).forEach(r => resSet.set(r.link, r));
          sanitized.resources.forEach(r => resSet.set(r.link, r));
          existing.resources = Array.from(resSet.values());
        }
      }
    }
    const dedupedResults = Array.from(mergedByKey.values());

    dedupedResults.sort((a, b) => {
      const extractYear = (summary) => {
        if (typeof summary !== 'string') return 0;
        const match = summary.match(/\b(19|20)\d{2}\b/);
        return match ? parseInt(match[0], 10) : 0;
      };

      const aYear = extractYear(a?.publication_info?.summary);
      const bYear = extractYear(b?.publication_info?.summary);
      if (bYear !== aYear) {
        return bYear - aYear; // Most recent first
      }

      const aCitations = a?.inline_links?.cited_by?.total || 0;
      const bCitations = b?.inline_links?.cited_by?.total || 0;
      return bCitations - aCitations; // Tie-breaker by citations
    });

    const pagedResults = returnAll ? dedupedResults : dedupedResults.slice(startNum, startNum + numResults);
    const responseTime = Date.now() - startTime;

    // Compute aggregate citation metrics across ALL deduped results
    let totalCitationsAll = 0;
    for (const r of dedupedResults) {
      totalCitationsAll += (r?.inline_links?.cited_by?.total || 0);
    }
    const averageCitationsAll = dedupedResults.length > 0
      ? Math.round(totalCitationsAll / dedupedResults.length)
      : 0;

    const aggregatedPayload = {
      organic_results: pagedResults,
      search_information: {
        query_displayed: baseQuery,
        total_results: dedupedResults.length,
        authors_considered: allowedAuthors.length
      },
      aggregated_metrics: {
        totalPublications: dedupedResults.length,
        totalCitations: totalCitationsAll,
        averageCitations: averageCitationsAll
      },
      metadata: {
        requestId,
        responseTime,
        timestamp: new Date().toISOString(),
        originalTimestamp: Date.now(),
        fromCache: false,
        aggregated: true,
        baseQuery,
        start: startNum,
        num: numResults,
        authorsProcessed: authorStats,
        totalCollectedBeforePaging: dedupedResults.length
      }
    };

    const sanitizedPayload = sanitizeResearchPayload(aggregatedPayload);

    if (!force) {
      await writeToCache(aggregatedCacheKey, sanitizedPayload);
    }

    log.info('Aggregated research search completed and cached', {
      requestId,
      resultsReturned: pagedResults.length,
      totalAggregatedResults: dedupedResults.length,
      responseTime,
      cacheKey: aggregatedCacheKey.substring(0, 8) + '...'
    });

    res.json(sanitizedPayload);
  } catch (error) {
    const responseTime = Date.now() - startTime;
    log.error('Aggregated research fetch failed', error, {
      requestId,
      responseTime
    });

    let statusCode = 500;
    let errorMessage = 'Failed to fetch research results';

    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      statusCode = 504;
      errorMessage = 'Request timeout - please try again';
    } else if (error.response?.status === 429) {
      statusCode = 429;
      errorMessage = 'Rate limit exceeded - please wait before trying again';
    }

    const errorResponse = {
      error: errorMessage,
      details: 'Failed to fetch aggregated research results',
      requestId,
      timestamp: new Date().toISOString(),
      responseTime
    };

    if (statusCode === 429 || statusCode === 504) {
      errorResponse.retryAfter = 60;
    }

    res.status(statusCode).json(errorResponse);
  }
});

// Aggregated research metrics endpoint (fetches multiple pages and caches monthly)
app.get('/api/research/metrics', async (req, res) => {
  const startTime = Date.now();
  const { q, maxPages = 5, num = 20 } = req.query;
  const requestId = `research-metrics-${Date.now()}`;

  try {
    // Validate numeric parameters
    const pagesToFetch = Math.max(1, Math.min(parseInt(maxPages) || 5, 5)); // cap at 5 pages
    const numPerPage = Math.max(1, Math.min(parseInt(num) || 20, 20)); // serpapi caps at 20

    // Query to use
    const searchQuery = q || 'emergency ultrasound OR "emergency ultrasonography"';

    // Cache key for aggregated metrics
    const cacheKey = generateCacheKey(searchQuery, 0, numPerPage * pagesToFetch, 'metrics-v1');

    // Attempt to use cache first
    const cachedMetrics = await readFromCache(cacheKey);
    if (cachedMetrics) {
      const responseTime = Date.now() - startTime;
      return res.json({
        ...cachedMetrics,
        requestId,
        fromCache: true,
        responseTime,
        timestamp: new Date().toISOString()
      });
    }

    const secrets = await getSecrets();
    if (!secrets.googlescholarapi) {
      return res.status(503).json({ 
        error: 'Google Scholar search service unavailable', 
        details: 'API configuration not available',
        retryAfter: 300
      });
    }

    let totalCitations = 0;
    let processedResults = 0;
    let totalResultsFromAPI = 0;

    // Fetch pages sequentially to respect rate limits
    for (let page = 0; page < pagesToFetch; page++) {
      try {
        const start = page * numPerPage;
        const serpApiUrl = new URL('https://serpapi.com/search.json');
        serpApiUrl.searchParams.append('engine', 'google_scholar');
        serpApiUrl.searchParams.append('q', searchQuery);
        serpApiUrl.searchParams.append('start', start.toString());
        serpApiUrl.searchParams.append('num', numPerPage.toString());
        serpApiUrl.searchParams.append('api_key', secrets.googlescholarapi);
        // Sort by date (most recent first)
        serpApiUrl.searchParams.append('scisbd', '1');

        const response = await axios.get(serpApiUrl.toString(), {
          timeout: 30000,
          headers: {
            'User-Agent': 'DHREM-Research-Portal/1.0'
          }
        });

        const data = response.data;
        if (page === 0) {
          totalResultsFromAPI = data.search_information?.total_results || 0;
        }
        const pageResults = Array.isArray(data.organic_results) ? data.organic_results : [];
        processedResults += pageResults.length;
        for (const r of pageResults) {
          totalCitations += (r.inline_links?.cited_by?.total || 0);
        }
        // If fewer results than requested were returned, stop early
        if (pageResults.length < numPerPage) {
          break;
        }
        // small delay to avoid vendor throttling across pages
        await new Promise(r => setTimeout(r, 1000));
      } catch (_pageErr) {
        // Break on transient errors (e.g., 429) and return partial metrics instead of 500
        break;
      }
    }

    const averageCitations = processedResults > 0
      ? Math.round(totalCitations / processedResults)
      : 0;

    const metrics = {
      totalPublications: totalResultsFromAPI,
      totalCitations,
      averageCitations,
      processedResults,
      totalResultsFromAPI,
      query: searchQuery
    };

    // Cache metrics
    await writeToCache(cacheKey, metrics);

    const responseTime = Date.now() - startTime;
    log.info('Aggregated research metrics computed', {
      requestId,
      totalPublications: metrics.totalPublications,
      totalCitations: metrics.totalCitations,
      processedResults: metrics.processedResults,
      responseTime
    });

    return res.json({
      ...metrics,
      requestId,
      fromCache: false,
      responseTime,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    const responseTime = Date.now() - startTime;
    log.error('Aggregated research metrics failed', error, { requestId, responseTime });
    return res.status(500).json({
      error: 'Failed to compute research metrics',
      requestId,
      responseTime,
      timestamp: new Date().toISOString()
    });
  }
});

// Production metrics endpoint for monitoring with cache stats
app.get('/api/metrics', async (req, res) => {
  try {
    const cacheStats = await getCacheStats();
    
    const metrics = {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || 'unknown',
      cache: {
        secrets: {
          cached: !!secretsCache,
          age: cacheTimestamp ? Date.now() - cacheTimestamp : null,
          duration: CACHE_DURATION
        },
        googleScholar: {
          ...cacheStats,
          monthlyDuration: MONTHLY_CACHE_DURATION,
          version: CACHE_VERSION
        }
      },
      node: {
        version: process.version,
        platform: process.platform,
        arch: process.arch
      }
    };
    
    res.json(metrics);
  } catch (error) {
    log.error('Error getting metrics', error);
    res.status(500).json({ error: 'Failed to get metrics' });
  }
});

// Secrets debug endpoint (does not reveal secret values)
app.get('/api/debug/secrets', async (req, res) => {
  try {
    const secrets = await getSecrets();
    res.json({
      googleScholarApiConfigured: !!secrets.googlescholarapi,
      environmentFallbackUsed: !!process.env.SERPAPI_KEY || !!process.env.GOOGLE_SCHOLAR_API_KEY || !!process.env.SERPAPI_API_KEY,
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || '314467722862',
      adcPath: process.env.GOOGLE_APPLICATION_CREDENTIALS || null,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    log.error('Error in secrets debug', error);
    res.status(500).json({ error: 'Failed to check secrets status' });
  }
});

// Cache management endpoints
app.get('/api/cache/stats', async (req, res) => {
  try {
    const stats = await getCacheStats();
    res.json({
      ...stats,
      monthlyDuration: MONTHLY_CACHE_DURATION,
      version: CACHE_VERSION,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    log.error('Error getting cache stats', error);
    res.status(500).json({ error: 'Failed to get cache statistics' });
  }
});

app.post('/api/cache/cleanup', async (req, res) => {
  try {
    await cleanupExpiredCache();
    const stats = await getCacheStats();
    
    res.json({
      message: 'Cache cleanup completed',
      stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    log.error('Error during cache cleanup', error);
    res.status(500).json({ error: 'Failed to cleanup cache' });
  }
});

app.delete('/api/cache/clear', async (req, res) => {
  try {
    await ensureCacheDir();
    const files = await fs.readdir(CACHE_DIR);
    let deletedCount = 0;
    
    for (const file of files) {
      if (file.endsWith('.json')) {
        await fs.unlink(path.join(CACHE_DIR, file));
        deletedCount++;
      }
    }
    
    log.info('Cache cleared', { deletedCount });
    
    res.json({
      message: 'All cache files cleared',
      deletedCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    log.error('Error clearing cache', error);
    res.status(500).json({ error: 'Failed to clear cache' });
  }
});

// Catch all handler for React routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Global error handler
app.use((error, req, res, next) => {
  log.error('Unhandled error', error, { 
    url: req.url, 
    method: req.method 
  });
  
  res.status(500).json({
    error: 'Internal server error',
    timestamp: new Date().toISOString()
  });
});

// Graceful shutdown handling
const gracefulShutdown = (signal) => {
  log.info(`Received ${signal}, shutting down gracefully`);
  
  process.exit(0);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught exceptions and rejections
process.on('uncaughtException', (error) => {
  log.error('Uncaught exception', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  log.error('Unhandled rejection', reason, { promise });
  process.exit(1);
});

// Start server
const server = app.listen(PORT, async () => {
  log.info('DHREM Research Server started', {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || 'unknown'
  });
  
  // Initialize secrets on startup
  getSecrets().catch(error => {
    log.error('Failed to initialize secrets on startup', error);
  });
  
  // Initialize cache directory and cleanup expired files on startup
  try {
    await ensureCacheDir();
    await cleanupExpiredCache();
    const stats = await getCacheStats();
    log.info('Cache system initialized', stats);
  } catch (error) {
    log.error('Failed to initialize cache system', error);
  }
  
  // Set up periodic cache cleanup (every 6 hours)
  setInterval(async () => {
    try {
      await cleanupExpiredCache();
    } catch (error) {
      log.error('Periodic cache cleanup failed', error);
    }
  }, 6 * 60 * 60 * 1000); // 6 hours in milliseconds
});

module.exports = app; 
