import { ethers } from "hardhat";
import { configEnv } from "../../@config";
import { parseAmountToken } from "../../@helpers/block-chain.helper";

const { NODE_ENV = "bscTestnet", ROYALTY_ADDRESS = "" } = process.env;

const { NETWORK_PROVIDER, TOKEN_ADDRESS, DEX_CONTRACT } = configEnv();

const royaltyAddress = ROYALTY_ADDRESS.trim();
const mapRoyaltyFee = {
  ["opMainnet"]: parseAmountToken(0.00028),
  ["opBNBMainnet"]: parseAmountToken(0.0018),
  ["opBNBTestnet"]: parseAmountToken(0.0018),
  ["bscMainnet"]: parseAmountToken(0.0018),
  ["zetaTestnet"]: parseAmountToken(1),
  ["zetaMainnet"]: parseAmountToken(1),
  ["vicMainnet"]: parseAmountToken(1),
};

const royaltyFee = mapRoyaltyFee[NODE_ENV] || parseAmountToken(0.00028);

const pointsAddress =
  NODE_ENV === "blastMainnet"
    ? "0x2536FE9ab3F511540F2f9e2eC2A805005C3Dd800"
    : NODE_ENV === "blastTestnet"
    ? "0x2fc95838c71e76ec69ff817983BFf17c710F34E0"
    : ethers.constants.AddressZero;
const pointOperator = royaltyAddress;
export default {
  NODE_ENV,
  NETWORK_PROVIDER,
  TOKEN_ADDRESS,
  DEX_CONTRACT,
  royaltyAddress,
  royaltyFee,
  pointsAddress,
  pointOperator,
};
