import "../../env-config";
import { ethers } from "hardhat";
import configArgs from "./config-args";
import { Contract } from "ethers";
import { MintNftFactoryV2, MintNftFactoryV2__factory } from "../../typechain";
import { formatAmountToken } from "../@helpers/block-chain.helper";

const { utils, getSigners, getContractFactory, provider } = ethers;
const { formatEther } = utils;

const { NODE_ENV, NETWORK_PROVIDER, royaltyAddress, royaltyFee } = configArgs;

async function main() {
  const output: any = {};
  const [deployer] = await getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  const balance = await deployer.getBalance();
  console.log("Account balance:", formatEther(balance));
  const {
    TOKEN_ADDRESS: POOL_ADDRESS,
  } = require(`./outputs/${NODE_ENV}/deploy.json`);
  const poolCt = new Contract(
    POOL_ADDRESS,
    MintNftFactoryV2__factory.abi,
    provider
  ) as MintNftFactoryV2;

  console.log(`=====royaltyFee=====`, formatAmountToken(royaltyFee));

  const { transactionHash } = await (
    await poolCt.connect(deployer).changeRoyaltyFee(royaltyFee)
  ).wait();
  const txLink = `${NETWORK_PROVIDER.URL_SCAN}/tx/${transactionHash}`.trim();
  console.log("--------txLink-----------");
  console.log(txLink);
  console.log("-------------------");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
