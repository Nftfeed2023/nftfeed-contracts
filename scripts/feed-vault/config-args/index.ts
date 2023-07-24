import { BigNumber } from "ethers";
import { configEnv } from "../../@config";

const {
    NODE_ENV = "bscTestnet",
} = process.env;

const { NETWORK_PROVIDER, TOKEN_ADDRESS, DEX_CONTRACT } = configEnv();


const treasureAddress = "0xF6877dC541BD12c3A6B3AFf3B73806A6183d4a36";
const devFeeAddress = "0xC74EbC184D732a612F9A91F2eD17B46fCbF03801"
const daoAddress = "0xC74EbC184D732a612F9A91F2eD17B46fCbF03801";
const mktAddress = "0xC74EbC184D732a612F9A91F2eD17B46fCbF03801";
const sharingAddress = "0xC74EbC184D732a612F9A91F2eD17B46fCbF03801";

export default {
    NODE_ENV,
    NETWORK_PROVIDER,
    TOKEN_ADDRESS,
    DEX_CONTRACT,
    treasureAddress,
    devFeeAddress,
    daoAddress,
    mktAddress,
    sharingAddress,
}