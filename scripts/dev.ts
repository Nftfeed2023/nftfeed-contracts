import "../env-config";
import { ethers } from "hardhat";

import { configEnv } from "./@config";
import { BigNumber, Contract } from "ethers";
import { connectWallet, provider, sendMultipleNativeToken, sendMultipleToken } from "./@helpers/tools.helper";
import { dateStrToSeconds, delayTime, parseAmountToken, stringDateToUTCDate } from "./@helpers/block-chain.helper";
import { BatchTransferTool, BatchTransferTool__factory, ERC1155__factory, ERC20, ERC20__factory, ERC721, ERC721Enumerable, ERC721Enumerable__factory, ERC721Template, ERC721Template__factory, ERC721__factory, FeedVault, FeedVault__factory, MintNftFactory, MintNftFactoryV2, MintNftFactoryV2__factory, MintNftFactory__factory, StakeMultipleERC721, StakeMultipleERC721__factory, StakeNftAutoApy, StakeNftAutoApy__factory, StakeNftFactory, StakeNftFactory__factory, TokenERC721, TokenERC721__factory } from "../typechain";
import { dir } from "console";
import { writeFileSync } from "fs";
import { join } from "path";
import { isAddress } from "ethers/lib/utils";

const { utils, constants, getSigners, getContractFactory } = ethers;
const { formatEther } = utils;
const { MaxUint256, Zero, AddressZero, HashZero } = constants;
const {
    NODE_ENV = "bscTestnet",
} = process.env;


const { TOKEN_ADDRESS, NETWORK_PROVIDER } = configEnv();
const { URL_SCAN } = NETWORK_PROVIDER;


