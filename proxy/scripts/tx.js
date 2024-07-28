const { ethers } = require('ethers');

// Replace with your RPC URL
const rpcURL = 'https://json-rpc.testnet.swisstronik.com';
const provider = new ethers.JsonRpcProvider(rpcURL);

// Replace with your transaction hash
const txHash = '0x808d6fd5be26d86c5486fe02068634da067ebd8db80cefce0501c263f0c7eb3c';

async function getTransactionDetails() {
  try {
    // Query transaction details
    const transaction = await provider.getTransaction(txHash);

    if (transaction) {
      console.log('Transaction Details:', transaction);
    } else {
      console.log('Transaction not found');
    }
  } catch (error) {
    console.error('Error fetching transaction details:', error);
  }
}

getTransactionDetails();
