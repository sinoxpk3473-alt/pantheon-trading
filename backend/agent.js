require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { ethers } = require('ethers');
const axios = require('axios');

// Configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const RPC_URL = process.env.RPC_URL;

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Contract ABI
const CONTRACT_ABI = [
  "function recordDebate(string memory symbol, string memory analystView, string memory skepticView, string memory degenView, string memory consensus, uint256 finalConfidence) external"
];

// Delay helper function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fetch market data with retry
async function getMarketData(symbol) {
  try {
    console.log('📈 Fetching market data...');
    
    // Using CoinGecko free API (no key needed)
    const coinId = symbol.toLowerCase() === 'eth' ? 'ethereum' : 
                   symbol.toLowerCase() === 'btc' ? 'bitcoin' : 'ethereum';
    
    const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price`, {
      params: {
        ids: coinId,
        vs_currencies: 'usd',
        include_24hr_change: true,
        include_24hr_vol: true
      }
    });

    const data = response.data[coinId];
    
    return {
      price: data.usd,
      change24h: data.usd_24h_change,
      volume24h: data.usd_24h_vol,
      // Simulated RSI (in production, calculate from price history)
      rsi: 50 + (Math.random() * 40 - 20)
    };
  } catch (error) {
    console.log('⚠️  Market data unavailable, using mock data');
    return {
      price: 3847.23,
      change24h: 2.34,
      volume24h: 15000000000,
      rsi: 58
    };
  }
}

// Get AI agent opinion with retry logic
async function getAgentOpinion(agentPrompt, marketData, retryCount = 0) {
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 15000; // 15 seconds
  
  try {
    // Use the best available flash model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash" // Fast, stable, high rate limits
    });

    const prompt = `${agentPrompt}

Market Data:
- Price: $${marketData.price}
- 24h Change: ${marketData.change24h.toFixed(2)}%
- Volume: $${(marketData.volume24h / 1000000000).toFixed(2)}B
- RSI: ${marketData.rsi.toFixed(0)}

Respond ONLY in this exact format (no extra text):
DECISION|CONFIDENCE|REASONING

Where:
- DECISION is exactly one of: BUY, SELL, or HOLD
- CONFIDENCE is a number from 1-100
- REASONING is a brief explanation (max 100 chars)

Example: HOLD|75|Market consolidating, awaiting breakout signal`;

    const result = await model.generateContent(prompt);
    const response = result.response.text().trim();
    
    // Validate response format
    const parts = response.split('|');
    if (parts.length !== 3) {
      throw new Error('Invalid response format');
    }
    
    const [decision, confidence, reasoning] = parts;
    
    // Validate decision
    if (!['BUY', 'SELL', 'HOLD'].includes(decision)) {
      throw new Error('Invalid decision');
    }
    
    // Validate confidence
    const conf = parseInt(confidence);
    if (isNaN(conf) || conf < 1 || conf > 100) {
      throw new Error('Invalid confidence');
    }
    
    return response;
    
  } catch (error) {
    // Check if it's a rate limit error
    if (error.message.includes('429') || error.message.includes('quota')) {
      console.log(`⏳ Rate limit hit. Waiting ${RETRY_DELAY/1000}s before retry...`);
      
      if (retryCount < MAX_RETRIES) {
        await delay(RETRY_DELAY);
        return getAgentOpinion(agentPrompt, marketData, retryCount + 1);
      } else {
        console.log('❌ Max retries reached. Using fallback opinion.');
        return generateFallbackOpinion(marketData);
      }
    }
    
    // For other errors, throw
    throw error;
  }
}

// Generate fallback opinion when API fails
function generateFallbackOpinion(marketData) {
  // Simple logic-based decision
  let decision, confidence, reasoning;
  
  if (marketData.change24h > 5) {
    decision = 'BUY';
    confidence = 60;
    reasoning = 'Strong upward momentum detected';
  } else if (marketData.change24h < -5) {
    decision = 'SELL';
    confidence = 60;
    reasoning = 'Significant downward pressure';
  } else {
    decision = 'HOLD';
    confidence = 50;
    reasoning = 'Market showing consolidation pattern';
  }
  
  return `${decision}|${confidence}|${reasoning}`;
}

// Calculate consensus
function calculateConsensus(opinions) {
  const decisions = opinions.map(op => op.split('|')[0]);
  const confidences = opinions.map(op => parseInt(op.split('|')[1]));
  
  // Count votes
  const votes = {
    BUY: decisions.filter(d => d === 'BUY').length,
    SELL: decisions.filter(d => d === 'SELL').length,
    HOLD: decisions.filter(d => d === 'HOLD').length
  };
  
  // Find winning decision
  const finalDecision = Object.keys(votes).reduce((a, b) => 
    votes[a] > votes[b] ? a : b
  );
  
  // Determine agreement type
  const maxVotes = Math.max(...Object.values(votes));
  let agreement;
  if (maxVotes === 3) agreement = 'UNANIMOUS';
  else if (maxVotes === 2) agreement = 'MAJORITY';
  else agreement = 'SPLIT';
  
  // Calculate average confidence
  const avgConfidence = Math.round(
    confidences.reduce((a, b) => a + b, 0) / confidences.length
  );
  
  return `${finalDecision}|${agreement}|${avgConfidence}`;
}

// Record debate on blockchain
async function recordDebate(symbol, opinions, consensus) {
  try {
    console.log('\n⛓️  Recording debate on blockchain...');
    
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);
    
    const [analystView, skepticView, degenView] = opinions;
    const finalConfidence = parseInt(consensus.split('|')[2]);
    
    const tx = await contract.recordDebate(
      symbol,
      analystView,
      skepticView,
      degenView,
      consensus,
      finalConfidence
    );
    
    console.log('📝 Transaction sent:', tx.hash);
    console.log('⏳ Waiting for confirmation...');
    
    const receipt = await tx.wait();
    
    console.log('✅ Confirmed in block', receipt.blockNumber);
    console.log('⛽ Gas used:', receipt.gasUsed.toString());
    
    return receipt;
    
  } catch (error) {
    console.error('❌ Blockchain error:', error.message);
    throw error;
  }
}

// Main debate function
async function runDebate() {
  const symbol = 'ETH';
  
  console.log('\n🏛️  PANTHEON COUNCIL - DEBATE SESSION');
  console.log('═══════════════════════════════════════');
  console.log(`📊 Analyzing: ${symbol}`);
  console.log(`⏰ Time: ${new Date().toLocaleString()}`);
  console.log('═══════════════════════════════════════\n');
  
  try {
    // Fetch market data
    const marketData = await getMarketData(symbol);
    console.log(`✅ Price: $${marketData.price} | 24h: ${marketData.change24h.toFixed(2)}% | RSI: ${marketData.rsi.toFixed(0)}\n`);
    
    console.log('🤖 Consulting AI Council...\n');
    
    // Agent prompts
    const analystPrompt = `You are THE ANALYST - a meticulous technical analyst.
Focus on: RSI, volume trends, support/resistance levels.
Be data-driven and conservative.`;

    const skepticPrompt = `You are THE SKEPTIC - a cautious risk manager.
Focus on: Downside risks, market uncertainty, protecting capital.
Be defensive and question bullish narratives.`;

    const degenPrompt = `You are THE DEGEN - an aggressive momentum trader.
Focus on: Breakouts, FOMO opportunities, high-risk/high-reward plays.
Be bold and optimistic.`;
    
    // Get opinions sequentially with delays to avoid rate limits
    console.log('⏳ Consulting Analyst...');
    const analystView = await getAgentOpinion(analystPrompt, marketData);
    await delay(3000); // 3 second delay between calls
    
    console.log('⏳ Consulting Skeptic...');
    const skepticView = await getAgentOpinion(skepticPrompt, marketData);
    await delay(3000);
    
    console.log('⏳ Consulting Degen...');
    const degenView = await getAgentOpinion(degenPrompt, marketData);
    
    const opinions = [analystView, skepticView, degenView];
    
    // Display opinions
    console.log('\n💬 AGENT OPINIONS:');
    console.log('────────────────────────────────────────');
    const agentNames = ['🎯 ANALYST', '🛡️ SKEPTIC', '🚀 DEGEN'];
    opinions.forEach((opinion, i) => {
      const [decision, confidence, reasoning] = opinion.split('|');
      console.log(`\n${agentNames[i]}`);
      console.log(`   Decision: ${decision} | Confidence: ${confidence}%`);
      console.log(`   Reasoning: "${reasoning}"`);
    });
    
    // Calculate consensus
    const consensus = calculateConsensus(opinions);
    const [finalDecision, agreement, avgConfidence] = consensus.split('|');
    
    console.log('\n⚖️  CONSENSUS:');
    console.log('────────────────────────────────────────');
    console.log(`Decision: ${finalDecision}`);
    console.log(`Agreement: ${agreement}`);
    console.log(`Average Confidence: ${avgConfidence}%`);
    
    // Record on blockchain
    const receipt = await recordDebate(symbol, opinions, consensus);
    
    console.log('\n✅ DEBATE COMPLETE');
    console.log('════════════════════════════════════════');
    console.log(`🔗 View on Explorer: https://amoy.polygonscan.com/tx/${receipt.hash}`);
    console.log('════════════════════════════════════════\n');
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    process.exit(1);
  }
}

// Run the debate
runDebate();