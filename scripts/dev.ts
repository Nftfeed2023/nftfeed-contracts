import "../env-config";
import { ethers } from "hardhat";

import { configEnv } from "./@config";
import { BigNumber, Contract } from "ethers";
import { provider, sendMultipleNativeToken, sendMultipleToken } from "./@helpers/tools.helper";
import { dateStrToSeconds, delayTime, parseAmountToken, stringDateToUTCDate } from "./@helpers/block-chain.helper";
import { ERC1155__factory, ERC20, ERC20__factory, ERC721, ERC721Enumerable, ERC721Enumerable__factory, ERC721__factory, FeedVault, FeedVault__factory, MintNftFactory, MintNftFactoryV2, MintNftFactoryV2__factory, MintNftFactory__factory, StakeMultipleERC721, StakeMultipleERC721__factory, StakeNftAutoApy, StakeNftAutoApy__factory, StakeNftFactory, StakeNftFactory__factory, TokenERC721, TokenERC721__factory } from "../typechain";
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

    const autoApyPool = "0xfc161FFb28599a0d07941c265F4FcFeF60f3034f"; // base

    const stakeMultipleErc721 = "0x12CcE7bcA11364Da0D120Fb82B4042a46a8Cf586"; // op




    const dataOp: { walletAddress: string; qty: number }[] = require("../inputs/op_stake.json");

    const dataBase: { walletAddress: string; qty: number }[] = require("../inputs/base_stake.json");

    // {

    //     const outputs = []
    //     const ct = new Contract(stakeMultipleErc721, StakeMultipleERC721__factory.abi, provider) as StakeMultipleERC721;
    //     const totalPool = await ct.totalPool();
    //     const promises = [];
    //     for (let index = 0; index < totalPool.toNumber(); index++) {
    //         promises.push(ct.containerNfts(1));

    //     }
    //     const nfts = await Promise.all(promises);
    //     const getQtyNft = async (walletAddress: string) => {
    //         let qty = 0;
    //         for (const nft of nfts) {
    //             const qtyItem = await ct.getQtyStakedByUser(nft, walletAddress).then(qty => qty.toNumber()).catch(_ => 0);
    //             qty += qtyItem;
    //         }
    //         console.log(`-------------------`);
    //         console.log({
    //             qty, walletAddress
    //         });
    //         console.log(`-------------------`);
    //         return {
    //             walletAddress,
    //             qty
    //         }
    //     }

    //     for (const walletAddress of stakeWallets) {
    //         outputs.push(await getQtyNft(walletAddress))
    //     }
    //     try {
    //         const fileName = `./op_stake.json`;
    //         writeFileSync(fileName, JSON.stringify(outputs));
    //     } catch (error) {

    //     }


    // }

    // const data: { walletAddress: string; qty: number }[] = dataOp.concat(dataBase).map(({ walletAddress, qty }) => ({
    //     walletAddress: walletAddress.toLowerCase(),
    //     qty
    // }));

    // const pointBounusOneNft = 300;

    // const outputs = data.reduce<{ [key: string]: number }>((result, item) => {
    //     const qty = result[item.walletAddress] || 0;

    //     Object.assign(result, {
    //         [item.walletAddress]: qty + item.qty
    //     });


    //     return result;
    // }, {})


    // const stakePoint = Object.keys(outputs).map(walletAddress => {
    //     const point = outputs[walletAddress] * pointBounusOneNft;
    //     return {
    //         walletAddress,
    //         point
    //     }
    // })

    // const galxePointRaw = require("../inputs/galxe.json");

    // const zealyPointRaw: any[] = require("../inputs/zealy_v2.json");

    // const galxePoint: { walletAddress: string, point: number }[] = galxePointRaw.map(({ walletAddress, point }) => ({
    //     walletAddress: walletAddress.toLowerCase(), point
    // }));

    // const zealyPoint: { walletAddress: string, point: number }[] = zealyPointRaw
    //     .filter(v => isAddress(v.walletAddress))
    //     .map(({ walletAddress, point }) => ({
    //         walletAddress: walletAddress.toLowerCase(), point
    //     }));



    // const listPoint = stakePoint.concat(galxePoint).concat(zealyPoint);
    // const mapPoint = listPoint.reduce<{ [key: string]: number }>((result, item) => {
    //     const point = result[item.walletAddress] || 0;
    //     Object.assign(result, {
    //         [item.walletAddress]: point + item.point
    //     })
    //     return result;
    // }, {});

    // const mapGalxePoint = galxePoint.reduce<{ [key: string]: number }>((result, item) => {
    //     const point = result[item.walletAddress] || 0;
    //     Object.assign(result, {
    //         [item.walletAddress]: point + item.point
    //     })
    //     return result;
    // }, {});

    // const mapXealyPoint = zealyPoint.reduce<{ [key: string]: number }>((result, item) => {
    //     const point = result[item.walletAddress] || 0;
    //     Object.assign(result, {
    //         [item.walletAddress]: point + item.point
    //     })
    //     return result;
    // }, {});

    // const mapStakePoint = stakePoint.reduce<{ [key: string]: number }>((result, item) => {
    //     const point = result[item.walletAddress] || 0;
    //     Object.assign(result, {
    //         [item.walletAddress]: point + item.point
    //     })
    //     return result;
    // }, {});




    // const points = Object.keys(mapPoint).map(evmAddress => ({
    //     evmAddress,
    //     point: mapPoint[evmAddress],
    //     galxePoint: mapGalxePoint[evmAddress] || 0,
    //     zealyPoint: mapXealyPoint[evmAddress] || 0,
    //     stakePoint: mapStakePoint[evmAddress] || 0
    // }));


    // console.log(`-------------------`);
    // console.log(points.filter(v => v.zealyPoint > 0).length);
    // console.log(`-------------------`);

    // try {
    //     const fileName = `./snapshot-v2.json`;
    //     writeFileSync(fileName, JSON.stringify(points));
    // } catch (error) {

    // }


    console.log(`-------------------`);
    console.log({
        endTime: Math.floor(stringDateToUTCDate("2023/11/01 00:00:00").getTime() / 1000),
    });
    console.log(`-------------------`);

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

// [1,2,3,4,5,6,7,8,9,10]