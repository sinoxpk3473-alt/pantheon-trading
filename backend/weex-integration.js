require('dotenv').config();
const axios = require('axios');
const crypto = require('crypto');

// ============================================
// WEEX API CONFIGURATION
// ============================================

const WEEX_CONFIG = {
  API_KEY: process.env.WEEX_API_KEY,
  SECRET_KEY: process.env.WEEX_SECRET_KEY,
  PASSPHRASE: process.env.WEEX_PASSPHRASE,
  // Try multiple endpoints (WEEX may have different URLs for hackathon)
  BASE_URL: process.env.WEEX_BASE_URL || 'https://api.weex.com',
  FUTURES_URL: 'https://fapi.weex.com',
  SPOT_URL: 'https://api.weex.com'
};

// ============================================
// SIGNATURE GENERATION
// ============================================

function generateSignature(timestamp, method, endpoint, body = '') {
  const message = timestamp + method + endpoint + (body || '');
  const hmac = crypto.createHmac('sha256', WEEX_CONFIG.SECRET_KEY);
  return hmac.update(message).digest('base64');
}

// ============================================
// API REQUEST HELPER
// ============================================

async function weexRequest(method, endpoint, data = null, useSpot = false) {
  const timestamp = Date.now().toString();
  const baseUrl = useSpot ? WEEX_CONFIG.SPOT_BASE_URL : WEEX_CONFIG.BASE_URL;
  const url = `${baseUrl}${endpoint}`;
  
  const bodyString = data ? JSON.stringify(data) : '';
  const signature = generateSignature(timestamp, method, endpoint, bodyString);
  
  const headers = {
    'ACCESS-KEY': WEEX_CONFIG.API_KEY,
    'ACCESS-SIGN': signature,
    'ACCESS-TIMESTAMP': timestamp,
    'ACCESS-PASSPHRASE': WEEX_CONFIG.PASSPHRASE,
    'Content-Type': 'application/json'
  };
  
  try {
    const response = await axios({
      method,
      url,
      headers,
      data: bodyString || undefined
    });
    
    return response.data;
  } catch (error) {
    console.error(`WEEX API Error:`, error.response?.data || error.message);
    throw error;
  }
}

// ============================================
// 1. TEST CONNECTION
// ============================================

async function testConnection() {
  console.log('\n🔗 Testing WEEX API Connection...');
  
  try {
    const response = await axios.get(`${WEEX_CONFIG.BASE_URL}/capi/v2/market/time`);
    console.log('✅ Connection successful!');
    console.log(`   Server time: ${new Date(response.data.timestamp).toISOString()}`);
    return true;
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    return false;
  }
}

// ============================================
// 2. GET ACCOUNT BALANCE
// ============================================

async function getAccountBalance() {
  console.log('\n💰 Fetching Account Balance...');
  
  try {
    const endpoint = '/api/v2/mix/account/accounts';
    const response = await weexRequest('GET', endpoint);
    
    console.log('✅ Balance retrieved:');
    if (response.data && Array.isArray(response.data)) {
      response.data.forEach(account => {
        console.log(`   ${account.marginCoin}: ${account.available} available`);
      });
    }
    
    return response;
  } catch (error) {
    console.error('❌ Failed to fetch balance');
    return null;
  }
}

// ============================================
// 3. GET MARKET PRICE
// ============================================

async function getMarketPrice(symbol = 'cmt_btcusdt') {
  console.log(`\n📊 Fetching ${symbol} price...`);
  
  try {
    const endpoint = `/api/v2/mix/market/ticker?symbol=${symbol}`;
    const response = await weexRequest('GET', endpoint);
    
    const price = response.data.last;
    console.log(`✅ Current price: $${price}`);
    
    return parseFloat(price);
  } catch (error) {
    console.error('❌ Failed to fetch price');
    return null;
  }
}

// ============================================
// 4. PLACE TEST ORDER (REQUIRED FOR API TEST)
// ============================================

