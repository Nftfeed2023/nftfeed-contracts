import "../env-config";
import { ethers } from "hardhat";

import { configEnv } from "./@config";
import { BigNumber, Contract } from "ethers";
import { provider, sendMultipleNativeToken, sendMultipleToken } from "./@helpers/tools.helper";
import { dateStrToSeconds, delayTime, parseAmountToken, stringDateToUTCDate } from "./@helpers/block-chain.helper";
import { ERC1155__factory, ERC20, ERC20__factory, ERC721, ERC721Enumerable, ERC721Enumerable__factory, ERC721__factory, FeedVault, FeedVault__factory, MintNftFactory, MintNftFactory__factory, StakeNftAutoApy, StakeNftAutoApy__factory, StakeNftFactory, StakeNftFactory__factory, TokenERC721, TokenERC721__factory } from "../typechain";
import { dir } from "console";
import { writeFileSync } from "fs";
import { join } from "path";

const { utils, constants, getSigners, getContractFactory } = ethers;
const { formatEther } = utils;
const { MaxUint256, Zero, AddressZero, HashZero } = constants;
const {
    NODE_ENV = "bscTestnet",
} = process.env;


const { TOKEN_ADDRESS, NETWORK_PROVIDER } = configEnv();
const { URL_SCAN } = NETWORK_PROVIDER;


async function main() {

    const output: any = {};
    const [deployer] = await getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
    const balance = await deployer.getBalance();
    console.log("Account balance:", formatEther(balance));
    const STAKE_NFT_AUTO_APY = "0x32Ef943Ea2Da78139d138EcBa4b74974a3CA8592".trim();

    const poolCt = new Contract(STAKE_NFT_AUTO_APY, StakeNftAutoApy__factory.abi, provider) as StakeNftAutoApy;
    const totalReward = parseAmountToken(1000_000);
    const startTime = Math.floor(stringDateToUTCDate("2023/08/20 07:10:00").getTime() / 1000);
    const endTimeBonus = Math.floor(stringDateToUTCDate("2023/10/20 07:10:00").getTime() / 1000);
    const rewardPerSeconds = totalReward.div(BigNumber.from(endTimeBonus).sub(BigNumber.from(startTime)));
    {
        const { transactionHash } = await (await poolCt.connect(deployer).updateTimeActive(
            startTime,
            endTimeBonus
        )).wait();
    }

    const { transactionHash } = await (await poolCt.connect(deployer).updateRewardPerSeconds(
        rewardPerSeconds
    )).wait();


    console.log(`-------------------`);
    console.log(transactionHash);
    console.log(`-------------------`);



}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

// [1,2,3,4,5,6,7,8,9,10]