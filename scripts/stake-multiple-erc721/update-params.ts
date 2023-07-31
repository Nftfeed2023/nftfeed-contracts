import "../../env-config";
import { ethers } from "hardhat";
import configArgs from "./config-args";
import { Contract } from "ethers";
import { StakeMultipleERC721, StakeMultipleERC721__factory } from "../../typechain";


const { utils, getSigners, getContractFactory, provider } = ethers;
const { formatEther } = utils;

const { NODE_ENV, NETWORK_PROVIDER, inputPools } = configArgs;



async function main() {
    const output: any = {};
    const [deployer] = await getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    const balance = await deployer.getBalance();
    console.log("Account balance:", formatEther(balance));

    const { TOKEN_ADDRESS } = require(`./outputs/${NODE_ENV}/deploy.json`);
    const tokenCt = new Contract(TOKEN_ADDRESS, StakeMultipleERC721__factory.abi, provider) as StakeMultipleERC721;

    {

        const nfts = inputPools.map(v => v.nftAddress);
        const poolInfos = inputPools.map(({ nftAddress, ...restItem }, idx) => ({ ...restItem }))
        const { transactionHash } = await (await tokenCt.connect(deployer).updateParamsPools(
            nfts,
            poolInfos
        )).wait();
        const txLink = `${NETWORK_PROVIDER.URL_SCAN}/tx/${transactionHash}`.trim();
        console.log('--------link TX-----------');
        console.log({
            txLink
        });
        console.log('-------------------');
    }


}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});