import "../env-config";
import { ethers } from "hardhat";

import { configEnv } from "./@config";
import { Contract } from "ethers";
import { provider } from "./@helpers/tools.helper";
import { parseAmountToken, stringDateToUTCDate } from "./@helpers/block-chain.helper";
import { ERC20, ERC20__factory, ERC721, ERC721Enumerable, ERC721Enumerable__factory, ERC721__factory, FeedVault, FeedVault__factory } from "../typechain";

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


    const vaultId = 1;
    const totalQty = 10;

    const vaultCt = new Contract(
        VAULT_ADDRESS,
        FeedVault__factory.abi,
        provider
    ) as FeedVault;


    vaultCt.vaultIndex()

    const stableTokenCt = new Contract(
        TOKEN_ADDRESS.BUSD,
        ERC20__factory.abi,
        provider
    ) as ERC20;


    {
        console.log(`=====Tạo vault=====`);
        const { transactionHash } = await (
            await vaultCt.connect(deployer)
                .createVault(
                    "NFTD",
                    "NFTD",
                    "https://dapp.nftfeed.guru/static/media/19.6233b4d2.png",
                    parseAmountToken(20),
                    10
                )
        ).wait();

        const txLink = `${NETWORK_PROVIDER.URL_SCAN}/tx/${transactionHash}`.trim();
        console.log('--------link TX-----------');
        console.log(txLink);
        console.log('-------------------');


    }

    {
        console.log(`=====Approve =====`);
        const { transactionHash } = await (
            await stableTokenCt.connect(deployer)
                .approve(vaultCt.address, MaxUint256)
        ).wait();

        const txLink = `${NETWORK_PROVIDER.URL_SCAN}/tx/${transactionHash}`.trim();
        console.log('--------link TX-----------');
        console.log(txLink);
        console.log('-------------------');
    }


    {
        console.log(`=====Mint NFT =====`);
        const { transactionHash } = await (
            await vaultCt.connect(deployer)
                .mintNftByVault(vaultId, totalQty)
        ).wait();

        const txLink = `${NETWORK_PROVIDER.URL_SCAN}/tx/${transactionHash}`.trim();
        console.log('--------link TX-----------');
        console.log(txLink);
        console.log('-------------------');
    }

    const vaultInfo = await vaultCt.getVaultInfoById(vaultId);
    const nftAddress = vaultInfo.nft;
    const nftCt = new Contract(nftAddress, ERC721Enumerable__factory.abi, provider) as ERC721Enumerable;
    {
        console.log(`=====Approve NFT =====`);
        const { transactionHash } = await (
            await nftCt.connect(deployer)
                .setApprovalForAll(vaultCt.address, true)
        ).wait();

        const txLink = `${NETWORK_PROVIDER.URL_SCAN}/tx/${transactionHash}`.trim();
        console.log('--------link TX-----------');
        console.log(txLink);
        console.log('-------------------');

        console.log(`=====TOKEN IDS IN ${deployer.address}=====`);

        console.log({
            balance: await nftCt.balanceOf(deployer.address),
            deployer: deployer.address,
            [1]: await nftCt.ownerOf(1),
            [2]: await nftCt.ownerOf(2),
            [3]: await nftCt.ownerOf(3),
        });
    }

    const tokenIds = Array.from({ length: totalQty }).map((_, idx) => idx + 1);

    {
        console.log(`=====SELL NFT =====`);
        const { transactionHash } = await (
            await vaultCt.connect(deployer)
                .sellByVaultId(vaultId, tokenIds)
        ).wait();

        const txLink = `${NETWORK_PROVIDER.URL_SCAN}/tx/${transactionHash}`.trim();
        console.log('--------link TX-----------');
        console.log(txLink);
        console.log('-------------------');

        console.log({
            balanceUSD_vault: await stableTokenCt.balanceOf(vaultCt.address),
        });
    }

    {
        console.log(`=====BUY NFT =====`);
        const { transactionHash } = await (
            await vaultCt.connect(deployer)
                .targetRedeem(vaultId, tokenIds)
        ).wait();

        const txLink = `${NETWORK_PROVIDER.URL_SCAN}/tx/${transactionHash}`.trim();
        console.log('--------link TX-----------');
        console.log(txLink);
        console.log('-------------------');
    }


}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

// [1,2,3,4,5,6,7,8,9,10]