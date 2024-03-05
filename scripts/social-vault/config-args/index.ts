import { BigNumber } from "ethers";
import { configEnv } from "../../@config";
import { parseAmountToken } from "../../@helpers/block-chain.helper";
import { ethers } from "hardhat";

const {
  NODE_ENV = "bscTestnet",
  ROYALTY_ADDRESS = "",
  SOCIAL_SYSTEM_ADDRESS = "",
} = process.env;

const { NETWORK_PROVIDER, TOKEN_ADDRESS, DEX_CONTRACT } = configEnv();

const defaultFee = parseAmountToken(0.00055); // value to native token ETH
const mapCreationFee = {
  ["avaxMainnet"]: parseAmountToken(0.05),
};

const royaltyAddress = ROYALTY_ADDRESS.trim();
const creationFee = mapCreationFee[NODE_ENV] || defaultFee;
const minAmountClaim = parseAmountToken(10, 6);
const systemAddress = SOCIAL_SYSTEM_ADDRESS.trim();

export default {
  NODE_ENV,
  NETWORK_PROVIDER,
  TOKEN_ADDRESS,
  DEX_CONTRACT,
  royaltyAddress,
  creationFee,
  minAmountClaim,
  systemAddress,
};
