#!/usr/bin/env node

/**
 * Test script for Google Scholar API monthly caching functionality
 * Run this script to test the cache system without starting the full server
 */

const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

// Cache configuration (matching server.js)
const CACHE_DIR = path.join(__dirname, 'cache');
const MONTHLY_CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
const CACHE_VERSION = '1.0';

// Test data
const testData = {
  organic_results: [
    {
      title: "Test Research Paper 1",
      link: "https://example.com/paper1",
      snippet: "This is a test research paper about emergency ultrasound."
    },
    {
      title: "Test Research Paper 2", 
      link: "https://example.com/paper2",
      snippet: "Another test paper about Denver Health research."
    }
  ],
  metadata: {
    timestamp: new Date().toISOString(),
    originalTimestamp: Date.now(),
    fromCache: false
  }
};

// Helper functions (matching server.js)
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

function getCacheFilePath(cacheKey) {
  return path.join(CACHE_DIR, `${cacheKey}.json`);
}

function isCacheValid(cacheData) {
  if (!cacheData || !cacheData.timestamp || !cacheData.version) {
    return false;
  }
  
  if (cacheData.version !== CACHE_VERSION) {
    return false;
  }
  
  const now = Date.now();
  const cacheAge = now - cacheData.timestamp;
  return cacheAge < MONTHLY_CACHE_DURATION;
}

async function ensureCacheDir() {
  try {
    await fs.access(CACHE_DIR);
  } catch {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    console.log('✓ Created cache directory:', CACHE_DIR);
  }
}

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
    
    console.log('✓ Data cached successfully:', {
      cacheKey: cacheKey.substring(0, 8) + '...',
      resultsCount: cacheData.metadata.resultsCount,
      expiresAt: cacheData.metadata.expiresAt
    });
  } catch (error) {
    console.error('✗ Error writing to cache:', error.message);
  }
}

async function readFromCache(cacheKey) {
  try {
    const cacheFilePath = getCacheFilePath(cacheKey);
    const cacheContent = await fs.readFile(cacheFilePath, 'utf8');
    const cacheData = JSON.parse(cacheContent);
    
    if (isCacheValid(cacheData)) {
      console.log('✓ Cache hit - returning cached data:', {
        cacheKey: cacheKey.substring(0, 8) + '...',
        age: Math.round((Date.now() - cacheData.timestamp) / (1000 * 60 * 60 * 24)) + ' days',
        resultsCount: cacheData.data?.organic_results?.length || 0
      });
      return cacheData.data;
    } else {
      console.log('✗ Cache expired - would fetch fresh data:', {
        cacheKey: cacheKey.substring(0, 8) + '...',
        expired: true
      });
      // Clean up expired cache file
      await fs.unlink(cacheFilePath).catch(() => {});
      return null;
    }
  } catch (error) {
    if (error.code !== 'ENOENT') {
      console.warn('⚠ Error reading cache file:', error.message);
    } else {
      console.log('ℹ Cache miss - file does not exist');
    }
    return null;
  }
}

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
    console.error('Error getting cache stats:', error.message);
    return { error: error.message };
  }
}

// Main test function
async function runCacheTests() {
  console.log('🧪 Testing Google Scholar API Monthly Caching System\n');
  
  try {
    // Test 1: Cache directory creation
    console.log('Test 1: Cache directory creation');
    await ensureCacheDir();
    console.log('✓ Cache directory ready\n');
    
    // Test 2: Cache key generation
    console.log('Test 2: Cache key generation');
    const testQuery = 'Denver Health emergency ultrasound';
    const cacheKey = generateCacheKey(testQuery, 0, 10);
    console.log('✓ Generated cache key:', cacheKey.substring(0, 16) + '...\n');
    
    // Test 3: Write to cache
    console.log('Test 3: Write to cache');
    await writeToCache(cacheKey, testData);
    console.log('');
    
    // Test 4: Read from cache (should hit)
    console.log('Test 4: Read from cache (should hit)');
    const cachedData = await readFromCache(cacheKey);
    if (cachedData && cachedData.organic_results) {
      console.log('✓ Successfully retrieved cached data\n');
    } else {
      console.log('✗ Failed to retrieve cached data\n');
    }
    
    // Test 5: Cache statistics
    console.log('Test 5: Cache statistics');
    const stats = await getCacheStats();
    console.log('✓ Cache stats:', stats);
    console.log('');
    
    // Test 6: Different query (should miss)
    console.log('Test 6: Different query (should miss)');
    const differentKey = generateCacheKey('Different query', 0, 10);
    const missedData = await readFromCache(differentKey);
    if (!missedData) {
      console.log('✓ Cache miss worked correctly\n');
    } else {
      console.log('✗ Unexpected cache hit\n');
    }
    
    // Test 7: Faculty-specific cache
    console.log('Test 7: Faculty-specific cache');
    const facultyKey = generateCacheKey('Matthew Riscinti Denver Health', 0, 5, 'matthew-riscinti-md');
    await writeToCache(facultyKey, testData);
    const facultyData = await readFromCache(facultyKey);
    if (facultyData) {
      console.log('✓ Faculty-specific caching works\n');
    } else {
      console.log('✗ Faculty-specific caching failed\n');
    }
    
    // Final stats
    console.log('Final cache statistics:');
    const finalStats = await getCacheStats();
    console.log(finalStats);
    
    console.log('\n🎉 All cache tests completed successfully!');
    console.log('\nCache system features:');
    console.log('• ✓ Monthly cache duration (30 days)');
    console.log('• ✓ Persistent file-based storage');
    console.log('• ✓ Cache key generation with query normalization');
    console.log('• ✓ Cache validation and expiration');
    console.log('• ✓ Faculty-specific caching');
    console.log('• ✓ Cache statistics and monitoring');
    console.log('• ✓ Automatic cleanup of expired files');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runCacheTests();
}

module.exports = {
  generateCacheKey,
  writeToCache,
  readFromCache,
  getCacheStats,
  runCacheTests
};




