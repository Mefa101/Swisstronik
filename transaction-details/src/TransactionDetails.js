import React, { useState } from 'react';
import { ethers } from 'ethers';

const TransactionDetails = () => {
  const [txHash, setTxHash] = useState('');
  const [transaction, setTransaction] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const rpcURL = 'https://json-rpc.testnet.swisstronik.com';
  const provider = new ethers.JsonRpcProvider(rpcURL);

  const fetchTransactionDetails = async () => {
    if (!txHash) {
      setError('Please provide a transaction hash.');
      return;
    }

    setLoading(true);
    setError('');
    setTransaction(null);

    try {
      const tx = await provider.getTransaction(txHash);
      if (tx) {
        setTransaction(tx);
      } else {
        setError('Transaction not found.');
      }
    } catch (err) {
      setError(`Error fetching transaction details: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Transaction Details</h1>
      <input
        type="text"
        value={txHash}
        onChange={(e) => setTxHash(e.target.value)}
        placeholder="Enter transaction hash"
      />
      <button onClick={fetchTransactionDetails} disabled={loading}>
        {loading ? 'Fetching...' : 'Get Details'}
      </button>
      {error && <p className="error">{error}</p>}
      {transaction && (
        <div className="transaction-details">
          <h2>Transaction Details</h2>
          <p><strong>Hash:</strong> {transaction.hash}</p>
          <p><strong>From:</strong> {transaction.from}</p>
          <p><strong>To:</strong> {transaction.to}</p>
          <p><strong>Value:</strong> {ethers.formatEther(transaction.value)} SWTR</p>
          <p><strong>Gas Price:</strong> {ethers.formatUnits(transaction.gasPrice, 'gwei')} Gwei</p>
          <p><strong>Gas Limit:</strong> {transaction.gasLimit.toString()}</p>
          <p><strong>Nonce:</strong> {transaction.nonce}</p>
        </div>
      )}
    </div>
  );
};

export default TransactionDetails;
