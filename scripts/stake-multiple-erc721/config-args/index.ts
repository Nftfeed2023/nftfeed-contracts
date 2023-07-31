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
    nftAddress: string,
    daysLocked: number,
    startTime: number,
    endTime: number,
}



// 86400 số giây của 1 ngày 

const bonusOneNft = parseAmountToken("0.0054");
const nftPrice = parseAmountToken("0.0007");

const { params } = require(`./params/${NODE_ENV}`);

const inputPools = (params as IParams[]).map(item => {
    const rewardPerSecond = bonusOneNft.div(BigNumber.from(item.daysLocked).mul(86400))
    return {
        ...item,
        rewardPerSecond
    }
})





export default {
    NODE_ENV,
    NETWORK_PROVIDER,
    TOKEN_ADDRESS,
    DEX_CONTRACT,
    nftPrice,
    inputPools,
}

