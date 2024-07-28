// Import Hardhat and SwisstronikJS functions
const hre = require("hardhat");
const { encryptDataField, decryptNodeResponse } = require("@swisstronik/utils");

/**
 * Send a shielded query/call to the Swisstronik blockchain.
 *
 * @param {object} provider - The provider object for making the call.
 * @param {string} destination - The address of the contract to call.
 * @param {string} data - Encoded data for the function call.
 *
 * @returns {Uint8Array} - Encrypted response from the blockchain.
 */
const sendShieldedQuery = async (provider, destination, data) => {
  const rpclink = hre.network.config.url;
  const [encryptedData, usedEncryptedKey] = await encryptDataField(
    rpclink,
    data
  );
  const response = await provider.call({
    to: destination,
    data: encryptedData,
  });
  console.log (response)

  // Decrypt the call result using SwisstronikJS function
  return await decryptNodeResponse(rpclink, response, usedEncryptedKey);
};

async function main() {
  const proxyAddress = "0x08232A677fa9E6DFe3BA28ae27e29966074B99Bf";
  const [signer] = await hre.ethers.getSigners();
  const contractFactory = await hre.ethers.getContractFactory("Swisstronik");
  const contract = contractFactory.attach(proxyAddress);
  const functionName = "getMessage";
  const responseMessage = await sendShieldedQuery(
    signer.provider,
    proxyAddress,
    contract.interface.encodeFunctionData(functionName)
  );
  console.log(responseMessage)
  console.log(
    "Decoded response:",
    contract.interface.decodeFunctionResult(functionName, responseMessage)[0]
  );
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
