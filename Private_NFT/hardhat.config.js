require('@nomicfoundation/hardhat-toolbox');
// Remember to use the private key of a testing account
// For better security practices, it's recommended to use npm i dotenv for storing secret variables

// hh verify 0x00ab1e607fAD7E2f6923624b4242A7506397fd2D --contract contracts/Lock.sol:Lock 1893456000

module.exports = {
  defaultNetwork: "swisstronik",
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 800
      }
    }
  },
  networks: {
    swisstronik: {
      url: "https://json-rpc.testnet.swisstronik.com",
      accounts: [`0x` + ``],
    },
  },
  etherscan: {
    apiKey: `ab6536vbsajh`,
    customChains: [
      {
        network: "swisstronik",
        chainId: 1291,
        urls: {
          apiURL: "https://explorer-evm.testnet.swisstronik.com/api",
          browserURL: "https://explorer-evm.testnet.swisstronik.com",
        },
      },
    ],
  },
};