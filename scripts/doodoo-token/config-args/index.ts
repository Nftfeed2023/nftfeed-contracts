import { BigNumber } from "ethers";
import { configEnv } from "../../@config";

const {
    NODE_ENV = "bscTestnet",
} = process.env;

const { NETWORK_PROVIDER, DEX_ROUTERS } = configEnv();




export default {
    NODE_ENV,
    NETWORK_PROVIDER,
    DEX_ROUTERS
}