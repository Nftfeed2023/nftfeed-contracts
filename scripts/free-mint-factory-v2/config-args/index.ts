import { BigNumber } from "ethers";
import { configEnv } from "../../@config";
import { parseAmountToken } from "../../@helpers/block-chain.helper";
import { ethers } from "hardhat";


const {
    NODE_ENV = "bscTestnet",
    ROYALTY_ADDRESS = ""
} = process.env;

const { NETWORK_PROVIDER, TOKEN_ADDRESS, DEX_CONTRACT } = configEnv();

const royaltyAddress = ROYALTY_ADDRESS.trim();
const mapRoyaltyFee = {
    ["opMainnet"]: parseAmountToken(0.00069),
    ["opBNBMainnet"]: parseAmountToken(0.0033),
    ["opBNBTestnet"]: parseAmountToken(0.0033),
    ["bscMainnet"]: parseAmountToken(0.0033),
}


const royaltyFee = mapRoyaltyFee[NODE_ENV] || parseAmountToken(0.00069);

export default {
    NODE_ENV,
    NETWORK_PROVIDER,
    TOKEN_ADDRESS,
    DEX_CONTRACT,
    royaltyAddress,
    royaltyFee,
}

