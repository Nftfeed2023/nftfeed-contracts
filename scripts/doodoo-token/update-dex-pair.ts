import "../../env-config";
import { ethers } from "hardhat";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import configArgs from "./config-args";
import { delayTime, formatAmountToken } from "../@helpers/block-chain.helper";
import { Contract } from "ethers";
import { DooDooToken, DooDooToken__factory, QuestPool, QuestPool__factory } from "../../typechain";


const { utils, getSigners, getContractFactory, provider } = ethers;
const { formatEther } = utils;

const { NODE_ENV, NETWORK_PROVIDER, DEX_ROUTERS } = configArgs;



async function main() {
    const output: any = {};
    const [deployer] = await getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    const balance = await deployer.getBalance();
    console.log("Account balance:", formatEther(balance));

    const { TOKEN_ADDRESS } = require(`./outputs/${NODE_ENV}/deploy.json`);
    const tokenCt = new Contract(TOKEN_ADDRESS, DooDooToken__factory.abi, provider) as DooDooToken;
    const { transactionHash } = await (await tokenCt.connect(deployer).updateDexPair(DEX_ROUTERS)).wait();
    const txLink = `${NETWORK_PROVIDER.URL_SCAN}/tx/${transactionHash}`.trim();
    console.log('--------link TX-----------');
    console.log({
        txLink
    });
    console.log('-------------------');

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});