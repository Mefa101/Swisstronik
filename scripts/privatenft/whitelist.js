// Import necessary modules from Hardhat and SwisstronikJS
const hre = require("hardhat");
const { encryptDataField } = require("@swisstronik/utils");
const sendShieldedTransaction = async (signer, destination, data, value) => {
  try {
    const rpcLink = hre.network.config.url;
    const [encryptedData] = await encryptDataField(rpcLink, data);
    const tx = {
      to: destination,
      data: encryptedData,
      value,
    };

    console.log("Transaction Details:", tx);
    return await signer.sendTransaction(tx);
  } catch (error) {
    console.error("Error in sendShieldedTransaction:", error);
    throw error;
  }
};

async function main() {
  try {
    const contractAddress = "0x18e5Cf3cC617e5ee83Dc8E99bc01E3CB3d0b6f4d";
    const [signer] = await hre.ethers.getSigners();
    const contractFactory = await hre.ethers.getContractFactory("CaFie");
    const contract = contractFactory.attach(contractAddress);
    const functionName = "addToWhitelist";
    const recipientAddress = ["0x0b4a1A22108A06811472a4cD8ae0d8C6b1E5b90a", "0xfE03Da19e785614b8333aEA597689DB9E1aDA317"];
    const mintFunctionData = contract.interface.encodeFunctionData(functionName, [recipientAddress]);
    console.log("Sending shielded transaction to mint NFT...");
    const mintTx = await sendShieldedTransaction(
      signer,
      contractAddress,
      mintFunctionData,
      0
    );
    await mintTx.wait();
    console.log("Transaction Receipt:", mintTx);
  } catch (error) {
    console.error("Error in main function:", error);
    process.exitCode = 1;
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
