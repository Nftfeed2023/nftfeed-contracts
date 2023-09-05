import "../env-config";
import { ethers } from "hardhat";

import { configEnv } from "./@config";
import { BigNumber, Contract } from "ethers";
import { provider, sendMultipleNativeToken, sendMultipleToken } from "./@helpers/tools.helper";
import { dateStrToSeconds, delayTime, parseAmountToken, stringDateToUTCDate } from "./@helpers/block-chain.helper";
import { ERC1155__factory, ERC20, ERC20__factory, ERC721, ERC721Enumerable, ERC721Enumerable__factory, ERC721__factory, FeedVault, FeedVault__factory, MintNftFactory, MintNftFactoryV2, MintNftFactoryV2__factory, MintNftFactory__factory, StakeNftAutoApy, StakeNftAutoApy__factory, StakeNftFactory, StakeNftFactory__factory, TokenERC721, TokenERC721__factory } from "../typechain";
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

    const ct = new Contract("0xAf1FF8e04Aa97d2C155fBa9829CB152169bfD8fD",
        MintNftFactoryV2__factory.abi,
        provider
    ) as MintNftFactoryV2;


    const nftAddress = "0x5F05FA19200F054a7249b092Ff4CBAA6ae3A75A1";
    // {
    //     const { transactionHash } = await (await ct
    //         .connect(deployer)
    //         .changeSystemPercentAff(nftAddress, 23.5 * 100)).wait()

    //     const txHash = `${URL_SCAN}/tx/${transactionHash}`.trim();
    //     console.log('--------tx1-----------');
    //     console.log(txHash);
    //     console.log('-------------------');

    // }

    {

        const list = [
            "0x27b0b4033b6bdcdf12c8d4b86969e3aee53ca107",
            "0xdA3d7DbB9fe32eD3b4455BA0507B9c66B4607710",
            "0x08E2B5a2227dc40E2483eA076A2083b1E5c3AE3A",
            "0xf7c7730eBdB3D6473DF9ed96288Ef28b22169c60",
        ].filter(v => isAddress(v)).map(v => v.trim());

        console.log(`-------------------`);
        console.log(list);
        console.log(`-------------------`);
        const { transactionHash } = await (await ct
            .connect(deployer)
            .updatePartnerAff(nftAddress, list, true)).wait()

        const txHash = `${URL_SCAN}/tx/${transactionHash}`.trim();
        console.log('--------txHash2-----------');
        console.log(txHash);
        console.log('-------------------');

    }

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

// [1,2,3,4,5,6,7,8,9,10]