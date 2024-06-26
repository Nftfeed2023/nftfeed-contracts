import "./env-config";
import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import { utils } from "ethers";
const { WALLET_DEPLOYER_PRIVATEKEY, SCAN_APIKEY, NODE_ENV } = process.env;
const hexWalletDeployerPrivateKey = WALLET_DEPLOYER_PRIVATEKEY.startsWith("0x")
  ? WALLET_DEPLOYER_PRIVATEKEY.trim()
  : `0x${WALLET_DEPLOYER_PRIVATEKEY}`.trim();

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const getApiKey = () => {
  if (NODE_ENV === "avaxMainnet") {
    return {
      avaxMainnet: "snowtrace",
    };
  }

  if (NODE_ENV === "zoraMainnet") {
    return {
      zoraMainnet: "zora",
    };
  }
  if (NODE_ENV === "opBNBTestnet") {
    return {
      opBNBTestnet: "8530489dc922448c9204a1f83fb6823c",
    };
  }

  if (NODE_ENV === "opBNBMainnet") {
    return {
      opBNBMainnet: "8530489dc922448c9204a1f83fb6823c",
    };
  }

  return SCAN_APIKEY;
};
const apiKey = getApiKey();

const config: HardhatUserConfig = {
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    hardhat: {},
    maticTestnet: {
      url: "https://rpc-mumbai.maticvigil.com",
      chainId: 80001,
      gasPrice: 20_000_000_000,
      accounts: [hexWalletDeployerPrivateKey],
    },
    maticMainnet: {
      url: "https://polygon-rpc.com",
      chainId: 137,
      accounts: [hexWalletDeployerPrivateKey],
    },
    bscTestnet: {
      url: "https://data-seed-prebsc-2-s1.bnbchain.org:8545",
      chainId: 97,
      gasPrice: 20000000000,
      accounts: [hexWalletDeployerPrivateKey],
    },
    bscMainnet: {
      url: "https://bsc-dataseed1.ninicoin.io",
      chainId: 56,
      gasPrice: 20000000000,
      accounts: [hexWalletDeployerPrivateKey],
    },
    baseTestnet: {
      url: "https://base-goerli.public.blastapi.io/",
      chainId: 84531,
      // gasPrice: 20000000000,
      accounts: [hexWalletDeployerPrivateKey],
    },
    baseMainnet: {
      url: "https://mainnet.base.org/",
      chainId: 8453,
      // gasPrice: 20000000000,
      accounts: [hexWalletDeployerPrivateKey],
    },
    opTestnet: {
      // url: "https://goerli.optimism.io/",
      url: "https://optimism-goerli.gateway.tenderly.co",
      chainId: 420,
      // gasPrice: 20000000000,
      accounts: [hexWalletDeployerPrivateKey],
    },
    opMainnet: {
      url: "https://mainnet.optimism.io",
      chainId: 10,
      // gasPrice: 20000000000,
      accounts: [hexWalletDeployerPrivateKey],
    },

    zksyncTestnet: {
      // url: "https://goerli.optimism.io/",
      url: "https://testnet.era.zksync.dev",
      chainId: 280,
      // gasPrice: 20000000000,
      accounts: [hexWalletDeployerPrivateKey],
    },
    zksyncMainnet: {
      url: "https://mainnet.era.zksync.io",
      chainId: 324,
      //  gasPrice: 20000000000,
      accounts: [hexWalletDeployerPrivateKey],
    },

    arbitrumTestnet: {
      // url: "https://goerli.optimism.io/",
      url: "https://arbitrum-goerli.public.blastapi.io",
      chainId: 421613,
      gasPrice: 20000000000,
      accounts: [hexWalletDeployerPrivateKey],
    },
    arbitrumMainnet: {
      url: "https://arbitrum.drpc.org",
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

    avaxMainnet: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      chainId: 43114,
      //   gasPrice: 20000000000,
      accounts: [hexWalletDeployerPrivateKey],
    },

    zoraMainnet: {
      url: "https://rpc.zora.energy",
      chainId: 7777777,
      //   gasPrice: 20000000000,
      accounts: [hexWalletDeployerPrivateKey],
    },

    opBNBMainnet: {
      url: "https://opbnb-mainnet-rpc.bnbchain.org",
      chainId: 204,
      gasPrice: 20000000000,
      accounts: [hexWalletDeployerPrivateKey],
    },

    opBNBTestnet: {
      url: "https://opbnb-testnet-rpc.bnbchain.org",
      chainId: 5611,
      gasPrice: 20000000000,
      accounts: [hexWalletDeployerPrivateKey],
    },

    lineaTestnet: {
      url: "https://rpc.goerli.linea.build",
      chainId: 59140,
      // gasPrice: 20000000000,
      accounts: [hexWalletDeployerPrivateKey],
    },

    lineaMainnet: {
      url: "https://rpc.linea.build",
      chainId: 59144,
      // gasPrice: 20000000000,
      accounts: [hexWalletDeployerPrivateKey],
    },

    ethTestnet: {
      // url: "https://goerli.optimism.io/",
      url: "https://eth-sepolia.public.blastapi.io",
      chainId: 11155111,
      // gasPrice: 20000000000,
      accounts: [hexWalletDeployerPrivateKey],
    },
    ethMainnet: {
      url: "https://ethereum.publicnode.com",
      chainId: 1,
      //   gasPrice: 20000000000,
      accounts: [hexWalletDeployerPrivateKey],
    },

    mantaMainnet: {
      url: "https://1rpc.io/manta",
      chainId: 169,
      // gasPrice: 20000000000,
      accounts: [hexWalletDeployerPrivateKey],
    },
    mantaTestnet: {
      url: "https://manta-testnet.calderachain.xyz/http",
      chainId: 3441005,
      accounts: [hexWalletDeployerPrivateKey],
    },

    zetaTestnet: {
      accounts: [hexWalletDeployerPrivateKey],
      chainId: 7001,
      gas: 5000000,
      gasPrice: 80000000000,
      url: "https://zetachain-athens-evm.blockpi.network/v1/rpc/public",
    },

    zetaMainnet: {
      url: "https://zetachain-evm.blockpi.network/v1/rpc/public",
      chainId: 7000,
      accounts: [hexWalletDeployerPrivateKey],
    },
    blastTestnet: {
      url: "https://blast-sepolia.blockpi.network/v1/rpc/public",
      chainId: 168587773,
      // gasPrice: 1000000000,
      accounts: [hexWalletDeployerPrivateKey],
    },

    blastMainnet: {
      url: "https://rpc.blast.io",
      chainId: 81457,
      // gasPrice: 1000000000,
      accounts: [hexWalletDeployerPrivateKey],
    },
    vicMainnet: {
      url: "https://rpc.viction.xyz",
      chainId: 88,
      // gasPrice: 1000000000,
      accounts: [hexWalletDeployerPrivateKey],
    },
    vicTestnet: {
      url: "https://rpc-testnet.viction.xyz",
      chainId: 89,
      // gasPrice: 1000000000,
      accounts: [hexWalletDeployerPrivateKey],
    },
    kromaMainnet: {
      url: "https://api.kroma.network",
      chainId: 255,
      accounts: [hexWalletDeployerPrivateKey],
    },
  },
  solidity: {
    compilers: [
      {
        version: "0.8.19",
        settings: {
          optimizer: {
            enabled: true,
            runs: 500,
          },
          metadata: {
            bytecodeHash: "none",
          },
        },
      },
    ],
  },

  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 20000,
  },

  gasReporter: {
    enabled: true,
    currency: "USD",
  },
  etherscan: {
    apiKey,
    customChains: [
      {
        network: "baseTestnet",
        chainId: 84531,
        urls: {
          apiURL: "https://api-goerli.basescan.org/api",
          browserURL: "https://goerli.basescan.org",
        },
      },
      {
        network: "baseMainnet",
        chainId: 8453,
        urls: {
          apiURL: "https://api.basescan.org/api",
          browserURL: "https://basescan.org",
        },
      },
      {
        network: "scrollMainnet",
        chainId: 534352,
        urls: {
          apiURL: "https://api.scrollscan.com/api",
          browserURL: "https://scrollscan.com",
        },
      },
      {
        network: "avaxMainnet",
        chainId: 43114,
        urls: {
          apiURL:
            "https://api.routescan.io/v2/network/mainnet/evm/43114/etherscan",
          browserURL: "https://avalanche.routescan.io",
        },
      },
      {
        network: "zoraMainnet",
        chainId: 7777777,
        urls: {
          apiURL:
            "https://api.routescan.io/v2/network/mainnet/evm/7777777/etherscan",
          browserURL: "https://zora.superscan.network",
        },
      },

      {
        network: "opBNBMainnet",
        chainId: 204,
        urls: {
          apiURL:
            "https://opbnb-mainnet.nodereal.io/v1/8530489dc922448c9204a1f83fb6823c",
          browserURL: "https://opbnbscan.com",
        },
      },

      {
        network: "opBNBTestnet",
        chainId: 5611,
        urls: {
          apiURL:
            "https://open-platform.nodereal.io/8530489dc922448c9204a1f83fb6823c/op-bnb-testnet/contract",
          browserURL: "https://testnet.opbnbscan.com",
        },
      },
      {
        network: "lineaMainnet",
        chainId: 59144,
        urls: {
          apiURL: "https://api.lineascan.build/api",
          browserURL: "https://lineascan.build/",
        },
      },
      {
        network: "blastTestnet",
        chainId: 168587773,
        urls: {
          apiURL:
            "https://api.routescan.io/v2/network/testnet/evm/168587773/etherscan",
          browserURL: "https://sepolia.blastscan.io",
        },
      },
      // {
      //   network: "blastMainnet",
      //   chainId: 81457,
      //   urls: {
      //     apiURL:
      //       "https://api.routescan.io/v2/network/mainnet/evm/81457/etherscan",
      //     browserURL: "https://blastexplorer.io",
      //   },
      // },
      {
        network: "blastMainnet",
        chainId: 81457,
        urls: {
          apiURL:
            "https://api.blastscan.io/api",
          browserURL: "https://blastscan.io",
        },
      },
      {
        network: "ethTestnet",
        chainId: 11155111,
        urls: {
          apiURL: "https://api-sepolia.etherscan.io/api",
          browserURL: "https://sepolia.etherscan.io",
        },
      },
      {
        network: "kromaMainnet",
        chainId: 255,
        urls: {
          apiURL: "https://api.kromascan.com/api",
          browserURL: "https://kromascan.com",
        },
      },
    ],
  },
};

export default config;
