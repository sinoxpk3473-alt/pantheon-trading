require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { ethers } = require('ethers');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Initialize blockchain connection
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Contract ABI (add the new recordDebate function)
const contractABI = [
  "function recordDebate(string analystView, string skepticView, string degenView, string consensus, uint256 confidence) external",
  "function recordTrade(string symbol, string side, uint256 entryPrice, uint256 quantity, uint256 confidence, string verdict) external returns (uint256)",
  "function getTotalTrades() external view returns (uint256)"
];

const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS,
  contractABI,
  wallet
);

// AI Agent Personalities
const AGENTS = {
  analyst: {
    name: "The Analyst",
    emoji: "🤓",
    personality: `You are a meticulous, data-driven technical analyst. 
    - You ONLY trust hard data, charts, and proven indicators
    - You analyze RSI, MACD, moving averages, and volume
    - You're cautious and require 70%+ confidence before recommending trades
    - You speak in precise, analytical language
    - Risk tolerance: LOW (3/10)
    - Never use emojis or casual language`,
    riskTolerance: 3
  },
  
  skeptic: {
    name: "The Skeptic",
    emoji: "🛡️",
    personality: `You are a paranoid risk manager and contrarian thinker.
    - You ALWAYS find reasons why a trade could go wrong
    - You focus on market manipulation, liquidity risks, and black swan events
    - You question every bullish signal and look for bear traps
    - You prefer HOLD or SELL over BUY in 80% of cases
    - Risk tolerance: VERY LOW (2/10)
    - You're pessimistic but rational`,
    riskTolerance: 2
  },
  
  degen: {
    name: "The Degen",
    emoji: "🚀",
    personality: `You are an aggressive momentum trader and risk-taker.
    - You LOVE volatility and see every dip as a buying opportunity
    - You use phrases like "moon", "send it", "diamond hands"
    - You trade on FOMO, hype, and social sentiment
    - You recommend BUY in 70% of cases
    - Risk tolerance: VERY HIGH (9/10)
    - You're optimistic and action-biased`,
    riskTolerance: 9
  }
};

// Fetch market data (mock for now, replace with real API)
async function getMarketData(symbol) {
  // In production, fetch from Binance/CoinGecko API
  // For now, return mock data
  return {
    symbol: symbol,
    price: 3450.25,
    change24h: 2.3,
    volume: 15000000000,
    rsi: 58,
    sentiment: "bullish"
  };
}

// Get AI opinion from specific agent
async function getAgentOpinion(agentType, marketData) {
  const agent = AGENTS[agentType];
  
  const prompt = `${agent.personality}

MARKET DATA:
Symbol: ${marketData.symbol}
Current Price: $${marketData.price}
24h Change: ${marketData.change24h}%
Volume: $${marketData.volume.toLocaleString()}
RSI: ${marketData.rsi}
Market Sentiment: ${marketData.sentiment}

Based on this data, provide your analysis in this EXACT JSON format:
{
  "decision": "BUY" or "SELL" or "HOLD",
  "confidence": 1-100 (integer only),
  "reasoning": "One sentence explaining your decision (max 120 characters)",
  "riskLevel": 1-10
}

Respond ONLY with valid JSON. No markdown, no extra text.`;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean response (remove markdown if present)
    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const opinion = JSON.parse(cleanText);
    
    return {
      agent: agentType,
      name: agent.name,
      emoji: agent.emoji,
      decision: opinion.decision,
      confidence: Math.round(opinion.confidence),
      reasoning: opinion.reasoning,
      riskLevel: opinion.riskLevel,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error(`❌ Error getting ${agentType} opinion:`, error.message);
    
    // Fallback opinion if AI fails
    return {
      agent: agentType,
      name: agent.name,
      emoji: agent.emoji,
      decision: "HOLD",
      confidence: 50,
      reasoning: "Unable to analyze - defaulting to HOLD",
      riskLevel: 5,
      timestamp: Date.now()
    };
  }
}

// Build consensus from three opinions
function buildConsensus(opinions) {
  const decisions = opinions.map(o => o.decision);
  const avgConfidence = Math.round(
    opinions.reduce((sum, o) => sum + o.confidence, 0) / opinions.length
  );
  
  // Count votes
  const votes = {
    BUY: decisions.filter(d => d === "BUY").length,
    SELL: decisions.filter(d => d === "SELL").length,
    HOLD: decisions.filter(d => d === "HOLD").length
  };
  
  // Determine consensus
  let consensus = "HOLD"; // default
  let agreement = "SPLIT";
  
  if (votes.BUY > votes.SELL && votes.BUY > votes.HOLD) {
    consensus = "BUY";
    agreement = votes.BUY === 3 ? "UNANIMOUS" : votes.BUY === 2 ? "MAJORITY" : "SPLIT";
  } else if (votes.SELL > votes.BUY && votes.SELL > votes.HOLD) {
    consensus = "SELL";
    agreement = votes.SELL === 3 ? "UNANIMOUS" : votes.SELL === 2 ? "MAJORITY" : "SPLIT";
  } else {
    consensus = "HOLD";
    agreement = votes.HOLD === 3 ? "UNANIMOUS" : "MAJORITY";
  }
  
  return {
    decision: consensus,
    confidence: avgConfidence,
    agreement: agreement,
    votes: votes
  };
}

