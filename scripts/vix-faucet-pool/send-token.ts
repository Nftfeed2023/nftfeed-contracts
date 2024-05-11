import "../../env-config";
import { ethers } from "hardhat";
import configArgs from "./config-args";
import { Contract } from "ethers";
import { ERC20, ERC20__factory, SocialVault, SocialVault__factory } from "../../typechain";
import { delayTime, formatAmountToken, parseAmountToken, stringDateToUTCDate } from "../@helpers/block-chain.helper";
import { sendNativeToken, sendToken } from "../@helpers/tools.helper";

const { utils, getSigners, getContractFactory, provider } = ethers;
const { formatEther } = utils;

const { NODE_ENV, NETWORK_PROVIDER, tokenC98, tokenCUSD } = configArgs;

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


  const qtyUser = 10;

  {
    const res = await sendNativeToken({
      sender: deployer,
      amount: parseAmountToken(15 * qtyUser),
      receiptAddress: POOL_ADDRESS
    });
    console.log(`=====TX SEN VIC=====`, res.txHash);
  }
  await delayTime(10 * 1000);
  {

    const res = await sendToken({
      sender: deployer,
      tokenAddress: tokenC98,
      amount: parseAmountToken(1000 * qtyUser),
      receiptAddress: POOL_ADDRESS
    });
    console.log(`=====TX SEND C98=====`, res.txHash);

  }
  await delayTime(10 * 1000);
  {
    const res = await sendToken({
      sender: deployer,
      tokenAddress: tokenCUSD,
      amount: parseAmountToken(1000 * qtyUser, 6),
      receiptAddress: POOL_ADDRESS
    });
    console.log(`=====TX SEND CUSD=====`, res.txHash);
  }

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
