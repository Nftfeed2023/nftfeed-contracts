


import "../env-config";
import { ethers, network } from "hardhat";
import { writeFileSync } from "fs";
const { utils, constants, } = ethers;
const { parseEther, formatEther } = utils;
const { MaxUint256, Zero, AddressZero, HashZero } = constants;


const wallets = [];
async function main() {
    for (let i = 0; i < 200; i++) {
        const wallet = ethers.Wallet.createRandom();
        const address = wallet.address;
        const phrase = wallet.mnemonic.phrase;
        const privateKey = wallet.privateKey;
        wallets.push({
            address,
            phrase,
            privateKey
        });
    }
    try {
        const fileName = `./outputs/list.json`;
        writeFileSync(fileName, JSON.stringify(wallets));
        const fileNameAddress = `./outputs/list-address-${new Date().getTime()}.json`;
        writeFileSync(fileNameAddress, JSON.stringify(wallets.map(v => {
            return {
                address: v.address
            }
        })));
    } catch (error) {

    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});