// Format opinion for contract storage
function formatForContract(opinion) {
  return `${opinion.decision}|${opinion.confidence}|${opinion.reasoning}`;
}

// Main execution loop
async function runCouncilDebate(symbol = "ETH") {
  console.log("\n🏛️ PANTHEON COUNCIL - DEBATE SESSION");
  console.log("═".repeat(60));
  console.log(`📊 Analyzing: ${symbol}`);
  console.log(`⏰ Time: ${new Date().toLocaleString()}`);
  console.log("═".repeat(60));
  
  try {
    // 1. Fetch market data
    console.log("\n📈 Fetching market data...");
    const marketData = await getMarketData(symbol);
    console.log(`✅ Price: $${marketData.price} | 24h: ${marketData.change24h}% | RSI: ${marketData.rsi}`);
    
    // 2. Get opinions from all three agents (parallel)
    console.log("\n🤖 Consulting AI Council...");
    const [analystOp, skepticOp, degenOp] = await Promise.all([
      getAgentOpinion('analyst', marketData),
      getAgentOpinion('skeptic', marketData),
      getAgentOpinion('degen', marketData)
    ]);
    
    // 3. Display individual opinions
    console.log("\n💬 AGENT OPINIONS:");
    console.log("─".repeat(60));
    
    [analystOp, skepticOp, degenOp].forEach(op => {
      console.log(`${op.emoji} ${op.name.toUpperCase()}`);
      console.log(`   Decision: ${op.decision} | Confidence: ${op.confidence}%`);
      console.log(`   Reasoning: "${op.reasoning}"`);
      console.log(`   Risk Level: ${op.riskLevel}/10`);
      console.log("");
    });
    
    // 4. Build consensus
    const consensus = buildConsensus([analystOp, skepticOp, degenOp]);
    
    console.log("⚖️  CONSENSUS:");
    console.log("─".repeat(60));
    console.log(`Decision: ${consensus.decision}`);
    console.log(`Agreement: ${consensus.agreement}`);
    console.log(`Votes: BUY(${consensus.votes.BUY}) SELL(${consensus.votes.SELL}) HOLD(${consensus.votes.HOLD})`);
    console.log(`Average Confidence: ${consensus.confidence}%`);
    
    // 5. Record on blockchain
    console.log("\n⛓️  Recording debate on blockchain...");
    
    const analystStr = formatForContract(analystOp);
    const skepticStr = formatForContract(skepticOp);
    const degenStr = formatForContract(degenOp);
    const consensusStr = `${consensus.decision}|${consensus.agreement}|${consensus.confidence}`;
    
    const tx = await contract.recordDebate(
      analystStr,
      skepticStr,
      degenStr,
      consensusStr,
      consensus.confidence
    );
    
    console.log(`📝 Transaction sent: ${tx.hash}`);
    console.log(`⏳ Waiting for confirmation...`);
    
    const receipt = await tx.wait();
    
    console.log(`✅ Confirmed in block ${receipt.blockNumber}`);
    console.log(`⛽ Gas used: ${receipt.gasUsed.toString()}`);
    
    // 6. Summary
    console.log("\n" + "═".repeat(60));
    console.log("✨ DEBATE COMPLETE");
    console.log("═".repeat(60));
    console.log(`🔗 View on Explorer: https://amoy.polygonscan.com/tx/${tx.hash}`);
    console.log("═".repeat(60) + "\n");
    
    return {
      opinions: [analystOp, skepticOp, degenOp],
      consensus: consensus,
      txHash: tx.hash,
      blockNumber: receipt.blockNumber
    };
    
  } catch (error) {
    console.error("\n❌ ERROR:", error.message);
    throw error;
  }
}

// Run debate every 5 minutes
async function startCouncil() {
  console.log("🚀 Starting Pantheon AI Council...");
  console.log(`🔑 Contract: ${process.env.CONTRACT_ADDRESS}`);
  console.log(`🌐 Network: Polygon Amoy`);
  
  // Run first debate immediately
  await runCouncilDebate("ETH");
  
  // Then run every 5 minutes
  setInterval(async () => {
    try {
      await runCouncilDebate("ETH");
    } catch (error) {
      console.error("Error in debate loop:", error);
    }
  }, 5 * 60 * 1000); // 5 minutes
}

// If running directly
if (require.main === module) {
  startCouncil().catch(console.error);
}

module.exports = { runCouncilDebate, getAgentOpinion, buildConsensus };