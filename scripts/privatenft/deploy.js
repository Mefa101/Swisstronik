// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
    const baseTokenURI = "https://raw.githubusercontent.com/Mefa101/Swisstronik/main/contracts/metadata.json";
    const CaFie = await ethers.getContractFactory("CaFie");
    const cafie = await CaFie.deploy(baseTokenURI);
    await cafie.waitForDeployment();

    console.log("CaFie deployed to:", cafie.target);
}

main().catch((error) => {
    console.error(error);
    process.exit(1);
});
