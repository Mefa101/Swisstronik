const { ethers } = require('ethers');

const rpcURL = 'https://json-rpc.testnet.swisstronik.com';
const provider = new ethers.JsonRpcProvider(rpcURL);
const txHash = '0x415e71da0d7656f76443024a161b86fedf24648b50369c96dc3e81b8be3a6c5a';

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
