import "../env-config";
import { ethers, run } from "hardhat";

import { configEnv } from "./@config";
import { BigNumber, Contract, Wallet, providers } from "ethers";
import { connectWallet, provider, sendMultipleNativeToken, sendMultipleToken } from "./@helpers/tools.helper";
import { dateStrToSeconds, delayTime, formatAmountToken, parseAmountToken, stringDateToUTCDate } from "./@helpers/block-chain.helper";
import { BatchTransferTool, BatchTransferTool__factory, ERC1155__factory, ERC721, ERC721Enumerable, ERC721Enumerable__factory, ERC721Template, ERC721Template__factory, ERC721__factory, FeedVault, FeedVault__factory, MintNftFactory, MintNftFactoryV2, MintNftFactoryV2__factory, MintNftFactory__factory, PresaleFairLaunchFactoryV1, PresaleFairLaunchFactoryV1__factory, RexFeeFactory, StakeMultipleERC721, StakeMultipleERC721__factory, StakeNftAutoApy, StakeNftAutoApy__factory, StakeNftFactory, StakeNftFactory__factory, TokenERC721, TokenERC721__factory } from "../typechain";
import { dir } from "console";
import { writeFileSync } from "fs";
import { join } from "path";
import { isAddress } from "ethers/lib/utils";
import { ERC20__factory } from "../typechain";
import { ERC20 } from "../typechain";
import { PresaleFairLaunchFactory } from "../typechain/PresaleFairLaunchFactory";


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

    // const tokenCt = await tokenFactory.deploy(
    //     royaltyAddress,
    //     creationFee,
    //     percentFeeRaised,
    //     percentRefund,
    // );
    // await tokenCt.deployed();

    // console.log(`${"PresaleFairLaunchFactoryV1"} deployed to:`, tokenCt.address);
    // const linkDeploy = `${NETWORK_PROVIDER.URL_SCAN}/address/${tokenCt.address}`.trim();
    // console.log('--------linkDeploy-----------');
    // console.log(linkDeploy);
    // console.log('-------------------');

    // const verifyData = {
    //     address: tokenCt.address,
    //     constructorArguments: [
    //         royaltyAddress,
    //         creationFee,
    //         percentFeeRaised,
    //         percentRefund,
    //     ],
    //     contract: "contracts/PresaleFairLaunchFactoryV1.sol:PresaleFairLaunchFactoryV1"
    // }

    // try {
    //     console.log('--------verify-----------');
    //     await run("verify:verify", {
    //         ...verifyData
    //     });
    // } catch (error) {
    //     console.log('---------Verify error----------');
    //     console.log(error);
    //     console.log('-------------------');
    // }



    {


        // deploy pool 
        const tokenAddress = "0x16Cbe6a09aa0B674a436179c77Dc844C96141d2F";

        const manager = "0xb49dBfEF796737F777B70D2C5201341Ee61d31Ef";

        const verifyData = {
            address: tokenAddress,
            constructorArguments: [
                "FTokenV1",
                "FTokenV1",
                1000,
                manager
            ],
            contract: "contracts/ERC20Template.sol:ERC20Template"
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

        const percentForLiquidity = 60 * 100; // 60%
        const tokensForPresale = parseAmountToken(400);
        const startTime = Math.floor(stringDateToUTCDate("2024/01/27 10:00:00").getTime() / 1000);
        const endTime = Math.floor(stringDateToUTCDate("2024/01/29 10:00:00").getTime() / 1000);
        const softCap = parseAmountToken(1);
        const maxContribution = parseAmountToken(20);

        const dexRouter = "0xD99D1c33F9fC3444f8101754aBC46c52416550D1";




        const factoryAddress = "0x8f4E54cB9C0E64Fa5600DeC4F431Db48d76bF496";
        const factoryCt = new Contract(factoryAddress, PresaleFairLaunchFactoryV1__factory.abi, provider) as PresaleFairLaunchFactoryV1;

        const tokensForLiquidity = await factoryCt.calculateTokensForLiquidity(percentForLiquidity, tokensForPresale);

        const tokenCt = new Contract(tokenAddress, ERC20__factory.abi, provider) as ERC20;
        const amountApprove = tokensForLiquidity.add(tokensForPresale);
        console.log(`-------------------`);
        console.log({
            amountApprove: formatAmountToken(amountApprove)
        });
        console.log(`-------------------`);


        console.log(`-------------------`);
        console.log({

            softCap: softCap.toString(),
            maxContribution: maxContribution.toString(),
            startTime,
            endTime
        });
        console.log(`-------------------`);


    }







}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

// [1,2,3,4,5,6,7,8,9,10]