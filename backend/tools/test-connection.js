require('dotenv').config();
const { ethers } = require('ethers');

const CONTRACT_ABI = [
  "function getTotalDebates() external view returns (uint256)",
  "function getLatestDebate() external view returns (tuple(uint256 id, uint256 timestamp, string symbol, string analystView, string skepticView, string degenView, string consensus, uint256 finalConfidence, address recorder))"
];

async function testConnection() {
  console.log('🔍 Testing Pantheon Connection...\n');
  
  // Test 1: Environment Variables
  console.log('📋 Environment Variables:');
  console.log('  CONTRACT_ADDRESS:', process.env.CONTRACT_ADDRESS ? '✅ Set' : '❌ Missing');
  console.log('  RPC_URL:', process.env.RPC_URL ? '✅ Set' : '❌ Missing');
  console.log('  GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✅ Set' : '❌ Missing');
  console.log('  PRIVATE_KEY:', process.env.PRIVATE_KEY ? '✅ Set' : '❌ Missing');
  console.log();
  
  if (!process.env.CONTRACT_ADDRESS || !process.env.RPC_URL) {
    console.error('❌ Missing required environment variables!');
    return;
  }
  
  try {
    // Test 2: RPC Connection
    console.log('🔗 Testing RPC Connection...');
    const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    const network = await provider.getNetwork();
    console.log(`✅ Connected to network: ${network.name} (Chain ID: ${network.chainId})`);
    console.log();
    
    // Test 3: Contract Connection
    console.log('📜 Testing Contract Connection...');
    const contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      CONTRACT_ABI,
      provider
    );
    console.log(`✅ Contract initialized at: ${process.env.CONTRACT_ADDRESS}`);
    console.log();
    
    // Test 4: Read Total Debates
    console.log('📊 Reading Contract Data...');
    const totalDebates = await contract.getTotalDebates();
    console.log(`✅ Total Debates: ${totalDebates.toString()}`);
    console.log();
    
    // Test 5: Read Latest Debate (if exists)
    if (Number(totalDebates) > 0) {
      console.log('📖 Latest Debate:');
      const debate = await contract.getLatestDebate();
      console.log(`  ID: ${debate.id.toString()}`);
      console.log(`  Symbol: ${debate.symbol}`);
      console.log(`  Timestamp: ${new Date(Number(debate.timestamp) * 1000).toLocaleString()}`);
      console.log(`  Consensus: ${debate.consensus.split('|')[0]}`);
      console.log();
    } else {
      console.log('ℹ️  No debates recorded yet. Run "node agent.js" to create one!');
      console.log();
    }
    
    // Test 6: Wallet Balance (if private key exists)
    if (process.env.PRIVATE_KEY) {
      console.log('💰 Checking Wallet Balance...');
      const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
      const balance = await provider.getBalance(wallet.address);
      const balanceInMatic = ethers.formatEther(balance);
      console.log(`  Address: ${wallet.address}`);
      console.log(`  Balance: ${balanceInMatic} MATIC`);
      
      if (parseFloat(balanceInMatic) < 0.01) {
        console.log('  ⚠️  Low balance! Get testnet tokens from https://faucet.polygon.technology/');
      } else {
        console.log('  ✅ Sufficient balance');
      }
      console.log();
    }
    
    console.log('✅ All tests passed!');
    console.log('\n🎯 Next steps:');
    if (Number(totalDebates) === 0) {
      console.log('  1. Run: node agent.js');
      console.log('  2. Wait for debate to be recorded');
      console.log('  3. Refresh your frontend');
    } else {
      console.log('  1. Your frontend should show the debates');
      console.log('  2. If not, check frontend .env file');
      console.log('  3. Make sure VITE_CONTRACT_ADDRESS matches backend CONTRACT_ADDRESS');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('  1. Verify CONTRACT_ADDRESS is correct');
    console.log('  2. Check RPC_URL is working');
    console.log('  3. Ensure contract is deployed on correct network');
    console.log('  4. Try redeploying: npm run deploy');
  }
}

testConnection();