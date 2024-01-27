import "../env-config";
import { ethers, run } from "hardhat";

import { configEnv } from "./@config";
import { BigNumber, Contract, Wallet, providers } from "ethers";
import { connectWallet, provider, sendMultipleNativeToken, sendMultipleToken } from "./@helpers/tools.helper";
import { dateStrToSeconds, delayTime, formatAmountToken, parseAmountToken, stringDateToUTCDate } from "./@helpers/block-chain.helper";
import { BatchTransferTool, BatchTransferTool__factory, ERC1155__factory, ERC721, ERC721Enumerable, ERC721Enumerable__factory, ERC721Template, ERC721Template__factory, ERC721__factory, FeedVault, FeedVault__factory, MintNftFactory, MintNftFactoryV2, MintNftFactoryV2__factory, MintNftFactory__factory, RexFeeFactory, StakeMultipleERC721, StakeMultipleERC721__factory, StakeNftAutoApy, StakeNftAutoApy__factory, StakeNftFactory, StakeNftFactory__factory, TokenERC721, TokenERC721__factory } from "../typechain";
import { dir } from "console";
import { writeFileSync } from "fs";
import { join } from "path";
import { isAddress } from "ethers/lib/utils";
import { ERC20__factory } from "../typechain";
import { ERC20 } from "../typechain";


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

    const tokenFactory = await getContractFactory("PresaleFairLaunchTemplateV1");



    const ONE_HUNDRED_PERCENT = 100 * 100;
    const royaltyAddress = ROYALTY_ADDRESS.trim();
    const percentFeeRaised = 5 * 100;
    const percentRefund = 7 * 100;
    const liqPercent = 60 * 100; // 60%
    const tokenAddress = "0x9D1b00B04C99754d20CfDF69b6E19432329e132F";

    const ct = new Contract(tokenAddress, ERC20__factory.abi, provider) as ERC20;

    const totalSupply = await ct.totalSupply();
    const tokensForPresale = totalSupply.mul(4).div(10);

    // x * (ONE_HUNDRED_PERCENT - _percentFeeRaised) * (liqPercent) : (x/tokensForPresale)
    // x=1 (ONE_HUNDRED_PERCENT - _percentFeeRaised) * liqPercent * tokensForPresale;
    const tokensForLiquidity = tokensForPresale.mul(liqPercent).mul(ONE_HUNDRED_PERCENT - percentFeeRaised)
        .div(ONE_HUNDRED_PERCENT).div(ONE_HUNDRED_PERCENT);


    console.log(`-------------------`);
    console.log({
        tokensForPresale: formatAmountToken(tokensForPresale),
        tokensForLiquidity: formatAmountToken(tokensForLiquidity),
    });
    console.log(`-------------------`);

    const startTime = Math.floor(stringDateToUTCDate("2024/01/27 10:00:00").getTime() / 1000);
    const endTime = Math.floor(stringDateToUTCDate("2024/01/29 10:00:00").getTime() / 1000);
    const softCap = parseAmountToken(1);
    const maxContribution = parseAmountToken(0);
    const manager = "0xb49dBfEF796737F777B70D2C5201341Ee61d31Ef";
    const dexRouter = "0xD99D1c33F9fC3444f8101754aBC46c52416550D1";
    const deploymentTransaction = tokenFactory.getDeployTransaction(
        royaltyAddress,
        percentFeeRaised,
        percentRefund,
        tokenAddress,
        tokensForLiquidity,
        tokensForPresale,
        startTime,
        endTime,
        softCap,
        maxContribution,
        manager,
        dexRouter,
    );

    const gasEstimation = await ethers.provider.estimateGas(deploymentTransaction);
    console.log("Estimated Gas for Deployment:", formatEther(gasEstimation));


    const tokenCt = await tokenFactory.deploy(
        royaltyAddress,
        percentFeeRaised,
        percentRefund,
        tokenAddress,
        tokensForLiquidity,
        tokensForPresale,
        startTime,
        endTime,
        softCap,
        maxContribution,
        manager,
        dexRouter,
    );
    await tokenCt.deployed();


    console.log(`${"PresaleFairLaunchTemplateV1"} deployed to:`, tokenCt.address);
    const linkDeploy = `${NETWORK_PROVIDER.URL_SCAN}/address/${tokenCt.address}`.trim();
    console.log('--------linkDeploy-----------');
    console.log(linkDeploy);
    console.log('-------------------');

    const verifyData = {
        address: tokenCt.address,
        constructorArguments: [
            royaltyAddress,
            percentFeeRaised,
            percentRefund,
            tokenAddress,
            tokensForLiquidity,
            tokensForPresale,
            startTime,
            endTime,
            softCap,
            maxContribution,
            manager,
            dexRouter,
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

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

// [1,2,3,4,5,6,7,8,9,10]