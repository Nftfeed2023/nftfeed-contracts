import "../../env-config";
import { ethers } from "hardhat";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import configArgs from "./config-args";
import { delayTime } from "../@helpers/block-chain.helper";


const { utils, getSigners, getContractFactory, provider } = ethers;
const { formatEther } = utils;

const { NODE_ENV, NETWORK_PROVIDER,
    params,
} = configArgs;


async function main() {
    const output: any = {};
    const [deployer] = await getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    const balance = await deployer.getBalance();
    console.log("Account balance:", formatEther(balance));

    console.log(`-------------------`);
    console.log({ params });
    console.log(`-------------------`);
    Object.assign(output, {
        DEPLOYER_ADDRESS: deployer.address,
    })

    const tokenFactory = await getContractFactory("StakeNftAutoApy");
    const tokenCt = await tokenFactory.deploy(
        params.tokenReward,
        params.nft,
        params.startTime,
        params.endTimeBonus,
        params.rewardPerSeconds
    );
    await tokenCt.deployed();


    console.log(`${"StakeNftAutoApy"} deployed to:`, tokenCt.address);
    const linkDeploy = `${NETWORK_PROVIDER.URL_SCAN}/address/${tokenCt.address}`.trim();
    console.log('--------linkDeploy-----------');
    console.log(linkDeploy);
    console.log('-------------------');
    Object.assign(output, {
        TOKEN_ADDRESS: tokenCt.address,
        verifyData: {
            address: tokenCt.address,
            constructorArguments: [
                params.tokenReward,
                params.nft,
                params.startTime,
                params.endTimeBonus,
                params.rewardPerSeconds
            ],
            contract: "contracts/StakeNftAutoApy.sol:StakeNftAutoApy"
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