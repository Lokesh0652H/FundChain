const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying FundChain Smart Contract to network...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const FundChain = await hre.ethers.getContractFactory("FundChain");
  const fundchain = await FundChain.deploy();
  await fundchain.waitForDeployment();

  const contractAddress = await fundchain.getAddress();
  console.log("FundChain deployed successfully to:", contractAddress);

  const contractDetails = {
    address: contractAddress,
    deployer: deployer.address,
    network: hre.network.name,
    deployedAt: new Date().toISOString()
  };

  const outputPath = path.join(__dirname, "../contract-address.json");
  fs.writeFileSync(outputPath, JSON.stringify(contractDetails, null, 2));
  console.log(`Saved deployment details to ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
