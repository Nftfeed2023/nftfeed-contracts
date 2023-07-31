import "../../env-config";
import { run } from "hardhat";

const {
    NODE_ENV = "bscTestnet"
} = process.env;

async function main() {
    const { verifyData } = require(`./outputs/${NODE_ENV}/deploy.json`);

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