
import { ethers } from "hardhat";
import { Contract } from "ethers";
import "../../env-config";
import { run } from "hardhat";
import { TokenERC721, TokenERC721__factory } from "../../typechain";

const { utils, getSigners, getContractFactory, provider } = ethers;
const { formatEther } = utils;
const {
    NODE_ENV = "bscTestnet"
} = process.env;

async function main() {

    const address = "0xD1aD31D7256b418271BfDE9468Bb55B5Cfb65c13";

    const tokenCt = new Contract(address, TokenERC721__factory.abi, provider) as TokenERC721;
    const [name, symbol, baseUrl] = await Promise.all([
        tokenCt.name(),
        tokenCt.symbol(),
        tokenCt.baseUrl(),
    ])
    const verifyData = {
        address,
        constructorArguments: [name, symbol, baseUrl],
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