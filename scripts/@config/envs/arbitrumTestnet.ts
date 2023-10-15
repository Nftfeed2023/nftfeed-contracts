import { IEnvConfig } from '..';

const config: IEnvConfig = {
  TOKEN_ADDRESS: {
    WNATIVE: "".trim(),
    USDT: "".trim(),
    USDC: "".trim(),
    BUSD: "0xFDeacA5bc0E8DC0Df189F233d84578e037f908d7".trim(), // testnet = DOO DOO
    DOO_DOO: "0xFDeacA5bc0E8DC0Df189F233d84578e037f908d7".trim(),
  },
  DEX_CONTRACT: {
    FACTORY: "0x1D25b9D81623a093ffc2b02E8da1d006b16F0AD8".trim(), // Dackie Testnet
    ROUTER: "0x29843613c7211D014F5Dd5718cF32BCD314914CB".trim(), // Dackie Testnet
  },
  DEX_ROUTERS: [
    "0x29843613c7211D014F5Dd5718cF32BCD314914CB".trim(), // Dackie,
    "0xbe92671bdd1a1062E1A9F3Be618e399Fb5faCAcE".trim(), // BeagleRouter,
    //    "".trim(), // Cloud base ,
  ],
  NETWORK_PROVIDER: {
    URL_RPC: "https://arbitrum-goerli.publicnode.com",
    URL_SCAN: "https://goerli.arbiscan.io"
  }
}



export default config;
