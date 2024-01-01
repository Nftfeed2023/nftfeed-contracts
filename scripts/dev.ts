import "../env-config";
import { ethers, run } from "hardhat";

import { configEnv } from "./@config";
import { BigNumber, Contract, Wallet, providers } from "ethers";
import { connectWallet, provider, sendMultipleNativeToken, sendMultipleToken } from "./@helpers/tools.helper";
import { dateStrToSeconds, delayTime, formatAmountToken, parseAmountToken, stringDateToUTCDate } from "./@helpers/block-chain.helper";
import { BatchTransferTool, BatchTransferTool__factory, ERC1155__factory, ERC20, ERC20__factory, ERC721, ERC721Enumerable, ERC721Enumerable__factory, ERC721Template, ERC721Template__factory, ERC721__factory, FeedVault, FeedVault__factory, MintNftFactory, MintNftFactoryV2, MintNftFactoryV2__factory, MintNftFactory__factory, RexFeeFactory, StakeMultipleERC721, StakeMultipleERC721__factory, StakeNftAutoApy, StakeNftAutoApy__factory, StakeNftFactory, StakeNftFactory__factory, TokenERC721, TokenERC721__factory } from "../typechain";
import { dir } from "console";
import { writeFileSync } from "fs";
import { join } from "path";
import { isAddress } from "ethers/lib/utils";
import { RexFeeFactory__factory } from "../typechain";

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


    const ct = new Contract("0x3e77A158aFbE3a015200cCFcD943b8Fd4E81B6a9", RexFeeFactory__factory.abi, provider) as RexFeeFactory;

    const value = await ct.getFeeByQty(10);

    {
        const { transactionHash } = await (
            await (ct.connect(deployer).takeFee("0x3e77A158aFbE3a015200cCFcD943b8Fd4E81B6a9", 10, {
                value
            }))
        ).wait();

        console.log(`-------------------`);
        console.log({ transactionHash });
        console.log(`-------------------`);
    }


}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

// [1,2,3,4,5,6,7,8,9,10]