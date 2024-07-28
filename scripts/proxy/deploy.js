const hre = require("hardhat");
const { encryptDataField, decryptNodeResponse } = require("@swisstronik/utils");
const sendShieldedTransaction = async (signer, destination, data, value) => {
  const rpcLink = hre.network.config.url;
  const [encryptedData] = await encryptDataField(rpcLink, data);
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
  const SimpleStorage = await hre.ethers.getContractFactory("SimpleStorage");
  const simpleStorage = await SimpleStorage.deploy();
  await simpleStorage.waitForDeployment()
  console.log("SimpleStorage deployed to:", simpleStorage.target);
  const TransparentUpgradeableProxy = await hre.ethers.getContractFactory("TransparentUpgradeableProxy");
  const proxy = await TransparentUpgradeableProxy.deploy(
      simpleStorage.target, 
      deployer.address, // Admin address
      [] // Initialize the proxy with empty data
  );
  //console.log(proxy);
  const proxyDeployTx = await proxy.waitForDeployment();
  console.log (proxyDeployTx);
  console.log("TransparentUpgradeableProxy deployed to:", proxy.target);
  const SimpleStorageV2 = await hre.ethers.getContractFactory("SimpleStorageV2");
  const newImplementation = await SimpleStorageV2.deploy();
  await newImplementation.waitForDeployment();
  console.log("SimpleStorageV2 deployed to:", newImplementation.target);
  const proxyContract = await hre.ethers.getContractAt("TransparentUpgradeableProxy", proxy.target);
  const upgradeFunctionData = proxyContract.interface.encodeFunctionData("upgradeTo", [newImplementation.target]);
  const upgradeTx = await sendShieldedTransaction(
    deployer,
    proxy.target,
    upgradeFunctionData,
    0
  );

  await upgradeTx.wait();
  const receipt = await upgradeTx.wait();
  console.log("Upgrade Transaction Hash:", upgradeTx.hash);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
