#!/usr/bin/env node

// 🧪 VEXUS Atlas Endpoint Testing Script
// This script tests all API endpoints to ensure they're working correctly

const axios = require('axios');

// Configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:8080';
const TIMEOUT = 30000; // 30 seconds

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testEndpoint(name, method, url, data = null, expectedStatus = 200) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${url}`,
      timeout: TIMEOUT,
      validateStatus: () => true // Don't throw on non-200 status codes
    };

    if (data) {
      config.data = data;
      config.headers = { 'Content-Type': 'application/json' };
    }

    const response = await axios(config);
    
    if (response.status === expectedStatus) {
      log('green', `✅ ${name}: PASSED (${response.status})`);
      return { success: true, response };
    } else {
      log('red', `❌ ${name}: FAILED (Expected ${expectedStatus}, got ${response.status})`);
      return { success: false, response };
    }
  } catch (error) {
    log('red', `❌ ${name}: ERROR - ${error.message}`);
    return { success: false, error };
  }
}

async function runTests() {
  log('blue', '🧪 VEXUS Atlas Endpoint Testing');
  log('blue', '=================================');
  log('cyan', `Testing base URL: ${BASE_URL}`);
  console.log('');

  const results = [];

  // Test health endpoint
  results.push(await testEndpoint(
    'Health Check',
    'GET',
    '/api/health'
  ));

  // Test secrets debug endpoint
  results.push(await testEndpoint(
    'Secrets Debug',
    'GET',
    '/api/debug/secrets'
  ));

  // Test config endpoint
  results.push(await testEndpoint(
    'Config',
    'GET',
    '/api/config'
  ));

  // Test images endpoint
  results.push(await testEndpoint(
    'Images',
    'GET',
    '/api/images'
  ));

  // Test images by category
  results.push(await testEndpoint(
    'Images - Hepatic Category',
    'GET',
    '/api/images/category/hepatic'
  ));

  results.push(await testEndpoint(
    'Images - Portal Category',
    'GET',
    '/api/images/category/portal'
  ));

  results.push(await testEndpoint(
    'Images - Renal Category',
    'GET',
    '/api/images/category/renal'
  ));

  // Test debug fields endpoint
  results.push(await testEndpoint(
    'Debug Fields',
    'GET',
    '/api/debug/fields'
  ));

  // Test raw data endpoint
  results.push(await testEndpoint(
    'Raw Data',
    'GET',
    '/api/raw'
  ));

  // Test Google Scholar search
  results.push(await testEndpoint(
    'Google Scholar Search',
    'GET',
    '/api/scholar/search?q=vexus+ultrasound&num=5'
  ));

  // Test Modal API endpoints with sample data
  const sampleImageData = {
    image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
  };

  console.log('');
  log('yellow', '🤖 Testing Modal API Endpoints...');

  results.push(await testEndpoint(
    'Hepatic Modal API',
    'POST',
    '/api/hepatic',
    sampleImageData
  ));

  results.push(await testEndpoint(
    'Portal Modal API',
    'POST',
    '/api/portal',
    sampleImageData
  ));

  results.push(await testEndpoint(
    'Renal Modal API',
    'POST',
    '/api/renal',
    sampleImageData
  ));

  // Test React app routing (should return HTML)
  results.push(await testEndpoint(
    'React App Root',
    'GET',
    '/'
  ));

  results.push(await testEndpoint(
    'React App Router (404 fallback)',
    'GET',
    '/calculator'
  ));

  // Summary
  console.log('');
  log('blue', '📊 Test Results Summary');
  log('blue', '========================');

  const passed = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  const total = results.length;

  log('cyan', `Total tests: ${total}`);
  log('green', `Passed: ${passed}`);
  log('red', `Failed: ${failed}`);
  log('yellow', `Success rate: ${Math.round((passed / total) * 100)}%`);

  console.log('');

  if (failed === 0) {
    log('green', '🎉 All tests passed! Your VEXUS Atlas is ready to use.');
  } else if (failed < 3) {
    log('yellow', '⚠️  Most tests passed. Check the failed endpoints above.');
  } else {
    log('red', '❌ Multiple tests failed. Please check your configuration.');
  }

  // Detailed error reporting for failures
  const failures = results.filter(r => !r.success);
  if (failures.length > 0) {
    console.log('');
    log('red', '🔍 Failure Details:');
    failures.forEach((failure, index) => {
      console.log(`${index + 1}. ${failure.error?.message || 'Unknown error'}`);
      if (failure.response?.data) {
        console.log(`   Response: ${JSON.stringify(failure.response.data, null, 2).substring(0, 200)}...`);
      }
    });
  }

  process.exit(failed > 0 ? 1 : 0);
}

// Handle command line arguments
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
🧪 VEXUS Atlas Endpoint Testing Script

Usage:
  node test-endpoints.js [BASE_URL]
  
Examples:
  node test-endpoints.js                                    # Test localhost:8080
  BASE_URL=https://your-app.run.app node test-endpoints.js  # Test production
  node test-endpoints.js https://your-app.run.app           # Test production (alternative)

Options:
  --help, -h    Show this help message
  `);
  process.exit(0);
}

// Override BASE_URL if provided as argument
if (process.argv[2] && process.argv[2].startsWith('http')) {
  process.env.BASE_URL = process.argv[2];
}

// Run the tests
runTests().catch(error => {
  log('red', `Fatal error: ${error.message}`);
  process.exit(1);
}); 