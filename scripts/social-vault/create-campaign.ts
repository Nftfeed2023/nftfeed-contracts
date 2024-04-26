import "../../env-config";
import { ethers } from "hardhat";
import configArgs from "./config-args";
import { Contract } from "ethers";
import { ERC20, ERC20__factory, SocialVault, SocialVault__factory } from "../../typechain";
import { formatAmountToken, parseAmountToken, stringDateToUTCDate } from "../@helpers/block-chain.helper";

const { utils, getSigners, getContractFactory, provider } = ethers;
const { formatEther } = utils;

const { NODE_ENV, NETWORK_PROVIDER, royaltyAddress, systemAddress } = configArgs;

async function main() {
  const output: any = {};
  const [deployer] = await getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  const balance = await deployer.getBalance();
  console.log("Account balance:", formatEther(balance));
  const {
    TOKEN_ADDRESS: POOL_ADDRESS,
  } = require(`./outputs/${NODE_ENV}/deploy.json`);

  console.log(`-------------------`);
  console.log({ POOL_ADDRESS });
  console.log(`-------------------`);
  const poolCt = new Contract(
    POOL_ADDRESS,
    SocialVault__factory.abi,
    provider
  ) as SocialVault;

  console.log(`=====royaltyFee=====`);



  const USD_ADDRESS = {
    avaxMainnet: "0x9702230A8Ea53601f5cD2dc00fDBc13d4dF4A8c7",
    baseMainnet: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    bscMainnet: "0x55d398326f99059ff775485246999027b3197955",
    opMainnet: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
  }


  const startTime = Math.floor(stringDateToUTCDate("2024/04/01 00:00:00").getTime() / 1000);
  const endTime = Math.floor(stringDateToUTCDate("2024/04/30 00:00:00").getTime() / 1000);

  const CAMPAIGNS = {
    avaxMainnet: [
      {
        ntfAddress: "0xfcc87fe7b36db789d8e32a2a32b047b7b1adb6bc",
        totalAmountBonus: 50,
      }
    ],

  }

  const tokenAddress = USD_ADDRESS[NODE_ENV];
  const listData = CAMPAIGNS[NODE_ENV] || [];

  const tokenCt = new Contract(tokenAddress, ERC20__factory.abi, provider) as ERC20;
  const decimal = await tokenCt.decimals();

  const balanceUsd = await tokenCt.balanceOf(deployer.address);

  console.log(`-------------------`);
  console.log({ balanceUsd: formatAmountToken(balanceUsd, decimal) });
  console.log(`-------------------`);

  {
    console.log(`=====APPROVE=====`);
    const { transactionHash } = await (
      await tokenCt.connect(deployer).approve(
        POOL_ADDRESS,
        ethers.constants.MaxUint256,
      )
    ).wait();
    const txLink = `${NETWORK_PROVIDER.URL_SCAN}/tx/${transactionHash}`.trim();
    console.log("--------txLink APPROVE -----------");
    console.log(txLink);
    console.log("-------------------");
  }



  const value = await poolCt.creationFee();

  for (const { ntfAddress, totalAmountBonus } of listData) {
    // address _ntfAddress,
    // address _tokenAddress,
    // uint256 _totalAmountBonus,
    // uint256 _startTime,
    // uint256 _endTime
    console.log(`-------------------`);
    console.log({
      ntfAddress,
      tokenAddress,
      totalAmountBonus,
      startTime,
      endTime,
      value: formatAmountToken(value)
    });
    console.log(`-------------------`);
    const { transactionHash } = await (
      await poolCt.connect(deployer).createCampaign(
        ntfAddress,
        tokenAddress,
        parseAmountToken(totalAmountBonus, decimal),
        startTime,
        endTime,
        {
          value
        }
      )
    ).wait();
    const txLink = `${NETWORK_PROVIDER.URL_SCAN}/tx/${transactionHash}`.trim();
    console.log("--------txLink -----------");
    console.log({
      ntfAddress,
      totalAmountBonus,
      txLink
    });
    console.log("-------------------");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
