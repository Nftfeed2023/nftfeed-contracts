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
            "name": "zkSync Era Testnet",
            "chain": "ETH",
            "rpc": [
                "https://testnet.era.zksync.dev"
            ],
            "faucets": [
                "https://goerli.portal.zksync.io/faucet"
            ],
            "nativeCurrency": {
                "name": "Ether",
                "symbol": "ETH",
                "decimals": 18
            },
            "infoURL": "https://era.zksync.io/docs/",
            "shortName": "zksync-goerli",
            "chainId": 280,
            "networkId": 280,
            "icon": "zksync-era",
            "explorers": [
                {
                    "name": "zkSync Era Block Explorer",
                    "url": "https://goerli.explorer.zksync.io",
                    "icon": "zksync-era",
                    "standard": "EIP3091"
                }
            ],
            "parent": {
                "type": "L2",
                "chain": "eip155-1",
                "bridges": [
                    {
                        "url": "https://goerli.portal.zksync.io/bridge"
                    }
                ]
            }
        },
        {
            "name": "zkSync Era Mainnet",
            "chain": "ETH",
            "rpc": [
                "https://mainnet.era.zksync.io"
            ],
            "faucets": [],
            "nativeCurrency": {
                "name": "Ether",
                "symbol": "ETH",
                "decimals": 18
            },
            "infoURL": "https://zksync.io/",
            "shortName": "zksync",
            "chainId": 324,
            "networkId": 324,
            "icon": "zksync-era",
            "explorers": [
                {
                    "name": "zkSync Era Block Explorer",
                    "url": "https://explorer.zksync.io",
                    "icon": "zksync-era",
                    "standard": "EIP3091"
                }
            ],
            "parent": {
                "type": "L2",
                "chain": "eip155-1",
                "bridges": [
                    {
                        "url": "https://bridge.zksync.io/"
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