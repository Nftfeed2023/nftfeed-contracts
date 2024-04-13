import "../../env-config";
import { ethers } from "hardhat";
import configArgs from "./config-args";
import { Contract } from "ethers";
import { SocialVault, SocialVault__factory } from "../../typechain";
import { formatAmountToken } from "../@helpers/block-chain.helper";

const { utils, getSigners, getContractFactory, provider } = ethers;
const { formatEther } = utils;

const { NODE_ENV, NETWORK_PROVIDER, royaltyAddress } = configArgs;

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

  const collectionAddress = "0x79351cfaa005f3d01658547fb37301a9f42dd4ed";
  const users = [
    "0x782a70e14766a8e8f89704e3522d6aa3125f71eb",
    "0x4bcb10f6084deb7b902349082d378dd3c7133010",
    "0x072BcaaD73D640912E63F04d71A98F18433aA306",
    "0x668ae12b8d14110204d791912606366ae848c85d",
    "0xd8fd57b26322945b0bdb23ed6be87e07c5c51662",
    "0xaefa34eed6dfde9d42e8b28954e63d4de90f74e3",
    "0x2d86f634042674cf0de727fe625b64e0dad32517",
    "0x552eb4e4aa693d61d342d05dcd8d09826d41955f",
    "0xa68c30d2d6da1d0f6fc9d68a21c458b7b3c1ffdd",
    "0x43d6d40fc854752d05959c495b69bc47dd59eb12",
    "0x072BcaaD73D640912E63F04d71A98F18433aA306",
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
