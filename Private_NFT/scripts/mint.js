// Import necessary modules from Hardhat and SwisstronikJS
const hre = require("hardhat");
const { encryptDataField } = require("@swisstronik/utils");

// Function to send a shielded transaction using the provided signer, destination, data, and value
const sendShieldedTransaction = async (signer, destination, data, value) => {
  try {
    // Get the RPC link from the network configuration
    const rpcLink = hre.network.config.url;

    // Encrypt transaction data
    const [encryptedData] = await encryptDataField(rpcLink, data);

    // Construct and send transaction with encrypted data
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
    // Address of the deployed contract
    const contractAddress = "0xbe821Cd53a7e6E957F22cC866f6D2Bd42Ab1f18c";

    // Get the signer (your account)
    const [signer] = await hre.ethers.getSigners();

    // Create a contract instance
    const contractFactory = await hre.ethers.getContractFactory("CoFi");
    const contract = contractFactory.attach(contractAddress);

    // Define the function name and arguments
    const functionName = "mint";
    const recipientAddress = "0x0b4a1A22108A06811472a4cD8ae0d8C6b1E5b90a";

    // Encode the function data with arguments
    const mintFunctionData = contract.interface.encodeFunctionData(functionName, [recipientAddress]);

    // Send the shielded transaction
    console.log("Sending shielded transaction to mint NFT...");
    const mintTx = await sendShieldedTransaction(
      signer,
      contractAddress,
      mintFunctionData,
      0
    );

    // Wait for the transaction to be mined
    await mintTx.wait();

    // Log the transaction receipt
    console.log("Transaction Receipt:", mintTx);
  } catch (error) {
    console.error("Error in main function:", error);
    process.exitCode = 1;
  }
}

// Using async/await pattern to handle errors properly
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
