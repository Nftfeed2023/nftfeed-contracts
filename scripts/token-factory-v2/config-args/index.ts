import { BigNumber } from "ethers";
import { configEnv } from "../../@config";
import { parseAmountToken } from "../../@helpers/block-chain.helper";
import { ethers } from "hardhat";

const { NODE_ENV = "bscTestnet", ROYALTY_ADDRESS = "" } = process.env;

const { NETWORK_PROVIDER, TOKEN_ADDRESS, DEX_CONTRACT } = configEnv();

const defaultFee = parseAmountToken(0.02); // value to native token ETH
const mapCreationFee = {
  ["zetaTestnet"]: parseAmountToken(50),
  ["zetaMainnet"]: parseAmountToken(50),
  ["bscTestnet"]: parseAmountToken(0.16),
  ["bscMainnet"]: parseAmountToken(0.16),
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
