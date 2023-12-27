
import "../env-config";
import { Contract } from "ethers";

import { ethers, run } from "hardhat";
import { ERC721Template, ERC721Template__factory } from "../typechain";
const { utils, getSigners, getContractFactory, provider } = ethers;
const {
    NODE_ENV = "bscTestnet"
} = process.env;

async function main() {
    const address = "0x56e5ed3d7c91fa3a556ac702c9c1767eec74b590";

    const nftCt = new Contract(
        address,
        ERC721Template__factory.abi,
        provider
    ) as ERC721Template;
    const [
        name,
        symbol,
        baseUrl
    ] = await Promise.all([
        nftCt.name(),
        nftCt.symbol(),
        nftCt.baseUrl()
    ]);


    console.log(`-------------------`);
    console.log({
        name,
        symbol,
        baseUrl
    });
    console.log(`-------------------`);

    const verifyData = {
        address,
        constructorArguments: [
            name,
            symbol,
            baseUrl
        ],
        contract: "contracts/ERC721Template.sol:ERC721Template"
    }

    try {
        console.log('--------verify-----------');
        await run("verify:verify", {
            ...verifyData
        });
    } catch (error) {
        console.log('---------Verify error----------');
        console.log(error);
        console.log('-------------------');
    }
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});