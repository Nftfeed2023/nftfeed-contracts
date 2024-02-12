import { configEnv } from "../../@config";
import { parseAmountToken } from "../../@helpers/block-chain.helper";

const { NODE_ENV = "bscTestnet", ROYALTY_ADDRESS = "" } = process.env;

const { NETWORK_PROVIDER, TOKEN_ADDRESS, DEX_CONTRACT } = configEnv();

const defaultFee = parseAmountToken(0.002);
const mapCreationFee = {
  ["zetaTestnet"]: parseAmountToken(50),
  ["zetaMainnet"]: parseAmountToken(50),
};

const royaltyAddress = ROYALTY_ADDRESS.trim();
const creationFee = mapCreationFee[NODE_ENV] || defaultFee;

export default {
  NODE_ENV,
  NETWORK_PROVIDER,
  TOKEN_ADDRESS,
  DEX_CONTRACT,
  royaltyAddress,
  creationFee,
};
