/**
 * Test script for Communication API endpoints
 * Run with: node test_communication_api.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000';
let authToken = '';

// Test credentials (update with your actual test user)
const TEST_USER = {
  email: 'test@example.com',
  password: 'password123'
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Login to get auth token
async function login() {
  try {
    log('\n1. Testing Login...', 'blue');
    const response = await axios.post(`${BASE_URL}/api/auth/login`, TEST_USER);
    authToken = response.data.token;
    log('✓ Login successful', 'green');
    log(`Token: ${authToken.substring(0, 20)}...`, 'yellow');
    return true;
  } catch (error) {
    log(`✗ Login failed: ${error.response?.data?.message || error.message}`, 'red');
    return false;
  }
}

// Test get course messages
async function testGetCourseMessages(courseId) {
  try {
    log(`\n2. Testing GET /api/communication/courses/${courseId}/messages...`, 'blue');
    const response = await axios.get(
      `${BASE_URL}/api/communication/courses/${courseId}/messages`,
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    log('✓ Request successful', 'green');
    log(`Response: ${JSON.stringify(response.data, null, 2)}`, 'yellow');
    return true;
  } catch (error) {
    log(`✗ Request failed: ${error.response?.status} ${error.response?.statusText}`, 'red');
    log(`Error: ${JSON.stringify(error.response?.data, null, 2)}`, 'red');
    return false;
  }
}

// Test get conversations
async function testGetConversations() {
  try {
    log('\n3. Testing GET /api/communication/conversations...', 'blue');
    const response = await axios.get(
      `${BASE_URL}/api/communication/conversations`,
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    log('✓ Request successful', 'green');
    log(`Found ${response.data.count} conversations`, 'yellow');
    return true;
  } catch (error) {
    log(`✗ Request failed: ${error.response?.data?.message || error.message}`, 'red');
    return false;
  }
}

// Test get notifications
async function testGetNotifications() {
  try {
    log('\n4. Testing GET /api/communication/notifications/me...', 'blue');
    const response = await axios.get(
      `${BASE_URL}/api/communication/notifications/me`,
      {
        headers: { Authorization: `Bearer ${authToken}` }
      }
    );
    log('✓ Request successful', 'green');
    log(`Found ${response.data.data.length} notifications`, 'yellow');
    return true;
  } catch (error) {
    log(`✗ Request failed: ${error.response?.data?.message || error.message}`, 'red');
    return false;
  }
}

// Main test runner
async function runTests() {
  log('='.repeat(60), 'blue');
  log('Communication API Test Suite', 'blue');
  log('='.repeat(60), 'blue');

  // Login first
  const loginSuccess = await login();
  if (!loginSuccess) {
    log('\n✗ Cannot proceed without authentication', 'red');
    process.exit(1);
  }

  // Test with a sample course ID (update with actual course ID from your database)
  const sampleCourseId = '507f1f77bcf86cd799439011'; // Replace with actual course ID
  
  await testGetCourseMessages(sampleCourseId);
  await testGetConversations();
  await testGetNotifications();

  log('\n' + '='.repeat(60), 'blue');
  log('Test Suite Complete', 'blue');
  log('='.repeat(60), 'blue');
}

// Run tests
runTests().catch(error => {
  log(`\nUnexpected error: ${error.message}`, 'red');
  process.exit(1);
});
