import { configEnv } from "../../@config";
import { parseAmountToken } from "../../@helpers/block-chain.helper";

const { NODE_ENV = "bscTestnet", ROYALTY_ADDRESS = "" } = process.env;
const { NETWORK_PROVIDER, TOKEN_ADDRESS, DEX_CONTRACT } = configEnv();
const royaltyAddress = ROYALTY_ADDRESS.trim();

const feeDefault = {
  crawlFee: parseAmountToken("0.00025"),
  mintFee: parseAmountToken("0.00025"),
};

const mapCrawlFee = {
  ["opBNBMainnet"]: parseAmountToken("0.002"),
  ["bscMainnet"]: parseAmountToken("0.0020"),
  ["maticMainnet"]: parseAmountToken("1"),
};

const mapMintFee = {
  ["opBNBMainnet"]: parseAmountToken("0.001"),
  ["bscMainnet"]: parseAmountToken("0.001"),
  ["maticMainnet"]: parseAmountToken("1"),
};

const mintFee = mapMintFee[NODE_ENV] || feeDefault.mintFee;
const crawlFee = mapCrawlFee[NODE_ENV] || feeDefault.crawlFee;

// 70%
const percentShareCrawler = 70 * 100;

export default {
  NODE_ENV,
  NETWORK_PROVIDER,
  TOKEN_ADDRESS,
  DEX_CONTRACT,
  royaltyAddress,
  crawlFee,
  mintFee,
  percentShareCrawler,
};
