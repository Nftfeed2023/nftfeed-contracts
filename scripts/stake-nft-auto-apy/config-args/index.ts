import { BigNumber } from "ethers";
import { configEnv } from "../../@config";
import { parseAmountToken, stringDateToUTCDate } from "../../@helpers/block-chain.helper";
import { ethers } from "hardhat";


const {
    NODE_ENV = "bscTestnet",
    ROYALTY_ADDRESS = ""
} = process.env;

const { NETWORK_PROVIDER, TOKEN_ADDRESS, DEX_CONTRACT } = configEnv();


export interface IParams {
    tokenReward: string;
    nft: string;
    startTime: number;
    endTimeBonus: number;
    rewardPerSeconds: BigNumber;
}



const { params } = require(`./params/${NODE_ENV}`) as { params: IParams };


export default {
    NODE_ENV,
    NETWORK_PROVIDER,
    TOKEN_ADDRESS,
    DEX_CONTRACT,
    params
}

