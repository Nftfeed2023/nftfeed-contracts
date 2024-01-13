import { BigNumber } from "ethers";
import { configEnv } from "../../@config";
import { parseAmountToken } from "../../@helpers/block-chain.helper";
import { ethers } from "hardhat";


const {
    NODE_ENV = "bscTestnet",
    FEE_ADDRESS = ""
} = process.env;

const { NETWORK_PROVIDER, TOKEN_ADDRESS, DEX_CONTRACT } = configEnv();

const royaltyAddress = FEE_ADDRESS.trim();
const mapRoyaltyFee = {
    ["opMainnet"]: parseAmountToken('0.00004'),
    ["opBNBMainnet"]: parseAmountToken('0.00032'),
    ["bscMainnet"]: parseAmountToken('0.00032'),
}


const royaltyFee = mapRoyaltyFee[NODE_ENV] || parseAmountToken('0.00004');

export default {
    NODE_ENV,
    NETWORK_PROVIDER,
    TOKEN_ADDRESS,
    DEX_CONTRACT,
    royaltyAddress,
    royaltyFee,
}

