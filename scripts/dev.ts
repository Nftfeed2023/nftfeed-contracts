import "../env-config";
import { ethers } from "hardhat";

import { configEnv } from "./@config";
import { BigNumber, Contract } from "ethers";
import { provider, sendMultipleNativeToken, sendMultipleToken } from "./@helpers/tools.helper";
import { dateStrToSeconds, delayTime, parseAmountToken, stringDateToUTCDate } from "./@helpers/block-chain.helper";
import { ERC1155__factory, ERC20, ERC20__factory, ERC721, ERC721Enumerable, ERC721Enumerable__factory, ERC721__factory, FeedVault, FeedVault__factory, MintNftFactory, MintNftFactory__factory, StakeNftAutoApy, StakeNftAutoApy__factory, StakeNftFactory, StakeNftFactory__factory, TokenERC721, TokenERC721__factory } from "../typechain";
import { dir } from "console";
import { writeFileSync } from "fs";
import { join } from "path";

const { utils, constants, getSigners, getContractFactory } = ethers;
const { formatEther } = utils;
const { MaxUint256, Zero, AddressZero, HashZero } = constants;
const {
    NODE_ENV = "bscTestnet",
} = process.env;


const { TOKEN_ADDRESS, NETWORK_PROVIDER } = configEnv();
const { URL_SCAN } = NETWORK_PROVIDER;


async function main() {

    const output: any = {};
    const [deployer] = await getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
    const balance = await deployer.getBalance();
    console.log("Account balance:", formatEther(balance));

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


    const data = [{
        "name": "ZetaChain Mainnet",
        "chain": "ZetaChain",
        "icon": "zetachain",
        "rpc": [
            "https://api.mainnet.zetachain.com/evm"
        ],
        "faucets": [],
        "nativeCurrency": {
            "name": "Zeta",
            "symbol": "ZETA",
            "decimals": 18
        },
        "infoURL": "https://zetachain.com/docs/",
        "shortName": "zetachain-mainnet",
        "chainId": 7000,
        "networkId": 7000,
        "status": "incubating",
        "explorers": [
            {
                "name": "ZetaChain Mainnet Explorer",
                "url": "https://explorer.mainnet.zetachain.com",
                "standard": "none"
            }
        ]
    },
    {
        "name": "ZetaChain Athens 3 Testnet",
        "chain": "ZetaChain",
        "icon": "zetachain",
        "rpc": [
            "https://rpc.ankr.com/zetachain_evm_athens_testnet"
        ],
        "faucets": [
            "https://labs.zetachain.com/get-zeta"
        ],
        "nativeCurrency": {
            "name": "Zeta",
            "symbol": "aZETA",
            "decimals": 18
        },
        "infoURL": "https://zetachain.com/docs",
        "shortName": "zetachain-athens",
        "chainId": 7001,
        "networkId": 7001,
        "status": "active",
        "explorers": [
            {
                "name": "ZetaChain Athens Testnet Explorer",
                "url": "https://athens3.explorer.zetachain.com",
                "standard": "none"
            },
            {
                "name": "blockscout",
                "url": "https://zetachain-athens-3.blockscout.com",
                "icon": "blockscout",
                "standard": "EIP3091"
            }
        ]
    },]

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