const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying PantheonCouncil...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying with:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Balance:", hre.ethers.formatEther(balance), "MATIC");

  const PantheonCouncil = await hre.ethers.getContractFactory("PantheonCouncil");
  const pantheon = await PantheonCouncil.deploy();
  await pantheon.waitForDeployment();

  const address = await pantheon.getAddress();

  console.log("✅ Deployed to:", address);
  console.log("\n📋 Add to .env:");
  console.log("CONTRACT_ADDRESS=" + address);
  console.log("\n🔍 View on PolygonScan:");
  console.log("https://amoy.polygonscan.com/address/" + address);
}

main().catch(console.error);