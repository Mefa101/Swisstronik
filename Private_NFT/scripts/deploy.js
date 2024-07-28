const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  const MyToken = await ethers.getContractFactory("CaFie");
  console.log(MyToken)
  const baseTokenURI = "https://raw.githubusercontent.com/Mefa101/Swisstronik/main/contracts/metadata.json";
  const myToken = await MyToken.deploy(baseTokenURI);
  await myToken.waitForDeployment();
  console.log("MyToken deployed to:", myToken.target);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });