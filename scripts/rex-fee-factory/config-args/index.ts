import { BigNumber } from "ethers";
import { configEnv } from "../../@config";
import { parseAmountToken } from "../../@helpers/block-chain.helper";
import { ethers } from "hardhat";


const {
    NODE_ENV = "bscTestnet",
    REX_ROYALTY_ADDRESS = ""
} = process.env;

const { NETWORK_PROVIDER, TOKEN_ADDRESS, DEX_CONTRACT } = configEnv();

const royaltyAddress = REX_ROYALTY_ADDRESS.trim();
const mapRoyaltyFee = {
    ["opMainnet"]: parseAmountToken('0.0000069'),
    ["opBNBMainnet"]: parseAmountToken('0.000033'),
    ["opBNBTestnet"]: parseAmountToken('0.000033'),
    ["bscTestnet"]: parseAmountToken('0.000033'),
    ["bscMainnet"]: parseAmountToken('0.000033'),
}


const royaltyFee = mapRoyaltyFee[NODE_ENV] || parseAmountToken('0.0000069');

export default {
    NODE_ENV,
    NETWORK_PROVIDER,
    TOKEN_ADDRESS,
    DEX_CONTRACT,
    royaltyAddress,
    royaltyFee,
}

