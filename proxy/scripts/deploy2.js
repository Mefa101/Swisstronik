const hre = require("hardhat");
const { encryptDataField, decryptNodeResponse } = require("@swisstronik/utils");

// Function to send a shielded transaction using the provided signer, destination, data, and value
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
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy SimpleStorage
  const SimpleStorage = await hre.ethers.getContractFactory("SimpleStorage");
  const simpleStorage = await SimpleStorage.deploy();
  await simpleStorage.waitForDeployment()
  console.log("SimpleStorage deployed to:", simpleStorage.target);

  // Deploy TransparentUpgradeableProxy
  const TransparentUpgradeableProxy = await hre.ethers.getContractFactory("TransparentUpgradeableProxy");
  const proxy = await TransparentUpgradeableProxy.deploy(
      simpleStorage.target, 
      deployer.address, // Admin address
      [] // Initialize the proxy with empty data
  );
  //console.log(proxy);

  // Wait for the proxy deployment to be mined and log the transaction hash
  const proxyDeployTx = await proxy.waitForDeployment();
  console.log (proxyDeployTx);
  console.log("TransparentUpgradeableProxy deployed to:", proxy.target);

  0xc595939b4fd96ef4a73d85e29f16f21b0cb27cb34778b13f7dc4515e1d3ec9bf
  // Deploy the updated implementation contract
  const SimpleStorageV2 = await hre.ethers.getContractFactory("SimpleStorageV2");
  const newImplementation = await SimpleStorageV2.deploy();
  await newImplementation.waitForDeployment();
  console.log("SimpleStorageV2 deployed to:", newImplementation.target);

  // Get the proxy contract instance
  const proxyContract = await hre.ethers.getContractAt("TransparentUpgradeableProxy", proxy.target);

  // Encode the upgradeTo function call
  const upgradeFunctionData = proxyContract.interface.encodeFunctionData("upgradeTo", [newImplementation.target]);

  // Send the shielded transaction to upgrade the proxy
  const upgradeTx = await sendShieldedTransaction(
    deployer,
    proxy.target,
    upgradeFunctionData,
    0
  );

  await upgradeTx.wait();
  const receipt = await upgradeTx.wait();
  
  // Print the transaction hash
  console.log("Upgrade Transaction Hash:", upgradeTx.hash);
}

// Using async/await pattern to handle errors properly
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
