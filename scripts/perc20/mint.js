// Import necessary modules from Hardhat and SwisstronikJS
const hre = require("hardhat");
const { encryptDataField, decryptNodeResponse } = require("@swisstronik/utils");

const sendShieldedTransaction = async (signer, address, data, value) => {
  const rpcLink = hre.network.config.url;
  const [encryptedData] = await encryptDataField(rpcLink, data);
  return await signer.sendTransaction({
    from: signer.address,
    to: address,
    data: encryptedData,
    value,
  });
};

async function main() {
  const contractAddress = "0x115AD0700ad258503eee2fc9B08ba4202aDD17F0";
  const [signer] = await hre.ethers.getSigners();
  const contractFactory = await hre.ethers.getContractFactory("PERC20Sample");
  console.log(contractFactory)
  const contract = contractFactory.attach(contractAddress);
  const functionName = "mint";
  const functionArg = ["0x0b4a1A22108A06811472a4cD8ae0d8C6b1E5b90a", "100000000000000000000000"];
  const mint100TokensTx = await sendShieldedTransaction(
    signer,
    contractAddress,
    contract.interface.encodeFunctionData(functionName, functionArg),
    0
  );

  await mint100TokensTx.wait();
  console.log("Transaction Receipt: ", mint100TokensTx);
}

// Using async/await pattern to handle errors properly
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
