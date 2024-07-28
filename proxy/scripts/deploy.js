// scripts/deployProxy.js
const { ethers } = require("hardhat");
const { encryptDataField, decryptNodeResponse } = require("@swisstronik/utils");

const sendShieldedTransaction = async (signer, destination, data, value) => {
  // Get the RPC link from the network configuration
  const rpcLink = hre.network.config.url;

  // Encrypt transaction data
  const [encryptedData] = await encryptDataField(rpcLink, data);

  // Construct and sign transaction with encrypted data
  return await signer.sendTransaction({
    from: signer.address,
    to: destination,
    data: encryptedData,
    value,
  });
};

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with the account:", deployer.address);
  
  // Deploy SimpleStorage
  const SimpleStorage = await ethers.getContractFactory("SimpleStorage");
  const simpleStorage = await SimpleStorage.deploy();
  await simpleStorage.waitForDeployment();  // Await the deployment to complete
  console.log("SimpleStorage deployed to:", simpleStorage.target);
  
  // Deploy TransparentUpgradeableProxy
  const TransparentUpgradeableProxy = await ethers.getContractFactory("TransparentUpgradeableProxy");
  const proxy = await TransparentUpgradeableProxy.deploy(
      simpleStorage.target, // Implementation address
      deployer.address // Admin address
  );
  await proxy.waitForDeployment(); // Await the deployment to complete
  console.log("TransparentUpgradeableProxy deployed to:", proxy.target);
  
  // Deploy the updated implementation contract
  const SimpleStorageV2 = await ethers.getContractFactory("SimpleStorageV2");
  const newImplementation = await SimpleStorageV2.deploy();
  await newImplementation.waitForDeployment(); // Await the deployment to complete
  //console.log("SimpleStorageV2 deployed to:", newImplementation.target);
  address = newImplementation.target;
  console.log(address)
  
  // Upgrade the proxy to the new implementations
  const tx = await proxy.upgradeTo(address);
  await tx.wait();
  console.log("Upgraded proxy to new implementation");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
