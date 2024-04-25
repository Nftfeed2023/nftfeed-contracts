import "../env-config";
import { ethers, run } from "hardhat";

import { configEnv } from "./@config";
import {
  formatAmountToken,
  parseAmountToken,
  readTextToJson,
} from "./@helpers/block-chain.helper";
import { Contract } from "ethers";
import {
  ERC20,
  ERC20__factory,
  PresaleFairLaunchTemplateV1,
  PresaleFairLaunchTemplateV1__factory,
  TokenTool,
  TokenTool__factory,
} from "../typechain";
import { provider } from "./@helpers/tools.helper";
import { isAddress } from "ethers/lib/utils";

const { utils, constants, getSigners, getContractFactory } = ethers;
const { formatEther } = utils;
const { MaxUint256, Zero, AddressZero, HashZero } = constants;
const { NODE_ENV = "bscTestnet", ROYALTY_ADDRESS = "" } = process.env;

const { TOKEN_ADDRESS, NETWORK_PROVIDER } = configEnv();
const { URL_SCAN } = NETWORK_PROVIDER;

async function main() {
  const output: any = {};
  const [deployer] = await getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  const balance = await deployer.getBalance();
  console.log("Account balance:", formatEther(balance));


  console.log(`-------------------`);
  console.log({
    amount: parseAmountToken(50, 6).toString()
  });
  console.log(`-------------------`);

  // const tokenAddress = "0x03d8a7ad755e5645145d0a7c3cfd0dcf5f52df8c";

  // const tokenToolAddress = "0x39639eCe70A2EC67E627262f0bFc9C6eF60804A4";

  // const tokenCt = new Contract(
  //   tokenAddress,
  //   ERC20__factory.abi,
  //   provider
  // ) as ERC20;

  // const tokenToolCt = new Contract(
  //   tokenToolAddress,
  //   TokenTool__factory.abi,
  //   provider
  // ) as TokenTool;

  // const total = await tokenCt.totalSupply();
  // console.log(`-------------------`);
  // console.log(formatAmountToken(total));
  // console.log(`-------------------`);

  // //   {
  // //     const { transactionHash } = await (
  // //       await tokenCt.connect(deployer).approve(tokenToolAddress, total)
  // //     ).wait();
  // //     console.log(`=====Approve=====`, transactionHash);
  // //   }

  // {
  //   const inputs = (await readTextToJson({
  //     pathFile: "./inputs/raw.txt",
  //     keyIndexObj: ["walletAddress", "amount"],
  //   })) as { walletAddress: string; amount: string }[];

  //   const data = inputs.filter((v) => isAddress(v.walletAddress));

  //   const step = 250;

  //   for (let index = 751; index < data.length; index += step) {
  //     const inputSteps = data.slice(index, index + step);
  //     const tos = inputSteps.map((v) => v.walletAddress);
  //     const amounts = inputSteps.map((v) => parseAmountToken(v.amount));
  //     const { transactionHash } = await (
  //       await tokenToolCt
  //         .connect(deployer)
  //         .batchTransferErc20(tokenAddress, tos, amounts)
  //     ).wait();
  //     console.log(
  //       `=====batchTransferErc20 step: ${index} => ${index + step}=====`,
  //       transactionHash
  //     );
  //   }
  // }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// [1,2,3,4,5,6,7,8,9,10]
