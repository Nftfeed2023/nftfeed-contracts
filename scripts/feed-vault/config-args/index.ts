import { BigNumber } from "ethers";
import { configEnv } from "../../@config";

const {
    NODE_ENV = "bscTestnet",
} = process.env;

const { NETWORK_PROVIDER, TOKEN_ADDRESS, DEX_CONTRACT } = configEnv();

export default {
    NODE_ENV,
    NETWORK_PROVIDER,
    TOKEN_ADDRESS,
    DEX_CONTRACT
}