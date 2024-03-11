import "../../env-config";
import { ethers } from "hardhat";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import configArgs from "./config-args";
import { delayTime } from "../@helpers/block-chain.helper";

const { utils, getSigners, getContractFactory, provider } = ethers;
const { formatEther } = utils;

const {
  NODE_ENV,
  NETWORK_PROVIDER,
  royaltyAddress,
  crawlFee,
  mintFee,
  percentShareCrawler,
} = configArgs;

async function main() {
  const contractName = "FeedAgg";
  const output: any = {};
  const [deployer] = await getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  const balance = await deployer.getBalance();
  console.log("Account balance:", formatEther(balance));
  Object.assign(output, {
    DEPLOYER_ADDRESS: deployer.address,
  });

  const tokenFactory = await getContractFactory(contractName);

  const params = {};
  if (NODE_ENV === "maticMainnet") {
    const estimateGas = await provider.getGasPrice();
    const tokenCt = await (tokenFactory as any).deploy(
      royaltyAddress,
      crawlFee,
      mintFee,
      percentShareCrawler,
      {
        maxFeePerGas: estimateGas.toNumber() + 50000000000,
        maxPriorityFeePerGas: estimateGas.toNumber() + 20000000000,
      }
    );
    await tokenCt.deployed();

    console.log(`${contractName} deployed to:`, tokenCt.address);
    const linkDeploy =
      `${NETWORK_PROVIDER.URL_SCAN}/address/${tokenCt.address}`.trim();
    console.log("--------linkDeploy-----------");
    console.log(linkDeploy);
    console.log("-------------------");
    Object.assign(output, {
      TOKEN_ADDRESS: tokenCt.address,
      verifyData: {
        address: tokenCt.address,
        constructorArguments: [
          royaltyAddress,
          crawlFee,
          mintFee,
          percentShareCrawler,
        ],
        contract: `contracts/${contractName}.sol:${contractName}`.trim(),
      },
    });

    try {
      const fileName = "deploy.json";
      const dir = join(__dirname, `./outputs/${NODE_ENV}`);

      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }

      const filePath = join(dir, fileName);
      writeFileSync(filePath, JSON.stringify(output));
      await delayTime();
    } catch (error) {}
    return;
  }

  const tokenCt = await tokenFactory.deploy(
    royaltyAddress,
    crawlFee,
    mintFee,
    percentShareCrawler
  );

  await tokenCt.deployed();

  console.log(`${contractName} deployed to:`, tokenCt.address);
  const linkDeploy =
    `${NETWORK_PROVIDER.URL_SCAN}/address/${tokenCt.address}`.trim();
  console.log("--------linkDeploy-----------");
  console.log(linkDeploy);
  console.log("-------------------");
  Object.assign(output, {
    TOKEN_ADDRESS: tokenCt.address,
    verifyData: {
      address: tokenCt.address,
      constructorArguments: [
        royaltyAddress,
        crawlFee,
        mintFee,
        percentShareCrawler,
      ],
      contract: `contracts/${contractName}.sol:${contractName}`.trim(),
    },
  });

  try {
    const fileName = "deploy.json";
    const dir = join(__dirname, `./outputs/${NODE_ENV}`);

    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }

    const filePath = join(dir, fileName);
    writeFileSync(filePath, JSON.stringify(output));
    await delayTime();
  } catch (error) {}
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
