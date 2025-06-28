const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 4001;

// Production-ready middleware
if (process.env.NODE_ENV === 'production') {
  // Security middleware for production
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
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
const secretClient = new SecretManagerServiceClient({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || 'decoded-app-457000-s2',
  // In Cloud Run, credentials are automatically provided via the service account
  // In development, use the credentials file
  ...(process.env.NODE_ENV !== 'production' && {
    keyFilename: './google-credentials-production.json'
  })
});

// Enhanced caching for secrets
let secretsCache = null;
let cacheTimestamp = null;
const CACHE_DURATION = process.env.NODE_ENV === 'production' ? 10 * 60 * 1000 : 5 * 60 * 1000; // 10 minutes in production

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
    try {
      const name = `projects/decoded-app-457000-s2/secrets/googlescholarapi/versions/latest`;
      const [version] = await secretClient.accessSecretVersion({ 
        name,
        timeout: 10000 // 10 second timeout
      });
      
      const secretValue = version.payload.data.toString();
      if (!secretValue || secretValue.trim() === '') {
        throw new Error('Google Scholar API secret is empty');
      }
      
      secrets['googlescholarapi'] = secretValue;
      log.info('Google Scholar API secret loaded successfully', { 
        project: 'decoded-app-457000-s2' 
      });
    } catch (error) {
      log.error('Google Scholar API secret not available', error);
      secrets['googlescholarapi'] = null;
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

// Production-ready Google Scholar API endpoint with enhanced error handling
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
    
    log.info('Google Scholar search request initiated', { 
      requestId, 
      query: q, 
      start: startNum, 
      num: numResults 
    });
    
    const response = await axios.get(serpApiUrl.toString(), {
      timeout: 30000, // 30 second timeout
      headers: {
        'User-Agent': 'DHREM-Research-Portal/1.0'
      }
    });
    
    const data = response.data;
    const responseTime = Date.now() - startTime;
    
    log.info('Google Scholar search completed', { 
      requestId,
      resultsCount: data.organic_results?.length || 0,
      responseTime
    });
    
    res.json({
      ...data,
      metadata: {
        requestId,
        responseTime,
        timestamp: new Date().toISOString()
      }
    });
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

// Faculty research endpoint with enhanced functionality
app.get('/api/faculty/:facultyId/research', async (req, res) => {
  const startTime = Date.now();
  const { facultyId } = req.params;
  const { limit = 5 } = req.query;
  const requestId = `faculty-${facultyId}-${Date.now()}`;

  try {
    // Validate faculty ID
    if (!facultyId || typeof facultyId !== 'string' || facultyId.trim().length === 0) {
      return res.status(400).json({ 
        error: 'Invalid faculty ID',
        details: 'Faculty ID must be a non-empty string'
      });
    }

    const limitNum = Math.min(parseInt(limit) || 5, 10); // Max 10 results

    const secrets = await getSecrets();

    if (!secrets.googlescholarapi) {
      return res.status(503).json({ 
        error: 'Google Scholar search service unavailable', 
        details: 'API configuration not available',
        retryAfter: 300
      });
    }

    // Enhanced faculty search queries with exact name matching for precise results
    const facultySearchQueries = {
      'matthew-riscinti-md': '"Matthew Riscinti" "Denver Health"',
      'amanda-toney-md': '"Amanda Toney" "Denver Health"',
      'nhu-nguyen-le-md': '"Nhu-Nguyen Le" "Denver Health"',
      'fred-n-milgrim-md': '"Fred Milgrim" "Denver Health"',
      'molly-thiessen-md': '"Molly Thiessen" "Denver Health"',
      'gabriel-siegel-md': '"Gabriel Siegel" "Denver Health"',
      'peter-alsharif-md': '"Peter Alsharif" "Denver Health"',
      'nithin-ravi-md-mph': '"Nithin Ravi" "Denver Health"',
      'juliana-wilson-do': '"Juliana Wilson" "Denver Health"',
      'samuel-h-f-lam-md-mph': '"Samuel Lam" "Denver Health"',
      'joe-brown-md': '"Joe Brown" "Denver Health"',
      'alexandria-davis': '"Alexandria Davis" "Denver Health"',
      'gabe-siegel': '"Gabriel Siegel" "Denver Health"',
      'peter-alsharif': '"Peter Alsharif" "Denver Health"',
      'nithin-ravi': '"Nithin Ravi" "Denver Health"'
    };

    const query = facultySearchQueries[facultyId] || `"${facultyId.replace(/-/g, ' ')}" "Denver Health"`;

    const serpApiUrl = new URL('https://serpapi.com/search.json');
    serpApiUrl.searchParams.append('engine', 'google_scholar');
    serpApiUrl.searchParams.append('q', query);
    serpApiUrl.searchParams.append('start', '0');
    serpApiUrl.searchParams.append('num', limitNum.toString());
    serpApiUrl.searchParams.append('api_key', secrets.googlescholarapi);
    
    log.info('Faculty research search initiated', { 
      requestId, 
      facultyId, 
      query,
      limit: limitNum 
    });
    
    const response = await axios.get(serpApiUrl.toString(), {
      timeout: 30000,
      headers: {
        'User-Agent': 'DHREM-Research-Portal/1.0'
      }
    });
    
    const data = response.data;
    const responseTime = Date.now() - startTime;
    
    log.info('Faculty research search completed', { 
      requestId,
      facultyId,
      resultsCount: data.organic_results?.length || 0,
      responseTime
    });
    
    res.json({
      ...data,
      metadata: {
        requestId,
        facultyId,
        responseTime,
        timestamp: new Date().toISOString()
      }
    });
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

// Combined research endpoint with enhanced functionality
app.get('/api/research/all', async (req, res) => {
  const startTime = Date.now();
  const { q, start = 0, num = 20 } = req.query;
  const requestId = `research-all-${Date.now()}`;

  try {
    const startNum = parseInt(start);
    const numResults = Math.min(parseInt(num) || 20, 50); // Limit to 50 results max
    
    if (isNaN(startNum) || startNum < 0) {
      return res.status(400).json({ error: 'Invalid start parameter' });
    }
    
    if (isNaN(numResults) || numResults < 1) {
      return res.status(400).json({ error: 'Invalid num parameter' });
    }

    const secrets = await getSecrets();

    if (!secrets.googlescholarapi) {
      return res.status(503).json({ 
        error: 'Google Scholar search service unavailable', 
        details: 'API configuration not available',
        retryAfter: 300
      });
    }

    // Enhanced default query with more comprehensive search terms
    const searchQuery = q || 'Denver Health emergency ultrasound OR "Denver emergency ultrasound" OR "Denver Health ultrasound"';

    const serpApiUrl = new URL('https://serpapi.com/search.json');
    serpApiUrl.searchParams.append('engine', 'google_scholar');
    serpApiUrl.searchParams.append('q', searchQuery);
    serpApiUrl.searchParams.append('start', startNum.toString());
    serpApiUrl.searchParams.append('num', numResults.toString());
    serpApiUrl.searchParams.append('api_key', secrets.googlescholarapi);
    
    log.info('Combined research search initiated', { 
      requestId, 
      query: searchQuery,
      start: startNum,
      num: numResults 
    });
    
    const response = await axios.get(serpApiUrl.toString(), {
      timeout: 30000,
      headers: {
        'User-Agent': 'DHREM-Research-Portal/1.0'
      }
    });
    
    const data = response.data;
    const responseTime = Date.now() - startTime;
    
    log.info('Combined research search completed', { 
      requestId,
      resultsCount: data.organic_results?.length || 0,
      responseTime
    });
    
    res.json({
      ...data,
      metadata: {
        requestId,
        responseTime,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    const responseTime = Date.now() - startTime;
    log.error('Combined research fetch failed', error, { 
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
      details: 'Failed to fetch combined research results',
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

// Production metrics endpoint for monitoring
app.get('/api/metrics', (req, res) => {
  const metrics = {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || 'unknown',
    cache: {
      secretsCache: !!secretsCache,
      cacheAge: cacheTimestamp ? Date.now() - cacheTimestamp : null,
      cacheDuration: CACHE_DURATION
    },
    node: {
      version: process.version,
      platform: process.platform,
      arch: process.arch
    }
  };
  
  res.json(metrics);
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
const server = app.listen(PORT, () => {
  log.info('DHREM Research Server started', {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || 'unknown'
  });
  
  // Initialize secrets on startup
  getSecrets().catch(error => {
    log.error('Failed to initialize secrets on startup', error);
  });
});

module.exports = app; 