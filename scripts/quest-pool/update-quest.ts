import "../../env-config";
import { ethers } from "hardhat";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import configArgs from "./config-args";
import { delayTime, formatAmountToken } from "../@helpers/block-chain.helper";
import { Contract } from "ethers";
import { QuestPool, QuestPool__factory } from "../../typechain";


const { utils, getSigners, getContractFactory, provider } = ethers;
const { formatEther } = utils;

const { NODE_ENV, NETWORK_PROVIDER, TOKEN_ADDRESS, DEX_CONTRACT, QUESTS } = configArgs;



async function main() {
    const output: any = {};
    const [deployer] = await getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    const balance = await deployer.getBalance();
    console.log("Account balance:", formatEther(balance));

    const { TOKEN_ADDRESS: POOL_ADDRESS } = require(`./outputs/${NODE_ENV}/deploy.json`);

    const poolCt = new Contract(POOL_ADDRESS, QuestPool__factory.abi, provider) as QuestPool;

    for (const { id: questId, amount, name } of QUESTS) {
        try {
            const { transactionHash } = await (await poolCt.connect(deployer).setAmountBonus(questId, amount)).wait();
            const txLink = `${NETWORK_PROVIDER.URL_SCAN}/tx/${transactionHash}`.trim();
            console.log('--------link TX-----------');
            console.log({
                questId,
                name,
                amount: formatAmountToken(amount),
                txLink
            });
            console.log('-------------------');
        } catch (error) {

        }
    }

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});