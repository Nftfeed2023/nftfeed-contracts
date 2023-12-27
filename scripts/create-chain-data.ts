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
            "name": "opBNB Mainnet",
            "icon": "bnbchain",
            "chain": "opBNB",
            "rpc": [
                "https://opbnb-mainnet-rpc.bnbchain.org",
                "https://opbnb-mainnet.nodereal.io/v1/64a9df0874fb4a93b9d0a3849de012d3",
                "wss://opbnb-mainnet.nodereal.io/ws/v1/64a9df0874fb4a93b9d0a3849de012d3",
                "https://opbnb-mainnet.nodereal.io/v1/e9a36765eb8a40b9bd12e680a1fd2bc5",
                "wss://opbnb-mainnet.nodereal.io/ws/v1/e9a36765eb8a40b9bd12e680a1fd2bc5",
                "https://opbnb.publicnode.com",
                "wss://opbnb.publicnode.com"
            ],
            "faucets": [],
            "nativeCurrency": {
                "name": "BNB Chain Native Token",
                "symbol": "BNB",
                "decimals": 18
            },
            "infoURL": "https://opbnb.bnbchain.org/en",
            "shortName": "obnb",
            "chainId": 204,
            "networkId": 204,
            "slip44": 714,
            "explorers": [
                {
                    "name": "opbnbscan",
                    "url": "https://mainnet.opbnbscan.com",
                    "standard": "EIP3091"
                }
            ]
        },
        {
            "name": "opBNB Testnet",
            "chain": "opBNB",
            "icon": "bnbchain",
            "rpc": [
                "https://opbnb-testnet-rpc.bnbchain.org",
                "https://opbnb-testnet.nodereal.io/v1/64a9df0874fb4a93b9d0a3849de012d3",
                "wss://opbnb-testnet.nodereal.io/ws/v1/64a9df0874fb4a93b9d0a3849de012d3",
                "https://opbnb-testnet.nodereal.io/v1/e9a36765eb8a40b9bd12e680a1fd2bc5",
                "wss://opbnb-testnet.nodereal.io/ws/v1/e9a36765eb8a40b9bd12e680a1fd2bc5"
            ],
            "faucets": [
                "https://testnet.bnbchain.org/faucet-smart"
            ],
            "nativeCurrency": {
                "name": "BNB Chain Native Token",
                "symbol": "tBNB",
                "decimals": 18
            },
            "infoURL": "https://opbnb.bnbchain.org/en",
            "shortName": "obnbt",
            "chainId": 5611,
            "networkId": 5611,
            "slip44": 1,
            "explorers": [
                {
                    "name": "bscscan-opbnb-testnet",
                    "url": "https://opbnb-testnet.bscscan.com",
                    "standard": "EIP3091"
                },
                {
                    "name": "opbnbscan",
                    "url": "https://opbnbscan.com",
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