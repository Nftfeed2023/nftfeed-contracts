
import "./env-config";
import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import { utils } from "ethers";
const { WALLET_DEPLOYER_PRIVATEKEY, SCAN_APIKEY } = process.env;
const hexWalletDeployerPrivateKey = WALLET_DEPLOYER_PRIVATEKEY.startsWith("0x") ? WALLET_DEPLOYER_PRIVATEKEY.trim() : `0x${WALLET_DEPLOYER_PRIVATEKEY}`.trim();

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    hardhat: {
    },
    maticTestnet: {
      url: "https://rpc-mumbai.maticvigil.com",
      chainId: 80001,
      gasPrice: 20_000_000_000,
      accounts: [hexWalletDeployerPrivateKey]
    },
    maticMainnet: {
      url: "https://matic-mainnet-full-rpc.bwarelabs.com/",
      chainId: 137,
      accounts: [hexWalletDeployerPrivateKey],
    },
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s2.binance.org:8545/",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: [hexWalletDeployerPrivateKey]
    },
    bscMainnet: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      gasPrice: 20000000000,
      accounts: [hexWalletDeployerPrivateKey]
    },
    baseTestnet: {
      url: "https://base-goerli.public.blastapi.io/",
      chainId: 84531,
      gasPrice: 20000000000,
      accounts: [hexWalletDeployerPrivateKey],
    },
    baseMainnet: {
      url: "https://mainnet.base.org/",
      chainId: 8453,
      gasPrice: 20000000000,
      accounts: [hexWalletDeployerPrivateKey],
    },
    opTestnet: {
      // url: "https://goerli.optimism.io/",
      url: "https://optimism-goerli.public.blastapi.io/",
      chainId: 420,
      gasPrice: 20000000000,
      accounts: [hexWalletDeployerPrivateKey],
    },
    opMainnet: {
      url: "https://mainnet.optimism.io/",
      chainId: 10,
      gasPrice: 20000000000,
      accounts: [hexWalletDeployerPrivateKey],
    },
    zetaTestnet: {
      accounts: [hexWalletDeployerPrivateKey],
      chainId: 7001,
      gas: 5000000,
      gasPrice: 80000000000,
      url: 'https://zetachain-athens-evm.blockpi.network/v1/rpc/public'
    },

    zksyncTestnet: {
      // url: "https://goerli.optimism.io/",
      url: "https://testnet.era.zksync.dev",
      chainId: 280,
      gasPrice: 20000000000,
      accounts: [hexWalletDeployerPrivateKey],
    },
    zksyncMainnet: {
      url: "https://mainnet.era.zksync.io",
      chainId: 324,
      gasPrice: 20000000000,
      accounts: [hexWalletDeployerPrivateKey],
    },



    arbitrumTestnet: {
      // url: "https://goerli.optimism.io/",
      url: "https://arbitrum-goerli.publicnode.com",
      chainId: 421613,
      gasPrice: 20000000000,
      accounts: [hexWalletDeployerPrivateKey],
    },
    arbitrumMainnet: {
      url: "https://arbitrum.llamarpc.com",
      chainId: 42161,
      //   gasPrice: 20000000000,
      accounts: [hexWalletDeployerPrivateKey],
    },


    scrollTestnet: {
      // url: "https://goerli.optimism.io/",
      url: "https://sepolia-rpc.scroll.io",
      chainId: 534351,
      gasPrice: 20000000000,
      accounts: [hexWalletDeployerPrivateKey],
    },
    scrollMainnet: {
      url: "https://scroll-mainnet.chainstacklabs.com",
      chainId: 534352,
      //   gasPrice: 20000000000,
      accounts: [hexWalletDeployerPrivateKey],
    },


  },
  solidity: {
    compilers: [
      {
        version: '0.8.19',
        settings: {
          optimizer: {
            enabled: true,
            runs: 500,
          },
          metadata: {
            bytecodeHash: 'none',
          },
        },
      },
    ],
  },

  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 20000
  },

  gasReporter: {
    enabled: true,
    currency: "USD",
  },
  etherscan: {
    apiKey: SCAN_APIKEY,
    customChains: [
      {
        network: "baseTestnet",
        chainId: 84531,
        urls: {
          apiURL: "https://api-goerli.basescan.org/api",
          browserURL: "https://goerli.basescan.org"
        }
      },
      {
        network: "baseMainnet",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org"
        }
      },
      {
        network: "scrollMainnet",
        chainId: 534352,
        urls: {
          apiURL: "https://api.scrollscan.com/api",
          browserURL: "https://scrollscan.com"
        }
      }
    ]
  },
};

export default config;
