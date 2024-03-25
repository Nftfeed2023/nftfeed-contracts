import "../env-config";
import { ethers } from "hardhat";

import { configEnv } from "./@config";
import { BigNumber, Contract } from "ethers";
import {
  connectWallet,
  provider,
  sendMultipleNativeToken,
  sendMultipleToken,
} from "./@helpers/tools.helper";
import {
  dateStrToSeconds,
  delayTime,
  parseAmountToken,
  stringDateToUTCDate,
} from "./@helpers/block-chain.helper";
import {
  BatchTransferTool,
  BatchTransferTool__factory,
  ERC1155__factory,
  ERC20,
  ERC20__factory,
  ERC721,
  ERC721Enumerable,
  ERC721Enumerable__factory,
  ERC721Template,
  ERC721Template__factory,
  ERC721__factory,
  FeedVault,
  FeedVault__factory,
  MintNftFactory,
  MintNftFactoryV2,
  MintNftFactoryV2__factory,
  MintNftFactory__factory,
  StakeMultipleERC721,
  StakeMultipleERC721__factory,
  StakeNftAutoApy,
  StakeNftAutoApy__factory,
  StakeNftFactory,
  StakeNftFactory__factory,
  TokenERC721,
  TokenERC721__factory,
} from "../typechain";
import { dir } from "console";
import { writeFileSync } from "fs";
import { join } from "path";
import { isAddress } from "ethers/lib/utils";
import axios from "axios";

const { utils, constants, getSigners, getContractFactory } = ethers;
const { formatEther } = utils;
const { MaxUint256, Zero, AddressZero, HashZero } = constants;
const { NODE_ENV = "bscTestnet" } = process.env;

const { TOKEN_ADDRESS, NETWORK_PROVIDER } = configEnv();
const { URL_SCAN } = NETWORK_PROVIDER;

const chainItemExample = {
  name: "Ethereum Mainnet",
  chain: "ETH",
  icon: "ethereum",
  rpc: [
    "https://mainnet.infura.io/v3/${INFURA_API_KEY}",
    "wss://mainnet.infura.io/ws/v3/${INFURA_API_KEY}",
    "https://api.mycryptoapi.com/eth",
    "https://cloudflare-eth.com",
    "https://ethereum.publicnode.com",
    "wss://ethereum.publicnode.com",
    "https://mainnet.gateway.tenderly.co",
    "wss://mainnet.gateway.tenderly.co",
    "https://rpc.blocknative.com/boost",
    "https://rpc.flashbots.net",
    "https://rpc.flashbots.net/fast",
    "https://rpc.mevblocker.io",
    "https://rpc.mevblocker.io/fast",
    "https://rpc.mevblocker.io/noreverts",
    "https://rpc.mevblocker.io/fullprivacy",
  ],
  features: [
    {
      name: "EIP155",
    },
    {
      name: "EIP1559",
    },
  ],
  faucets: [],
  nativeCurrency: {
    name: "Ether",
    symbol: "ETH",
    decimals: 18,
  },
  infoURL: "https://ethereum.org",
  shortName: "eth",
  chainId: 1,
  networkId: 1,
  slip44: 60,
  ens: {
    registry: "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e",
  },
  explorers: [
    {
      name: "etherscan",
      url: "https://etherscan.io",
      standard: "EIP3091",
    },
    {
      name: "blockscout",
      url: "https://eth.blockscout.com",
      icon: "blockscout",
      standard: "EIP3091",
    },
    {
      name: "dexguru",
      url: "https://ethereum.dex.guru",
      icon: "dexguru",
      standard: "EIP3091",
    },
  ],
};
type ChainItem = typeof chainItemExample;
async function main() {
  const callApi = async () => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: "https://chainid.network/chains.json",
      headers: {},
    } as any;

    const data = await axios.request(config).then((response) => {
      return response.data;
    });
    return data as ChainItem[];
  };
  interface IEvm {
    chainId: number;
    chainName: string;
    nativeCurrency: NativeCurrency;
    rpcUrls: string[];
    blockExplorerUrls: string[];
    iconUrls: string[];
    logo: string;
  }

  interface NativeCurrency {
    name: string;
    symbol: string;
    decimals: number;
  }

  const allChain = await callApi();

  const chainsFilter = [
    {
      chainId: 255,
      chainName: "kromaMainnet",
    },
  ];
  const chainIds = chainsFilter.map((item) => item.chainId);
  const data = allChain.filter((v) => chainIds.includes(v.chainId));

  const outputs = data.map((v) => {
    return {
      chainId: v.chainId,
      chainName: v.name,
      nativeCurrency: v.nativeCurrency,
      rpcUrls: v.rpc,
      blockExplorerUrls: v.explorers.map((t) => t.url),
      iconUrls: [],
      logo: "",
    } as IEvm;
  });

  const mapChains = outputs.byMap(["chainId"]);

  console.log(`-------------------`);
  console.log(mapChains);
  console.log(`-------------------`);

  const hardhatConfig = chainsFilter.reduce((result, item) => {
    const { chainId, chainName } = item;
    const { rpcUrls } = mapChains[`${chainId}`];
    const randIdx = Math.floor(Math.random() * 50) % rpcUrls.length;
    console.log(`-------------------`);
    console.log({ randIdx });
    console.log(`-------------------`);
    const url = rpcUrls[randIdx];

    return {
      ...result,
      [chainName]: {
        url,
        chainId,
        // gasPrice: 20000000000,
        accounts: "[hexWalletDeployerPrivateKey]",
      },
    };
  }, {});

  const networkProvider = chainsFilter.reduce((result, item) => {
    const { chainId, chainName } = item;

    return {
      ...result,
      [chainName]: {
        NETWORK_PROVIDER: {
          URL_RPC: mapChains[`${chainId}`].rpcUrls[0],
          URL_SCAN: mapChains[`${chainId}`].blockExplorerUrls[0],
        },
      },
    };
  }, {});

  console.log(`-------------------`);
  console.log(hardhatConfig);
  console.log(`-------------------`);

  console.log(`-------------------`);
  console.log(networkProvider);
  console.log(`-------------------`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// [1,2,3,4,5,6,7,8,9,10]
