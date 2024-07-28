require('dotenv').config();  // Import dotenv and configure it
const { ethers } = require("hardhat");
const { sendSignedShieldedQuery } = require("./utils");

async function main() {
  // Step 1: Deploy the contract
  const PERC20 = await ethers.getContractFactory("PERC20Sample");
  const perc20 = await PERC20.deploy();
  await perc20.deployed();

  console.log(`PERC20Sample was deployed to ${perc20.address}`);

  // Step 2: Restore wallet from private key
  const wallet = new ethers.Wallet(
    process.env.PRIVATE_KEY,
    new ethers.providers.JsonRpcProvider(hre.network.config.url)
  );

  // Convert some ETH to pSWTR token (if your contract supports this)
  const tx = await wallet.sendTransaction({
    to: perc20.address,
    value: ethers.utils.parseEther("0.1"),
  });
  await tx.wait();

  // Step 3: Perform the test
  const req = await sendSignedShieldedQuery(
    wallet,
    perc20.address,
    perc20.interface.encodeFunctionData("balanceOf", [wallet.address])
  );

  const balance = perc20.interface.decodeFunctionResult("balanceOf", req)[0];
  console.log("balance: ", balance.toString());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