async function main() {

    const output: any = {};
    const [deployer] = await getSigners();

    console.log("Deploying contracts with the account:", deployer.address);
    const balance = await deployer.getBalance();
    console.log("Account balance:", formatEther(balance));

    const to = [
        {
            "walletAddress": "0x85BC61fFDE0D3b7744b6aA34D2ac03000C6Ed252"
        },
        {
            "walletAddress": "0xC106D3DF35d3eef7f6B0e532678d173153F0Bc76"
        },
        {
            "walletAddress": "0xf2088FbDDD6D470962673E4e2883d4401abCD41a"
        },
        {
            "walletAddress": "0xe78DDdC81A215491e9F106c2B48bCDF45DA98ED5"
        },
        {
            "walletAddress": "0x34128D1aD2bCC168CC2a2543839c0a968613CcB3"
        },
        {
            "walletAddress": "0x3ce1A71383c7651d4770D5f4fDD5606Dc2E4dd1a"
        },
        {
            "walletAddress": "0xC971675a24549DC433bA1a597CC5690CaA19a8E4"
        },
        {
            "walletAddress": "0x9891939FB8aFbb551842b73e95873D3d9d4E99fE"
        },
        {
            "walletAddress": "0xe5932c05ba5b01b8dba06e8d24886d231fde2a95"
        },
        {
            "walletAddress": "0x17B87DF0E4E456231B89DB67cdcfC4e9409FF137"
        },
        {
            "walletAddress": "0x2C66C98a2c12e9B89c0EA4E4EB44E30434010818"
        },
        {
            "walletAddress": "0x5785523D831e155E38e5b94512E62E594e30D97a"
        },
        {
            "walletAddress": "0x1D6F1ca839fB04c85CB0328C65faF23C6d9AFC8E"
        },
        {
            "walletAddress": "0x30b25eaac7f8b28784af6c970447552d5c14fd1e"
        },
        {
            "walletAddress": "0x931c061d492df34634b7A4F759bfE8c641bcB838"
        },
        {
            "walletAddress": "0xfCCf912650fBF5088058245c391AeC1c1a24634c"
        },
        {
            "walletAddress": "0x5d96816b17815cE4eDd2CF5B9914181379A73101"
        },
        {
            "walletAddress": "0xD3Da608A480DFF7807E23aEf06C1b2A8699A5462"
        },
        {
            "walletAddress": "0xE4a4799D844FeD536A7d38A3Cf9962d2AF7fFBE6"
        },
        {
            "walletAddress": "0x0f522c63A7bd9C16ba5E64E294A85D5c1E752925"
        },
        {
            "walletAddress": "0x9E97d5cE664864700590eF45EE153B4557DDD4f5"
        },
        {
            "walletAddress": "0x24b087b080D5AD6748bF5d442853e0B44F1BB5be"
        },
        {
            "walletAddress": "0x443c8B4CD6cF5733a31f589a9D4fD0D865dd0295"
        },
        {
            "walletAddress": "0x1a9a2568bFdF3CE1608D45C42c10bf0F096DF959"
        },
        {
            "walletAddress": "0x2067CeA9386e4648573ED87B919B001880Db957b"
        },
        {
            "walletAddress": "0xf9178e809CEFaF2b219787336650A31552e52d5f"
        },
        {
            "walletAddress": "0x29744bD7B37bDe14F74d281D3BAdBE68b299Be5f"
        },
        {
            "walletAddress": "0xD01B1f80b82A18649aA6de07053E039d895266c0"
        },
        {
            "walletAddress": "0xCF014e32adc222e213bc7f4A3C8550D057B96477"
        },
        {
            "walletAddress": "0x7a5978AE8328623BedE384D94Cfa366b4cB471D6"
        },
        {
            "walletAddress": "0x88ef3f79c3663315Bd7E647122b1b27b3ef796cc"
        },
        {
            "walletAddress": "0x50D96D65daf6DAa8b340BaE417d649CdaEAce71e"
        },
        {
            "walletAddress": "0x3d492812e28bf53288C3F5Af6B986f23BcF5677e"
        },
        {
            "walletAddress": "0x03C667EdadB36a1792647775dF87F1dAd2EB59BE"
        },
        {
            "walletAddress": "0x9c40fd368eCBceFa40ea497Df1f896EEd5FC97Be"
        },
        {
            "walletAddress": "0xC3CAa17abf2526a64Dead8436f82f9CB13580409"
        },
        {
            "walletAddress": "0xcF9B4b8088B64064e39914bC89Cb873dFAfC02a1"
        },
        {
            "walletAddress": "0x577BB841A3983da7b0702Cfd246f30e370BfB6e5"
        },
        {
            "walletAddress": "0x1a527037A779afC5847E0723f267a8FB0b7367cE"
        },
        {
            "walletAddress": "0x067e2e8526b8a93087519365962a608b2269ae7c"
        },
        {
            "walletAddress": "0x0dff98053ef265671fcfcf1d71dfdc17001454eb"
        },
        {
            "walletAddress": "0x11d01557afaa940937b45131d391412ddd180005"
        },
        {
            "walletAddress": "0x2f9368d7a8bd850c8235d6da6cddbd31cb68c332"
        },
        {
            "walletAddress": "0x5dc20a53b132815e238d63ad8a5401c9bfa04632"
        },
        {
            "walletAddress": "0xa4555A0eEF85085142215A2155F771A3da9659B0"
        },
        {
            "walletAddress": "0x7E5254201208765c57ED470fe8C9d4896f72eEa2"
        },
        {
            "walletAddress": "0x66969c8AD4e2393cC4C7F22C295D9e0622692947"
        },
        {
            "walletAddress": "0x50839E3f64D90b1131c2A6d5e47D8B88741971bF"
        },
        {
            "walletAddress": "0xC83e06367DD065dd4799A21CBa095d9bbF110BA5"
        },
        {
            "walletAddress": "0xaefa4e13f07db633a2ca6eb6e700b00c632b816b"
        },
        {
            "walletAddress": "0xaefecc9e5b0d47f37808c191a83bfc266c005fd9"
        },
        {
            "walletAddress": "0xaf05da13de666da6a31f75df8f2e58b8f950d958"
        },
        {
            "walletAddress": "0xaf23ee86a9e61051f3c3d0485c86066f68a0702e"
        },
        {
            "walletAddress": "0xaf2a7b4382bf83a22d3b97d5fc725f68e1ed9806"
        },
        {
            "walletAddress": "0xaf3d97f4450720f9027a4ea2a7adf1f5dd358a17"
        },
        {
            "walletAddress": "0xaf6adb966a6db512fac9606c9116aa42efdd534b"
        },
        {
            "walletAddress": "0xa8efbb8366bfb73a352297a57e7142f3b893e35e"
        },
        {
            "walletAddress": "0xa8fbf4f42e19c917ebd801461e98ad04555d68bd"
        },
        {
            "walletAddress": "0xa91e1b5b54d845acb57b5ae877bb5218fdfc8001"
        },
        {
            "walletAddress": "0x059bb7cacc79a53d8aae643260797f5c7174f3be"
        },
        {
            "walletAddress": "0x05b13bda016d8737447353877e08f4656a92f359"
        },
        {
            "walletAddress": "0x05c52c4505c2dd929df2109fdb262125b32dd28a"
        },
        {
            "walletAddress": "0x05c7703e6813f26fbfeea54139e010414e7e4f1b"
        },
        {
            "walletAddress": "0xf0ba61b2e00fc9d48552a7fb503c87451536cf58"
        },
        {
            "walletAddress": "0xf0c0cf061c38f1c5f8bc1efaedc866555a56f528"
        },
        {
            "walletAddress": "0xf0d98533521966212dea368580ff0ca61b0fdad9"
        },
        {
            "walletAddress": "0xf0ed8a8d66c870f391cb36fcf13dad3e4e59d329"
        },
        {
            "walletAddress": "0x0acf75e7c29bd27f1cd6ed47c8769c61bc6a6881"
        },
        {
            "walletAddress": "0x0ae4e24d1e34bfdd0bc8b02eccb163a3ee436a55"
        },
        {
            "walletAddress": "0x0af1dd36f81e2259aee150c85390fb29eaf844f5"
        },
        {
            "walletAddress": "0x0b32edd47f8e439c83868c4e58337e28807fad2c"
        },
        {
            "walletAddress": "0x0b38af48009a38da0eca1d456ccba56eb80153e6"
        },
        {
            "walletAddress": "0xb50ae2f4658b293cf45c3535d8d186638488bb09"
        },
        {
            "walletAddress": "0xe49bb06defde17dcf41bf1f15d2dbe2ca2461f84"
        },
        {
            "walletAddress": "0xe4b32e80b814071f8dbae21436ec3cc8451a018c"
        },
        {
            "walletAddress": "0xe4e3341864ea33e99168de61edb64781b432f06a"
        },
        {
            "walletAddress": "0xe4ec41aebdb4e33c3a85e5b6db72772b906ab88a"
        },
        {
            "walletAddress": "0xe4fae50d6442366436e0b8edeed91186b310759d"
        },
        {
            "walletAddress": "0xa1aff0687bc208b5ecca9071e02756020ceb8878"
        },
        {
            "walletAddress": "0x0c4c3a174c93d32c11b250b71c6bb7b3e4c33c26"
        },
        {
            "walletAddress": "0x0c727dc077b4657ae62d7c6549052c405b5bdcff"
        },
        {
            "walletAddress": "0x0c74f59d7a8dd734197c53d02a09be33d01e9673"
        },
        {
            "walletAddress": "0xdd7cef9d220d9f88af5e5afc6f2fe4a15eca257e"
        },
        {
            "walletAddress": "0xdd9d200cea20d5e0de58f48abe5d22636397c958"
        },
        {
            "walletAddress": "0xddb3badd7a311239527e5b9b19691b8094a2655c"
        },
        {
            "walletAddress": "0xa34cf0ce061627685036766c5a9f96a8946efa76"
        },
        {
            "walletAddress": "0xa38005879daff0c35ca8c726764e020fd07ce16e"
        },
        {
            "walletAddress": "0xa3b79ced2bd0aea1fa4ef1231d65d0ace9185db3"
        },
        {
            "walletAddress": "0xba94f67374bb80debdb62393485ebca62873e5a0"
        },
        {
            "walletAddress": "0xba96173579bdd0cb67b8eeeb5f97d13f4b701353"
        },
        {
            "walletAddress": "0xba97865f43150f66cdd772229452e0c44b335c7e"
        },
        {
            "walletAddress": "0xbac477c3b1921178352b9491eaf6200f287084fa"
        },
        {
            "walletAddress": "0x979f6ea4e5493eacda45887ed5597fecbe6cb5e6"
        },
        {
            "walletAddress": "0x97a4bef49cf84c1ccfbfee92fc8d5a8b8f0791a2"
        },
        {
            "walletAddress": "0x322fb9f5d10d8df144c06d07d0efbac641425b57"
        },
        {
            "walletAddress": "0xca50f2e530a33b68c9e8259801ff96d4b0f6458f"
        },
        {
            "walletAddress": "0xca56edc999cc7abf4cb74983d23bf783c7c9a96f"
        },
        {
            "walletAddress": "0xca662659a54fd3e36cc2a113b7c2318842ed7010"
        },
        {
            "walletAddress": "0xca683e3837da531c27709bcb29f79470d831a84d"
        },
        {
            "walletAddress": "0xe0af1f369b6cffc46493ecf2606d3dc3693f283a"
        },
        {
            "walletAddress": "0x3011fe2f9c5c95a537ee46193075c3d8fe87ea05"
        },
        {
            "walletAddress": "0x80abed33e7a21ab06548edf525507dc8d50d8758"
        },
        {
            "walletAddress": "0xbaef7fe3eb720c1e463c03647c978f4d3cbbf920"
        },
        {
            "walletAddress": "0xEF242DD922f2598679945Cce316694F5F73E30c2"
        },
        {
            "walletAddress": "0x56A3CeC5fEaf674f814f509627cd42DA0990b2BE"
        }
    ].filter(v => isAddress(v.walletAddress));


    const nftAddress = "0x268174fF68633901A2EC6511b33c590aAC4Fe263";

    const toolAddress = "0xC5D9f31180579284eeB5f891dDc7b1c83eFfD63d";

    const toolCt = new Contract(toolAddress,
        BatchTransferTool__factory.abi, provider) as BatchTransferTool;

    const nftCt = new Contract(nftAddress,
        ERC721Template__factory.abi, provider) as ERC721Template;

    const sender = connectWallet("");


    const { data, total } = await nftCt.viewPageTokenIdsOfOwner(sender.address, 1, 200);

    const tokenIds = data.map(v => v.toNumber());

    console.log(`-------------------`);
    console.log({
        tokenIds: tokenIds.length,
        to: to.length
    });
    console.log(`-------------------`);


    if (tokenIds.length !== to.length) {
        throw new Error("Invalid size 2 array input")
    }

    const dataSends = tokenIds.map((tokenId, idx) => ({
        tokenId,
        walletAddress: to[idx].walletAddress
    }));

    // {

    //     console.log(`=====APPROVE=====`);
    //     const { transactionHash } = await (await nftCt.connect(sender).setApprovalForAll(toolAddress, true)).wait();
    //     console.log(`-------------------`);
    //     console.log({ transactionHash });
    //     console.log(`-------------------`);
    // }

    // {


    //     console.log(`=====SEND=====`);
    //     const { transactionHash } = await (await toolCt.connect(sender).sendMultipleErc721(
    //         nftAddress,
    //         dataSends.map(v => v.walletAddress),
    //         dataSends.map(v => v.tokenId)
    //     )).wait();
    //     console.log(`-------------------`);
    //     console.log({ transactionHash });
    //     console.log(`-------------------`);
    // }

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

// [1,2,3,4,5,6,7,8,9,10]