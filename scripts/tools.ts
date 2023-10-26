import "../env-config";
import { ethers } from "hardhat";

import { configEnv } from "./@config";
import { BigNumber, Contract, Signer } from "ethers";
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

    const output: any = {};
    const [deployer] = await getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
    const balance = await deployer.getBalance();
    console.log("Account balance:", formatEther(balance));



    const nftAddress = "0x73e6225087d0b06d3c8edb51161a1c3af7105dfc";
    const factoryAddress = "0xAf1FF8e04Aa97d2C155fBa9829CB152169bfD8fD";
    const factoryCt = new Contract(factoryAddress, MintNftFactoryV2__factory.abi, provider) as MintNftFactoryV2;

    const mint = async ({ owner }: { owner: Signer }) => {
        try {
            const value = await factoryCt.getAmountOut(nftAddress);
            console.log(`-------------------`);
            console.log({
                value: formatEther(value)
            });
            console.log(`-------------------`);
            const { transactionHash } = await ((await factoryCt.connect(owner).mint(nftAddress, AddressZero, {
                value
            })).wait())
            return {
                status: "DONE",
                transactionHash,
                owner: await owner.getAddress()
            }
        } catch (error) {
            console.log(`-------------------`);
            console.log(error);
            console.log(`-------------------`);
            return {
                status: "ERROR",
                transactionHash: "",
                owner: await owner.getAddress()
            }
        }
    }


    const listWallets = require("../outputs/list.json") as { privateKey: string }[];



    const res = await mint({
        owner: connectWallet(listWallets[0].privateKey)
    })


}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

// [1,2,3,4,5,6,7,8,9,10]