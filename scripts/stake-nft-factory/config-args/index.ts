import { BigNumber } from "ethers";
import { configEnv } from "../../@config";
import { parseAmountToken, stringDateToUTCDate } from "../../@helpers/block-chain.helper";
import { ethers } from "hardhat";


const {
    NODE_ENV = "bscTestnet",
    ROYALTY_ADDRESS = ""
} = process.env;

const { NETWORK_PROVIDER, TOKEN_ADDRESS, DEX_CONTRACT } = configEnv();


const params = {
    nftAddress: "0xf80A719F127A86C845F12d6aC5E70011351B0385",
    nftPrice: parseAmountToken("0.0007"),
    daysLocked: 30,
    bonusOneNft: parseAmountToken("0.0054"),
    startTime: Math.floor(stringDateToUTCDate("2023/07/28 00:00:00").getTime() / 1000),
    endTime: Math.floor(stringDateToUTCDate("2023/09/30 00:00:00").getTime() / 1000),
}



// 86400 số giây của 1 ngày 
const rewardPerSecond = params.bonusOneNft.div(BigNumber.from(params.daysLocked).mul(86400))



export default {
    NODE_ENV,
    NETWORK_PROVIDER,
    TOKEN_ADDRESS,
    DEX_CONTRACT,
    ...params,
    rewardPerSecond
}

