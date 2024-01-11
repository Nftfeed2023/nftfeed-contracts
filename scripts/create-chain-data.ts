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
            "name": "Ethereum Mainnet",
            "chain": "ETH",
            "icon": "ethereum",
            "rpc": [
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
                "https://rpc.mevblocker.io/fullprivacy"
            ],
            "features": [
                {
                    "name": "EIP155"
                },
                {
                    "name": "EIP1559"
                }
            ],
            "faucets": [],
            "nativeCurrency": {
                "name": "Ether",
                "symbol": "ETH",
                "decimals": 18
            },
            "infoURL": "https://ethereum.org",
            "shortName": "eth",
            "chainId": 1,
            "networkId": 1,
            "slip44": 60,
            "ens": {
                "registry": "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"
            },
            "explorers": [
                {
                    "name": "etherscan",
                    "url": "https://etherscan.io",
                    "standard": "EIP3091"
                },
                {
                    "name": "blockscout",
                    "url": "https://eth.blockscout.com",
                    "icon": "blockscout",
                    "standard": "EIP3091"
                },
                {
                    "name": "dexguru",
                    "url": "https://ethereum.dex.guru",
                    "icon": "dexguru",
                    "standard": "EIP3091"
                }
            ]
        },
        {
            "name": "Goerli",
            "title": "Ethereum Testnet Goerli",
            "chain": "ETH",
            "rpc": [
                "https://goerli.infura.io/v3/${INFURA_API_KEY}",
                "wss://goerli.infura.io/v3/${INFURA_API_KEY}",
                "https://rpc.goerli.mudit.blog/",
                "https://ethereum-goerli.publicnode.com",
                "wss://ethereum-goerli.publicnode.com",
                "https://goerli.gateway.tenderly.co",
                "wss://goerli.gateway.tenderly.co"
            ],
            "faucets": [
                "http://fauceth.komputing.org?chain=5&address=${ADDRESS}",
                "https://goerli-faucet.slock.it?address=${ADDRESS}",
                "https://faucet.goerli.mudit.blog"
            ],
            "nativeCurrency": {
                "name": "Goerli Ether",
                "symbol": "ETH",
                "decimals": 18
            },
            "infoURL": "https://goerli.net/#about",
            "shortName": "gor",
            "chainId": 5,
            "networkId": 5,
            "slip44": 1,
            "ens": {
                "registry": "0x112234455c3a32fd11230c42e7bccd4a84e02010"
            },
            "explorers": [
                {
                    "name": "etherscan-goerli",
                    "url": "https://goerli.etherscan.io",
                    "standard": "EIP3091"
                },
                {
                    "name": "blockscout-goerli",
                    "url": "https://eth-goerli.blockscout.com",
                    "icon": "blockscout",
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