import "../env-config";
import { ethers } from "hardhat";

import { configEnv } from "./@config";
import { BigNumber, Contract } from "ethers";
import { connectWallet, provider, sendMultipleNativeToken, sendMultipleToken } from "./@helpers/tools.helper";
import { dateStrToSeconds, delayTime, parseAmountToken, stringDateToUTCDate } from "./@helpers/block-chain.helper";
import { BatchTransferTool, BatchTransferTool__factory, ERC1155__factory, ERC20, ERC20__factory, ERC721, ERC721Enumerable, ERC721Enumerable__factory, ERC721Template, ERC721Template__factory, ERC721__factory, FeedVault, FeedVault__factory, MintNftFactory, MintNftFactoryV2, MintNftFactoryV2__factory, MintNftFactory__factory, StakeMultipleERC721, StakeMultipleERC721__factory, StakeNftAutoApy, StakeNftAutoApy__factory, StakeNftFactory, StakeNftFactory__factory, TokenERC721, TokenERC721__factory } from "../typechain";
import { dir } from "console";
import { writeFileSync } from "fs";
import { join } from "path";
import { isAddress } from "ethers/lib/utils";

const { utils, constants, getSigners, getContractFactory } = ethers;
const { formatEther } = utils;
const { MaxUint256, Zero, AddressZero, HashZero } = constants;
const {
    NODE_ENV = "bscTestnet",
} = process.env;


const { TOKEN_ADDRESS, NETWORK_PROVIDER } = configEnv();
const { URL_SCAN } = NETWORK_PROVIDER;


async function main() {

    interface IEvm {
        chainId: number
        chainName: string
        nativeCurrency: NativeCurrency
        rpcUrls: string[]
        blockExplorerUrls: string[]
        iconUrls: string[]
        logo: string
    }


    interface NativeCurrency {
        name: string
        symbol: string
        decimals: number
    }
    const data = [
        {
            "name": "Arbitrum One",
            "chainId": 42161,
            "shortName": "arb1",
            "chain": "ETH",
            "networkId": 42161,
            "nativeCurrency": {
                "name": "Ether",
                "symbol": "ETH",
                "decimals": 18
            },
            "rpc": [
                "https://arbitrum-mainnet.infura.io/v3/${INFURA_API_KEY}",
                "https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}",
                "https://arb1.arbitrum.io/rpc",
                "https://arbitrum-one.publicnode.com",
                "wss://arbitrum-one.publicnode.com"
            ],
            "faucets": [],
            "explorers": [
                {
                    "name": "Arbiscan",
                    "url": "https://arbiscan.io",
                    "standard": "EIP3091"
                },
                {
                    "name": "Arbitrum Explorer",
                    "url": "https://explorer.arbitrum.io",
                    "standard": "EIP3091"
                },
                {
                    "name": "dexguru",
                    "url": "https://arbitrum.dex.guru",
                    "icon": "dexguru",
                    "standard": "EIP3091"
                }
            ],
            "infoURL": "https://arbitrum.io",
            "parent": {
                "type": "L2",
                "chain": "eip155-1",
                "bridges": [
                    {
                        "url": "https://bridge.arbitrum.io"
                    }
                ]
            }
        },
        {
            "name": "Arbitrum Goerli",
            "title": "Arbitrum Goerli Rollup Testnet",
            "chainId": 421613,
            "shortName": "arb-goerli",
            "chain": "ETH",
            "networkId": 421613,
            "nativeCurrency": {
                "name": "Arbitrum Goerli Ether",
                "symbol": "AGOR",
                "decimals": 18
            },
            "rpc": [
                "https://goerli-rollup.arbitrum.io/rpc",
                "https://arbitrum-goerli.publicnode.com",
                "wss://arbitrum-goerli.publicnode.com"
            ],
            "faucets": [],
            "infoURL": "https://arbitrum.io/",
            "explorers": [
                {
                    "name": "Arbitrum Goerli Arbiscan",
                    "url": "https://goerli.arbiscan.io",
                    "standard": "EIP3091"
                }
            ],
            "parent": {
                "type": "L2",
                "chain": "eip155-5",
                "bridges": [
                    {
                        "url": "https://bridge.arbitrum.io/"
                    }
                ]
            }
        },
    ]

    const outputs = data.map(v => {
        return {
            chainId: v.chainId,
            chainName: v.name,
            nativeCurrency: v.nativeCurrency,
            rpcUrls: v.rpc,
            blockExplorerUrls: v.explorers.map(t => t.url),
            iconUrls: [],
            logo: ""
        } as IEvm
    })


    console.log(`-------------------`);
    console.log(outputs.byMap(["chainId"]));
    console.log(`-------------------`);







}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

// [1,2,3,4,5,6,7,8,9,10]