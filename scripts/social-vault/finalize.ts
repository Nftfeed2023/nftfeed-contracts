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

  const collectionAddress = "0x4134fd50cd9f5cb276a326721fa8a0ab98680a77";
  const users = [
    "0x072BcaaD73D640912E63F04d71A98F18433aA306".trim(),
    "0xbe5b1afae3d69e0b193e18ba75ea27e45af9d681".trim(),
    "0xbc0ee07f70bfdcb17de9b2c75531611f1437180c".trim(),
    "0xdf1448d858ef7a091202733e9d810ed0fc1b5d25".trim(),
    "0xb68a2696c6f325f2ee87e06b3b8b20b9e6cfc722".trim(),
    "0x45ee6aae03d2b261a5c980f16e41bc8f1f0e9551".trim(),
    "0xaaa080ecac0bd5c978ff012f7c9386e87ad98336".trim(),
    "0x9999c6ba5111604e7e3e4b08577686e28b29c39d".trim(),
    "0x027e3df736a4eeba03395110327ffd2d2270f02b".trim(),
    "0xc8be8bc0e266840005d3528e471c998de93479e3".trim(),
    "0x07fd8d5418fecebc36f4168ad77a8ddff2e1520d".trim(),
    "0x38746e4154844558ff71185bfcc4a20c23283d22".trim(),
    "0x0d50bb5b6bcecc8a51898defbe2e9a89a82fea0a".trim(),
    "0xa865a0338b404ce2def97f9604ff134f78b160b0".trim(),
    "0x09b84784d76bed5ff07a3c38398c548182fa591c".trim(),
    "0x46d14fcdf5c872e6b5aa2ba6c63309dea7d6c9cc".trim(),
    "0x09f9b99715ce7ce972728c321eb9e66e687bfeb1".trim(),
    "0x4822834930f7a7c500f45cb4b7937d679a502670".trim(),
    "0x62ac9ed65f2c27c6b7e7654bf280e26630730fd5".trim(),
    "0x3be97753da3d70678f5181fc7eacb6b70c72e22c".trim(),
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
