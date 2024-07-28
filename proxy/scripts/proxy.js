const hre = require("hardhat");
const { encryptDataField, decryptNodeResponse } = require("@swisstronik/utils");

// Import necessary functions from Hardhat
const { ethers } = hre;

/**
 * Send a shielded transaction to the Swisstronik blockchain.
 *
 * @param {object} signer - The signer object for sending the transaction.
 * @param {string} destination - The address of the contract to interact with.
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

/**
 * Interact with the HelloWorld contract via proxy and set a new message.
 */
const interactWithHelloWorld = async () => {
  // Addresses
  const proxyAddress = "0x4125403651Ea215FF150fBE3edF8ACf3a7a414aa"; // Proxy address

  // Get the contract factory for HelloWorld
  const HelloWorld = await ethers.getContractFactory("HelloWorld");

  // Attach the proxy address to the HelloWorld contract factory
  const helloWorldProxy = HelloWorld.attach(proxyAddress);

  // Get the signer (your account)
  const [signer] = await ethers.getSigners();

  // Set a new message through the proxy
  const newMessage = "Hello, Proxy!";
  const tx = await helloWorldProxy.connect(signer).setMessage(newMessage);
  await tx.wait();
  console.log("Message updated through proxy");

  // Retrieve and log the updated message
  const updatedMessage = await helloWorldProxy.getMessage();
  console.log("Updated message:", updatedMessage);
};

async function main() {
  await interactWithHelloWorld();
}

// Using async/await pattern to handle errors properly
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
