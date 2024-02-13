import "../env-config";
import { Contract } from "ethers";

import { ethers, run } from "hardhat";
import { ERC404Template, ERC404Template__factory } from "../typechain";
import { formatAmountToken } from "./@helpers/block-chain.helper";
const { utils, getSigners, getContractFactory, provider } = ethers;
const { NODE_ENV = "bscTestnet" } = process.env;

async function main() {
  const address = "0xf3b4851441A51bc7DB70e5bE14D755b885796527";

  const tokenCt = new Contract(
    address,
    ERC404Template__factory.abi,
    provider
  ) as ERC404Template;
  const [name, symbol, totalSupply, baseUrl, owner] = await Promise.all([
    tokenCt.name(),
    tokenCt.symbol(),
    tokenCt.totalSupply().then((t) => Number(formatAmountToken(t))),
    tokenCt.baseUrl(),
    tokenCt.owner(),
  ]);

  console.log(`-------------------`);
  console.log({
    name,
    symbol,
    totalSupply,
    baseUrl,
    owner,
  });
  console.log(`-------------------`);

  const verifyData = {
    address,
    constructorArguments: [name, symbol, totalSupply, baseUrl, owner],
    contract: "contracts/ERC404Template.sol:ERC404Template",
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