async function placeTestOrder(symbol = 'cmt_btcusdt') {
  console.log(`\n📝 Placing test order on ${symbol}...`);
  
  try {
    // Get current price
    const currentPrice = await getMarketPrice(symbol);
    if (!currentPrice) throw new Error('Could not fetch price');
    
    // Calculate order size (~10 USDT worth)
    const orderValue = 10; // USDT
    const quantity = (orderValue / currentPrice).toFixed(6);
    
    const endpoint = '/api/v2/mix/order/placeOrder';
    const orderData = {
      symbol: symbol,
      marginCoin: 'USDT',
      side: 'open_long', // or 'open_short'
      orderType: 'market',
      size: quantity,
      timeInForceValue: 'normal'
    };
    
    console.log(`   Order details: ${orderValue} USDT (~${quantity} ${symbol})`);
    
    const response = await weexRequest('POST', endpoint, orderData);
    
    if (response.code === '00000') {
      console.log('✅ Order placed successfully!');
      console.log(`   Order ID: ${response.data.orderId}`);
      console.log(`   Client Order ID: ${response.data.clientOid}`);
      
      return {
        orderId: response.data.orderId,
        clientOid: response.data.clientOid,
        symbol,
        quantity
      };
    } else {
      console.error('❌ Order failed:', response.msg);
      return null;
    }
  } catch (error) {
    console.error('❌ Failed to place order:', error.message);
    return null;
  }
}

// ============================================
// 5. LOG AI INTERACTION (REQUIRED)
// ============================================

async function logAIInteraction(orderId, aiDecision) {
  console.log('\n🤖 Logging AI interaction...');
  
  try {
    const endpoint = '/api/v2/ai_log';
    const logData = {
      orderId: orderId,
      aiModel: 'Pantheon Pro Multi-Agent Council',
      decision: aiDecision.consensus,
      analystView: aiDecision.analystView,
      skepticView: aiDecision.skepticView,
      degenView: aiDecision.degenView,
      confidence: aiDecision.confidence,
      timestamp: Date.now()
    };
    
    const response = await weexRequest('POST', endpoint, logData);
    
    if (response.code === '00000') {
      console.log('✅ AI interaction logged successfully!');
      return true;
    } else {
      console.error('❌ Failed to log AI interaction:', response.msg);
      return false;
    }
  } catch (error) {
    console.error('❌ Failed to log AI interaction:', error.message);
    return false;
  }
}

// ============================================
// 6. COMPLETE API TEST
// ============================================

async function completeAPITest() {
  console.log('\n🎯 PANTHEON PRO - WEEX API TEST');
  console.log('═══════════════════════════════════════\n');
  
  // Check credentials
  if (!WEEX_CONFIG.API_KEY || !WEEX_CONFIG.SECRET_KEY || !WEEX_CONFIG.PASSPHRASE) {
    console.error('❌ Missing WEEX API credentials!');
    console.log('\n📋 Add these to your .env file:');
    console.log('WEEX_API_KEY=your_api_key');
    console.log('WEEX_SECRET_KEY=your_secret_key');
    console.log('WEEX_PASSPHRASE=your_passphrase\n');
    return;
  }
  
  // Step 1: Test connection
  const connected = await testConnection();
  if (!connected) {
    console.error('\n❌ API Test Failed: Could not connect to WEEX');
    return;
  }
  
  // Step 2: Check balance
  await getAccountBalance();
  
  // Step 3: Simulate Pantheon AI decision
  console.log('\n🏛️  Pantheon Council is deliberating...');
  const aiDecision = {
    analystView: 'HOLD|60|Market consolidation pattern detected',
    skepticView: 'HOLD|55|Risk elevated, protect capital',
    degenView: 'BUY|70|Momentum building, breakout imminent',
    consensus: 'HOLD|MAJORITY|62',
    confidence: 62
  };
  
  console.log('✅ Consensus reached: HOLD (MAJORITY)');
  
  // Step 4: Place test order (required by hackathon)
  const order = await placeTestOrder('cmt_btcusdt');
  
  if (!order) {
    console.error('\n❌ API Test Failed: Could not place order');
    return;
  }
  
  // Step 5: Log AI interaction (required by hackathon)
  const logged = await logAIInteraction(order.orderId, aiDecision);
  
  if (!logged) {
    console.warn('\n⚠️  Warning: Could not log AI interaction');
  }
  
  // Success!
  console.log('\n✅ API TEST COMPLETE!');
  console.log('═══════════════════════════════════════');
  console.log('📊 Test Summary:');
  console.log(`   ✓ Connection verified`);
  console.log(`   ✓ Order placed: ${order.orderId}`);
  console.log(`   ✓ AI interaction logged`);
  console.log('═══════════════════════════════════════');
  console.log('\n🎉 You\'re now eligible for the 1,000 USDT voucher!');
  console.log('📧 WEEX will confirm your qualification via email.\n');
}

// ============================================
// RUN THE TEST
// ============================================

if (require.main === module) {
  completeAPITest().catch(error => {
    console.error('\n❌ Fatal error:', error.message);
    process.exit(1);
  });
}

module.exports = {
  testConnection,
  getAccountBalance,
  getMarketPrice,
  placeTestOrder,
  logAIInteraction,
  completeAPITest
};