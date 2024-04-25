import "../../env-config";
import { ethers } from "hardhat";
import configArgs from "./config-args";
import { Contract } from "ethers";
import { SocialVault, SocialVault__factory } from "../../typechain";
import { formatAmountToken } from "../@helpers/block-chain.helper";

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

  const collectionAddress = "0xe857f29653a2e22bf7862688821703b60a750680";
  const users = [
    "0x072BcaaD73D640912E63F04d71A98F18433aA306"
  ];
  const { transactionHash } = await (
    await poolCt.connect(deployer).finalize(collectionAddress, users)
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
