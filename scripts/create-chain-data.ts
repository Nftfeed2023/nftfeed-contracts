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
            "name": "Linea Testnet",
            "title": "Linea Goerli Testnet",
            "chain": "ETH",
            "rpc": [
                "https://rpc.goerli.linea.build",
                "wss://rpc.goerli.linea.build",
                "https://linea-goerli.infura.io/v3/${INFURA_API_KEY}",
                "wss://linea-goerli.infura.io/ws/v3/${INFURA_API_KEY}"
            ],
            "faucets": [
                "https://faucetlink.to/goerli"
            ],
            "nativeCurrency": {
                "name": "Linea Ether",
                "symbol": "ETH",
                "decimals": 18
            },
            "infoURL": "https://linea.build",
            "shortName": "linea-testnet",
            "chainId": 59140,
            "networkId": 59140,
            "slip44": 1,
            "icon": "linea",
            "parent": {
                "type": "L2",
                "chain": "eip155-5",
                "bridges": [
                    {
                        "url": "https://goerli.hop.exchange/#/send?token=ETH&sourceNetwork=ethereum&destNetwork=linea"
                    }
                ]
            },
            "explorers": [
                {
                    "name": "Etherscan",
                    "url": "https://goerli.lineascan.build",
                    "standard": "EIP3091",
                    "icon": "linea"
                },
                {
                    "name": "Blockscout",
                    "url": "https://explorer.goerli.linea.build",
                    "standard": "EIP3091",
                    "icon": "linea"
                }
            ],
            "status": "active"
        },
        {
            "name": "Linea",
            "title": "Linea Mainnet",
            "chain": "ETH",
            "rpc": [
                "https://rpc.linea.build",
                "wss://rpc.linea.build",
                "https://linea-mainnet.infura.io/v3/${INFURA_API_KEY}",
                "wss://linea-mainnet.infura.io/ws/v3/${INFURA_API_KEY}"
            ],
            "faucets": [],
            "nativeCurrency": {
                "name": "Linea Ether",
                "symbol": "ETH",
                "decimals": 18
            },
            "infoURL": "https://linea.build",
            "shortName": "linea",
            "chainId": 59144,
            "networkId": 59144,
            "icon": "linea",
            "parent": {
                "type": "L2",
                "chain": "eip155-1",
                "bridges": [
                    {
                        "url": "https://bridge.linea.build"
                    }
                ]
            },
            "explorers": [
                {
                    "name": "Etherscan",
                    "url": "https://lineascan.build",
                    "standard": "EIP3091",
                    "icon": "linea"
                },
                {
                    "name": "Blockscout",
                    "url": "https://explorer.linea.build",
                    "standard": "EIP3091",
                    "icon": "linea"
                },
                {
                    "name": "L2scan",
                    "url": "https://linea.l2scan.co",
                    "standard": "EIP3091",
                    "icon": "linea"
                }
            ],
            "status": "active"
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