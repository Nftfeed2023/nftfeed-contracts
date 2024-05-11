import { BigNumber } from "ethers";
import { configEnv } from "../../@config";
import { parseAmountToken } from "../../@helpers/block-chain.helper";

const {
    NODE_ENV = "bscTestnet",
} = process.env;

const { NETWORK_PROVIDER } = configEnv();

const tokenC98 = "0xeE63687645ce6aaE47e6D20Db2b9FD089D2bdf4c";
const tokenCUSD = "0xE2d9d45921BCfCCf0894B1D532b3F6Afe591F748";
const amountC98 = parseAmountToken(1000);
const amountCUSD = parseAmountToken(1000, 6);
const amountVIC = parseAmountToken(15);
const hoursNextClaim = 12; // 12 gio

export default {
    NODE_ENV,
    NETWORK_PROVIDER,
    tokenC98,
    tokenCUSD,
    amountC98,
    amountCUSD,
    amountVIC,
    hoursNextClaim,
}