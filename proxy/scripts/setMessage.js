// Import Hardhat and SwisstronikJS functions
const hre = require("hardhat");
const { encryptDataField, decryptNodeResponse } = require("@swisstronik/utils");

/**
 * Send a shielded transaction to the Swisstronik blockchain.
 *
 * @param {object} signer - The signer object for sending the transaction.
 * @param {string} destination - The address of the contract to interact with (proxy address).
 * @param {string} data - Encoded data for the transaction.
 * @param {number} value - Amount of value to send with the transaction.
 *
 * @returns {Promise} - The transaction object.
 */
const sendShieldedTransaction = async (signer, destination, data, value) => {
  // Get the RPC link from the network configuration
  const rpclink = hre.network.config.url;

  // Encrypt transaction data
  const [encryptedData] = await encryptDataField(rpclink, data);

  // Construct and sign transaction with encrypted data
  return await signer.sendTransaction({
    from: signer.address,
    to: destination,
    data: encryptedData,
    value,
  });
};

async function main() {
  // Address of the deployed proxy contract
  const proxyAddress = "0x08232A677fa9E6DFe3BA28ae27e29966074B99Bf"; // Replace with your proxy address

  // Get the signer (your account)
  const [signer] = await hre.ethers.getSigners();
  console.log(signer)

  // Construct a contract instance for the proxy
  const contractFactory = await hre.ethers.getContractFactory("Swisstronik");
  const contract = contractFactory.attach(proxyAddress);

  // Send a shielded transaction to set a message in the contract
  const functionName = "setMessage";
  const messageToSet = "Hello Swisstronik!!";
  const setMessageTx = await sendShieldedTransaction(
    signer,
    proxyAddress, // Send transaction to the proxy address
    contract.interface.encodeFunctionData(functionName, [messageToSet]),
    0
  );
  await setMessageTx.wait();

  // It should return a TransactionResponse object
  console.log("Transaction Receipt: ", setMessageTx);
}

// Using async/await pattern to handle errors properly
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
