import { IEnvConfig } from "..";

const config: IEnvConfig = {
  TOKEN_ADDRESS: {
    WNATIVE: "".trim(),
    USDT: "".trim(),
    USDC: "".trim(),
    BUSD: "".trim(), // testnet = DOO DOO
    DOO_DOO: "".trim(),
  },
  DEX_CONTRACT: {
    FACTORY: "".trim(), // Dackie Testnet
    ROUTER: "".trim(), // Dackie Testnet
  },
  DEX_ROUTERS: [
    "".trim(), // Dackie,
    "".trim(), // BeagleRouter,
    //    "".trim(), // Cloud base ,
  ],
  NETWORK_PROVIDER: {
    URL_RPC: "https://rpc-testnet.viction.xyz",
    URL_SCAN: "https://testnet.vicscan.xyz",
  },
};

export default config;
