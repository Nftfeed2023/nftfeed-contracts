import "../env-config";
import { Contract } from "ethers";

import { ethers, run } from "hardhat";
import { ERC721Template, ERC721Template__factory } from "../typechain";
import { formatAmountToken } from "./@helpers/block-chain.helper";
const { utils, getSigners, getContractFactory, provider } = ethers;
const { NODE_ENV = "bscTestnet" } = process.env;

async function main() {
  const address = "0xC18C34d495531DCFfC0DB578175d74Ab3723EeA1";

  // string memory _name,
  // string memory _symbol,
  // string memory _baseUrl

  const tokenCt = new Contract(
    address,
    ERC721Template__factory.abi,
    provider
  ) as ERC721Template;
  const [name, symbol, baseUrl] = await Promise.all([
    tokenCt.name(),
    tokenCt.symbol(),
    tokenCt.baseUrl(),
  ]);

  console.log(`-------------------`);
  console.log({
    name,
    symbol,
    baseUrl,
  });
  console.log(`-------------------`);

  const verifyData = {
    address,
    constructorArguments: [name, symbol, baseUrl],
    contract: "contracts/ERC721Template.sol:ERC721Template",
  };

  try {
    console.log("--------verify-----------");
    await run("verify:verify", {
      ...verifyData,
    });
  } catch (error) {
    console.log("---------Verify error----------");
    console.log(error);
    console.log("-------------------");
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
