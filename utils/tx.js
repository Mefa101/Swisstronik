const { ethers } = require('ethers');
const rpcURL = 'https://json-rpc.testnet.swisstronik.com';
const provider = new ethers.JsonRpcProvider(rpcURL);
const txHash = process.argv[2];

if (!txHash) {
  console.error('Please provide a transaction hash as an argument.');
  process.exit(1);
}

async function getTransactionDetails() {
  try {
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