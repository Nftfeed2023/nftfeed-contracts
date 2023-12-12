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
            "name": "Zora",
            "chain": "ETH",
            "rpc": [
                "https://rpc.zora.energy/"
            ],
            "faucets": [],
            "nativeCurrency": {
                "name": "Ether",
                "symbol": "ETH",
                "decimals": 18
            },
            "icon": "zora",
            "infoURL": "https://zora.energy",
            "shortName": "zora",
            "chainId": 7777777,
            "networkId": 7777777,
            "explorers": [
                {
                    "name": "Zora Network Explorer",
                    "url": "https://explorer.zora.energy",
                    "standard": "EIP3091"
                }
            ]
        },
        {
            "name": "Avalanche C-Chain",
            "chain": "AVAX",
            "icon": "avax",
            "rpc": [
                "https://api.avax.network/ext/bc/C/rpc",
                "https://avalanche-c-chain.publicnode.com",
                "wss://avalanche-c-chain.publicnode.com"
            ],
            "features": [
                {
                    "name": "EIP1559"
                }
            ],
            "faucets": [],
            "nativeCurrency": {
                "name": "Avalanche",
                "symbol": "AVAX",
                "decimals": 18
            },
            "infoURL": "https://www.avax.network/",
            "shortName": "avax",
            "chainId": 43114,
            "networkId": 43114,
            "slip44": 9005,
            "explorers": [
                {
                    "name": "snowtrace",
                    "url": "https://snowtrace.io",
                    "standard": "EIP3091"
                }
            ]
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