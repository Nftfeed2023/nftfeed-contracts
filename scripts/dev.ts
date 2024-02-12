import "../env-config";
import { ethers, run } from "hardhat";

import { configEnv } from "./@config";
import { parseAmountToken } from "./@helpers/block-chain.helper";
import { Contract } from "ethers";
import { PresaleFairLaunchTemplateV1, PresaleFairLaunchTemplateV1__factory } from "../typechain";
import { provider } from "./@helpers/tools.helper";


const { utils, constants, getSigners, getContractFactory } = ethers;
const { formatEther } = utils;
const { MaxUint256, Zero, AddressZero, HashZero } = constants;
const {
    NODE_ENV = "bscTestnet",
    ROYALTY_ADDRESS = ""
} = process.env;


const { TOKEN_ADDRESS, NETWORK_PROVIDER, } = configEnv();
const { URL_SCAN } = NETWORK_PROVIDER;


async function main() {

    const output: any = {};
    const [deployer] = await getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
    const balance = await deployer.getBalance();
    console.log("Account balance:", formatEther(balance));


    const presaleAddress = "0xe270a5e22bda420b20624ea5e33924f99ef673fc";
    const tokenCt = new Contract(
        presaleAddress,
        PresaleFairLaunchTemplateV1__factory.abi,
        provider
    ) as PresaleFairLaunchTemplateV1;














}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

// [1,2,3,4,5,6,7,8,9,10]