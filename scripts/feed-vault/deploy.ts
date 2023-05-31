import "../../env-config";
import { ethers } from "hardhat";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import configArgs from "./config-args";
import { delayTime } from "../@helpers/block-chain.helper";



const { utils, getSigners, getContractFactory, provider } = ethers;
const { formatEther } = utils;

const { NODE_ENV, NETWORK_PROVIDER, TOKEN_ADDRESS, DEX_CONTRACT } = configArgs;

async function main() {
    const output: any = {};
    const [deployer] = await getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    const balance = await deployer.getBalance();
    console.log("Account balance:", formatEther(balance));
    Object.assign(output, {
        DEPLOYER_ADDRESS: deployer.address,
    })

    const tokenFactory = await getContractFactory("FeedVault");
    const tokenCt = await tokenFactory.deploy(TOKEN_ADDRESS.BUSD, DEX_CONTRACT.ROUTER, DEX_CONTRACT.FACTORY);
    await tokenCt.deployed();

    console.log(`${"FeedVault"} deployed to:`, tokenCt.address);
    const linkDeploy = `${NETWORK_PROVIDER.URL_SCAN}/address/${tokenCt.address}`.trim();
    console.log('--------linkDeploy-----------');
    console.log(linkDeploy);
    console.log('-------------------');
    Object.assign(output, {
        TOKEN_ADDRESS: tokenCt.address,
        verifyData: {
            address: tokenCt.address,
            constructorArguments: [
                TOKEN_ADDRESS.BUSD, DEX_CONTRACT.ROUTER, DEX_CONTRACT.FACTORY
            ],
            contract: "contracts/FeedVault.sol:FeedVault"
        }
    });


    try {
        const fileName = "deploy.json";
        const dir = join(__dirname, `./outputs/${NODE_ENV}`);

        if (!existsSync(dir)) {
            mkdirSync(dir, { recursive: true });
        }

        const filePath = join(dir, fileName);
        writeFileSync(filePath, JSON.stringify(output));
        await delayTime();
    } catch (error) {

    }

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});