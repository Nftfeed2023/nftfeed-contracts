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

const mapCreationFee = {
    ["zetaTestnet"]: parseAmountToken(100),
    ["zetaMainnet"]: parseAmountToken(100),
}

const royaltyAddress = ROYALTY_ADDRESS.trim();
const creationFee = mapCreationFee[NODE_ENV] || defaultFee;

const percentFeeRaised = 5 * 100; //5%
const percentRefund = 10 * 100; // 10%

export default {
    NODE_ENV,
    NETWORK_PROVIDER,
    TOKEN_ADDRESS,
    DEX_CONTRACT,
    royaltyAddress,
    creationFee,
    percentFeeRaised,
    percentRefund,
}

