import "../env-config";
import { ethers } from "hardhat";

import { configEnv } from "./@config";
import { BigNumber, Contract, Signer } from "ethers";
import {
  connectWallet,
  provider,
  sendMultipleNativeToken,
  sendMultipleToken,
} from "./@helpers/tools.helper";
import {
  dateStrToSeconds,
  delayTime,
  parseAmountToken,
  stringDateToUTCDate,
} from "./@helpers/block-chain.helper";
import {
  BatchTransferTool,
  BatchTransferTool__factory,
  ERC1155__factory,
  ERC20,
  ERC20__factory,
  ERC721,
  ERC721Enumerable,
  ERC721Enumerable__factory,
  ERC721Template,
  ERC721Template__factory,
  ERC721__factory,
  FeedVault,
  FeedVault__factory,
  MintNftFactory,
  MintNftFactoryV2,
  MintNftFactoryV2__factory,
  MintNftFactory__factory,
  StakeMultipleERC721,
  StakeMultipleERC721__factory,
  StakeNftAutoApy,
  StakeNftAutoApy__factory,
  StakeNftFactory,
  StakeNftFactory__factory,
  TokenERC721,
  TokenERC721__factory,
} from "../typechain";
import { dir } from "console";
import { writeFileSync } from "fs";
import { join } from "path";
import { isAddress } from "ethers/lib/utils";
import axios from "axios";

const { utils, constants, getSigners, getContractFactory } = ethers;
const { formatEther } = utils;
const { MaxUint256, Zero, AddressZero, HashZero } = constants;
const { NODE_ENV = "bscTestnet" } = process.env;

const { TOKEN_ADDRESS, NETWORK_PROVIDER } = configEnv();
const { URL_SCAN } = NETWORK_PROVIDER;

async function main() {
  const output: any = {};
  const [deployer] = await getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  const balance = await deployer.getBalance();
  console.log("Account balance:", formatEther(balance));

  const contractAddress = "0xFC059429122D9334d0A1A2d5C41484E5fC2DEC34";
  const operatorAddress = "0x4A499535998e6CeAbDbcd3792B92737B9d41b59A";
  const callApi01 = async ({ contractAddress, operatorAddress }) => {
    let data = JSON.stringify({
      contractAddress,
      operatorAddress,
    });

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: "https://waitlist-api.develop.testblast.io/v1/dapp-auth/challenge",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      data: data,
    } as any;

    const { challengeData, message, success } = await axios
      .request(config)
      .then((response) => response.data);
    return {
      challengeData,
      message,
      success,
    };
  };
  const { message, challengeData } = await callApi01({
    contractAddress,
    operatorAddress,
  });
  console.log(`-------------------`);
  console.log({ message });
  console.log(`-------------------`);
  const signature = await deployer.signMessage(message);
  console.log(`-------------------`);
  console.log(JSON.stringify({ signature, challengeData }));
  console.log(`-------------------`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// [1,2,3,4,5,6,7,8,9,10]
