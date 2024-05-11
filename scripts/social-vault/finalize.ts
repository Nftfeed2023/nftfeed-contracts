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

  const collectionAddress = "0x5938362da72af8b8e8ac39ed7ff184f075fb7734";
  const users = [
    "0x22880225192c602b5caac4e5a202ab020f7b68e2".trim(),
    "0x95e74c000e214ab8a63b78d10c009db9c456ac2a".trim(),
    "0x3bbc0286571f155c02b480df2dbe9f133866b73a".trim(),
    "0x072BcaaD73D640912E63F04d71A98F18433aA306".trim(),
    "0x6597eddfc40ccc8582115fdb8226b285df0c3256".trim(),
    "0x1db75df0dd4c552b4d3642a20f3172d09d1ea10c".trim(),
    "0x5ea8d52351f390c282bb18e48de317d63c0a3525".trim(),
    "0x4658546a96dd2f78c385138f7493d30884c8ae05".trim(),
    "0x389b4c9a4e6ddc5cd0805ced1f7f4fba78d4cfe5".trim(),
    "0x9c188D52D238660D82134DD8dcec861B51971E30".trim(),
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
