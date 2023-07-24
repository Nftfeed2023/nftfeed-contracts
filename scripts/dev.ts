import "../env-config";
import { ethers } from "hardhat";

import { configEnv } from "./@config";
import { Contract } from "ethers";
import { provider, sendMultipleBnb, sendMultipleToken } from "./@helpers/tools.helper";
import { dateStrToSeconds, delayTime, parseAmountToken, stringDateToUTCDate } from "./@helpers/block-chain.helper";
import { ERC1155__factory, ERC20, ERC20__factory, ERC721, ERC721Enumerable, ERC721Enumerable__factory, ERC721__factory, FeedVault, FeedVault__factory, MintNftFactory, MintNftFactory__factory, TokenERC721, TokenERC721__factory } from "../typechain";
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

const { TOKEN_ADDRESS: VAULT_ADDRESS } = require(`./feed-vault/outputs/${NODE_ENV}/deploy.json`);

async function main() {

    const output: any = {};
    const [deployer] = await getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
    const balance = await deployer.getBalance();
    console.log("Account balance:", formatEther(balance));


    // const vaultId = 1;
    // const totalQty = 10;

    // const vaultCt = new Contract(
    //     VAULT_ADDRESS,
    //     FeedVault__factory.abi,
    //     provider
    // ) as FeedVault;


    // vaultCt.vaultIndex()

    // const stableTokenCt = new Contract(
    //     TOKEN_ADDRESS.BUSD,
    //     ERC20__factory.abi,
    //     provider
    // ) as ERC20;


    // {
    //     console.log(`=====Tạo vault=====`);
    //     const { transactionHash } = await (
    //         await vaultCt.connect(deployer)
    //             .createVault(
    //                 "NFTD",
    //                 "NFTD",
    //                 "https://dapp.nftfeed.guru/static/media/19.6233b4d2.png",
    //                 parseAmountToken(20),
    //                 10,
    //                 Math.floor(stringDateToUTCDate("2023/10/16 15:00:00").getTime() / 1000),
    //                 500,
    //                 1000
    //             )
    //     ).wait();

    //     const txLink = `${NETWORK_PROVIDER.URL_SCAN}/tx/${transactionHash}`.trim();
    //     console.log('--------link TX-----------');
    //     console.log(txLink);
    //     console.log('-------------------');


    // }

    // {
    //     console.log(`=====Approve =====`);
    //     const { transactionHash } = await (
    //         await stableTokenCt.connect(deployer)
    //             .approve(vaultCt.address, MaxUint256)
    //     ).wait();

    //     const txLink = `${NETWORK_PROVIDER.URL_SCAN}/tx/${transactionHash}`.trim();
    //     console.log('--------link TX-----------');
    //     console.log(txLink);
    //     console.log("balance: ", await stableTokenCt.balanceOf(deployer.address));
    //     console.log('-------------------');
    // }


    // {
    //     console.log(`=====Mint NFT =====`);
    //     const { transactionHash } = await (
    //         await vaultCt.connect(deployer)
    //             .mintNftByVault(vaultId, totalQty, AddressZero)
    //     ).wait();

    //     const txLink = `${NETWORK_PROVIDER.URL_SCAN}/tx/${transactionHash}`.trim();
    //     console.log('--------link TX-----------');
    //     console.log(txLink);
    //     console.log('-------------------');
    // }

    // const vaultInfo = await vaultCt.containerVault(vaultId);
    // const nftAddress = vaultInfo.nft;
    // const nftCt = new Contract(nftAddress, ERC721Enumerable__factory.abi, provider) as ERC721Enumerable;
    // {
    //     console.log(`=====Approve NFT =====`);
    //     const { transactionHash } = await (
    //         await nftCt.connect(deployer)
    //             .setApprovalForAll(vaultCt.address, true)
    //     ).wait();

    //     const txLink = `${NETWORK_PROVIDER.URL_SCAN}/tx/${transactionHash}`.trim();
    //     console.log('--------link TX-----------');
    //     console.log(txLink);
    //     console.log('-------------------');

    //     console.log(`=====TOKEN IDS IN ${deployer.address}=====`);

    //     console.log({
    //         balance: await nftCt.balanceOf(deployer.address),
    //         deployer: deployer.address,
    //         [1]: await nftCt.ownerOf(1),
    //         [2]: await nftCt.ownerOf(2),
    //         [3]: await nftCt.ownerOf(3),
    //     });
    // }

    // const tokenIds = Array.from({ length: totalQty - 5 }).map((_, idx) => idx + 1);

    // {
    //     console.log(`=====SELL NFT =====`);
    //     const { transactionHash } = await (
    //         await vaultCt.connect(deployer)
    //             .sellByVault(vaultId, tokenIds)
    //     ).wait();

    //     const txLink = `${NETWORK_PROVIDER.URL_SCAN}/tx/${transactionHash}`.trim();
    //     console.log('--------link TX-----------');
    //     console.log(txLink);
    //     console.log('-------------------');

    //     console.log({
    //         balanceUSD_vault: await stableTokenCt.balanceOf(vaultCt.address),
    //     });
    // }

    // {
    //     console.log(`=====BUY NFT =====`);
    //     const { transactionHash } = await (
    //         await vaultCt.connect(deployer)
    //             .targetRedeem(vaultId, tokenIds)
    //     ).wait();

    //     const txLink = `${NETWORK_PROVIDER.URL_SCAN}/tx/${transactionHash}`.trim();
    //     console.log('--------link TX-----------');
    //     console.log(txLink);
    //     console.log('-------------------');
    // }



    // const poolCt = new Contract("0x38A3A6D2939E07491423111db0d13Ef866fee7d3",
    //     MintNftFactory__factory.abi,
    //     provider
    // ) as MintNftFactory;


    // {
    //     const { transactionHash } = await (await poolCt.connect(deployer).deploy(
    //         "NFTA",
    //         "NFTA",
    //         "https://qa.cdn.nftfeed.guru/files/ecommerce/53c6a545d7764c508087a7fa6b7564feThie%CC%82%CC%81t%20ke%CC%82%CC%81%20chu%CC%9Ba%20co%CC%81%20te%CC%82n%20(42).png",
    //         parseAmountToken(0.00009),
    //         Math.floor(stringDateToUTCDate("2023/10/16 15:00:00").getTime() / 1000),
    //         1000
    //     )).wait();

    //     console.log(`=====TX DEPLOY NFT=====`);
    //     const txLink = `${NETWORK_PROVIDER.URL_SCAN}/tx/${transactionHash}`.trim();
    //     console.log('--------link TX-----------');
    //     console.log(txLink);
    //     console.log('-------------------');
    // }


    // {

    //     const qty = 1;
    //     const totalPool = await poolCt.totalPool();
    //     const nftAddress = await poolCt.containerNfts(totalPool);
    //     const amountOut = await poolCt.getAmountOut(nftAddress, qty)
    //     console.log(`-------------------`);
    //     console.log({ nftAddress, amountOut: formatEther(amountOut) });
    //     console.log(`-------------------`);

    //     const { transactionHash } = await (await poolCt.connect(deployer).mint(nftAddress, qty, {
    //         value: amountOut
    //     })).wait()


    //     console.log(`=====TX MINT NFT=====`);
    //     const txLink = `${NETWORK_PROVIDER.URL_SCAN}/tx/${transactionHash}`.trim();
    //     console.log('--------link TX-----------');
    //     console.log(txLink);
    //     console.log('-------------------');
    // }

    {
        const customProvider = new ethers.providers.JsonRpcProvider("https://mainnet.optimism.io");

        const nftCt = new Contract("0x3e4b65cdf610d43bca81b88fe17b139501abf864", ERC1155__factory.abi, customProvider) as ERC721;


        const balance = await nftCt.balanceOf("0xc63a789E142328F3039358c7aB442a067B77138D");

        console.log(`-------------------`);
        console.log(balance.toNumber());
        console.log(`-------------------`);
    }

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

// [1,2,3,4,5,6,7,8,9,10]