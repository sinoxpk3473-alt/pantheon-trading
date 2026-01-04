const axios = require('axios');

// All possible WEEX endpoints
const ENDPOINTS_TO_TEST = [
  // Main domains
  'https://api.weex.com',
  'https://www.weex.com',
  'https://fapi.weex.com',
  
  // Contract/Futures variants
  'https://api-contract.weex.com',
  'https://contract.weex.com',
  
  // Alternative paths
  'https://api.weex.com/api',
  'https://www.weex.com/api',
  
  // Testnet (if available)
  'https://testnet.weex.com',
  'https://api-testnet.weex.com'
];

// Common API paths to test
const API_PATHS = [
  '/api/v1/time',
  '/api/v2/market/time',
  '/capi/v2/market/time',
  '/v1/time',
  '/time',
  '/'
];

async function testEndpoint(baseUrl, path) {
  try {
    const url = `${baseUrl}${path}`;
    const response = await axios.get(url, { 
      timeout: 3000,
      validateStatus: () => true // Accept any status
    });
    
    return {
      success: response.status === 200,
      status: response.status,
      url: url,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.code || error.message,
      url: `${baseUrl}${path}`
    };
  }
}

async function findWorkingEndpoint() {
  console.log('🔍 WEEX ENDPOINT DISCOVERY');
  console.log('═══════════════════════════════════════\n');
  console.log('Testing all possible WEEX API endpoints...\n');
  
  const workingEndpoints = [];
  
  for (const baseUrl of ENDPOINTS_TO_TEST) {
    console.log(`📡 Testing: ${baseUrl}`);
    
    for (const path of API_PATHS) {
      const result = await testEndpoint(baseUrl, path);
      
      if (result.success) {
        console.log(`   ✅ WORKS: ${result.url}`);
        console.log(`      Response: ${JSON.stringify(result.data).substring(0, 100)}...`);
        workingEndpoints.push(result.url);
      } else if (result.status && result.status !== 404) {
        console.log(`   ⚠️  ${result.status}: ${result.url}`);
      }
    }
    
    console.log('');
  }
  
  console.log('═══════════════════════════════════════');
  
  if (workingEndpoints.length > 0) {
    console.log('\n✅ WORKING ENDPOINTS FOUND:');
    workingEndpoints.forEach((url, i) => {
      console.log(`   ${i + 1}. ${url}`);
    });
    
    console.log('\n📝 Update your weex-integration.js:');
    console.log(`   BASE_URL: '${workingEndpoints[0].split('/api')[0]}'`);
  } else {
    console.log('\n❌ NO WORKING ENDPOINTS FOUND');
    console.log('\n🆘 NEXT STEPS:');
    console.log('   1. Check if you have WEEX API credentials');
    console.log('   2. Contact WEEX support for hackathon-specific endpoint');
    console.log('   3. Check DoraHacks messages for API documentation');
    console.log('   4. Try with VPN (some regions may be blocked)');
    console.log('\n📧 Contact:');
    console.log('   Telegram: https://t.me/WeexGlobal');
    console.log('   Email: Check DoraHacks messages');
  }
  
  console.log('\n═══════════════════════════════════════\n');
}

// Run the test
findWorkingEndpoint().catch(error => {
  console.error('Fatal error:', error.message);
});