const { GoogleGenerativeAI } = require("@google/generative-ai");
const { ethers } = require("ethers");
require("dotenv").config(); // Load env vars from root

// Import the ABI (The manual needed to talk to the contract)
const contractArtifact = require("../artifacts/contracts/PantheonCouncil.sol/PantheonCouncil.json");

async function runAgent() {
  console.log("🤖 AI AGENT WAKING UP...");

  // 1. SETUP BLOCKCHAIN CONNECTION
 const provider = new ethers.JsonRpcProvider(process.env.AMOY_RPC_URL || "https://rpc-amoy.polygon.technology/");
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, contractArtifact.abi, wallet);

  console.log("🔗 Connected to Contract:", process.env.CONTRACT_ADDRESS);

  // 2. ASK GEMINI FOR TRADING ADVICE
  console.log("🧠 Consulting Gemini...");
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

  const prompt = `
    You are an expert crypto trader. Analyze the current market sentiment for Ethereum (ETH).
    Respond strictly in this JSON format:
    {
      "symbol": "ETH",
      "side": "BUY" or "SELL",
      "entryPrice": 2500,
      "quantity": 1,
      "confidence": 85,
      "verdict": "Short sentence explaining why"
    }
    Generate dummy data for the price if you don't have real-time access.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  // Clean up JSON formatting (Gemini sometimes adds ```json blocks)
  const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
  const tradeData = JSON.parse(jsonStr);

  console.log("💡 Gemini says:", tradeData.side, tradeData.verdict);

// 3. WRITE TO BLOCKCHAIN
  console.log("📝 Recording trade on Polygon Amoy...");

  // ⚠️ FIX: Solidity only accepts Integers. We must remove decimals.
  // If the AI gives 0.55, we round it to 1.
  const safeEntryPrice = Math.round(tradeData.entryPrice) || 0;
  const safeQuantity = Math.round(tradeData.quantity) || 1; 
  const safeConfidence = Math.round(tradeData.confidence) || 50;

  const tx = await contract.recordTrade(
    tradeData.symbol,
    tradeData.side,
    safeEntryPrice,
    safeQuantity,
    safeConfidence,
    tradeData.verdict
  );

  console.log("⏳ Transaction sent! Waiting for confirmation...");
  await tx.wait();

  console.log("✅ TRADE IMMUTABLE RECORDED!");
  console.log("🔗 View Transaction: [https://amoy.polygonscan.com/tx/](https://amoy.polygonscan.com/tx/)" + tx.hash);
}

runAgent().catch(console.error);