import "../env-config";
import { ethers, run } from "hardhat";

import { configEnv } from "./@config";
import { parseAmountToken } from "./@helpers/block-chain.helper";


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

    const tokenFactory = await getContractFactory("PresaleFairLaunchFactoryV1");
    const royaltyAddress = ROYALTY_ADDRESS.trim();
    const creationFee = parseAmountToken(0.2);
    const percentFeeRaised = 5 * 100;
    const percentRefund = 10 * 100;

    const deploymentTransaction = tokenFactory.getDeployTransaction(
        royaltyAddress,
        creationFee,
        percentFeeRaised,
        percentRefund,
    );

    const gasEstimation = await ethers.provider.estimateGas(deploymentTransaction);
    console.log("Estimated Gas for Deployment:", formatEther(gasEstimation));




    {





        const verifyData = {
            address: "0x63EdbA5BE3FC4C91180d869f5f03e18567527C73",
            constructorArguments: [
                "0xb49dbfef796737f777b70d2c5201341ee61d31ef",
                500,
                1000,
                "0xc100c7225cb597c709b6418a2941f414ed3d6796",
                parseAmountToken(228),
                parseAmountToken(400),
                1706401560,
                1706401920,
                parseAmountToken(1),
                0,
                "0x4a499535998e6ceabdbcd3792b92737b9d41b59a",
                "0xd99d1c33f9fc3444f8101754abc46c52416550d1"
            ],
            contract: "contracts/PresaleFairLaunchTemplateV1.sol:PresaleFairLaunchTemplateV1"
        }

        try {
            console.log('--------verify-----------');
            await run("verify:verify", {
                ...verifyData
            });
        } catch (error) {
            console.log('---------Verify error----------');
            console.log(error);
            console.log('-------------------');
        }




    }







}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

// [1,2,3,4,5,6,7,8,9,10]