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
  const replace_contractAddress = "0x115AD0700ad258503eee2fc9B08ba4202aDD17F0";
  const [signer] = await hre.ethers.getSigners();
  const replace_contractFactory = await hre.ethers.getContractFactory("PERC20Sample");
  const contract = replace_contractFactory.attach(replace_contractAddress);
  const replace_functionName = "transfer";
  const replace_functionArgs = ["0x16af037878a6cAce2Ea29d39A3757aC2F6F7aac1", "1000000000000000000"];
  const transaction = await sendShieldedTransaction(
    signer, 
    replace_contractAddress, 
    contract.interface.encodeFunctionData(replace_functionName, replace_functionArgs), 0);

  await transaction.wait();
  console.log("Transaction Response: ", transaction);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});