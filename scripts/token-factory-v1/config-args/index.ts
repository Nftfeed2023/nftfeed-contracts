import { BigNumber } from "ethers";
import { configEnv } from "../../@config";
import { parseAmountToken } from "../../@helpers/block-chain.helper";
import { ethers } from "hardhat";


const {
    NODE_ENV = "bscTestnet",
    ROYALTY_ADDRESS = ""
} = process.env;

const { NETWORK_PROVIDER, TOKEN_ADDRESS, DEX_CONTRACT } = configEnv();


const defaultFee = parseAmountToken(0.002)
const mapRoyaltyFee = {
    ["zetaMainnet"]: parseAmountToken(10),
}

const royaltyAddress = ROYALTY_ADDRESS.trim();
const royaltyFee = mapRoyaltyFee[NODE_ENV] || defaultFee;

export default {
    NODE_ENV,
    NETWORK_PROVIDER,
    TOKEN_ADDRESS,
    DEX_CONTRACT,
    royaltyAddress,
    royaltyFee,
}
