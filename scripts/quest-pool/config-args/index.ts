import { BigNumber } from "ethers";
import { configEnv } from "../../@config";
import { parseAmountToken } from "../../@helpers/block-chain.helper";

const {
    NODE_ENV = "bscTestnet",
} = process.env;

const { NETWORK_PROVIDER, TOKEN_ADDRESS, DEX_CONTRACT } = configEnv();

const QUESTS = [
    {
        id: "",
        name: "Twitter Shark Role - Twitter follow 🌈",
        link: "https://zealy.io/c/nftfeed/questboard/e97ceee8-d1cc-4d8b-8ca4-f2bc07a883a5",
        amount: 10000
    },
    {
        id: "",
        name: "Shark Fan Role 🐦",
        link: "https://zealy.io/c/nftfeed/questboard/5f18338f-9fc4-498e-bb3e-b3e7deb05536",
        amount: 10000
    },
    {
        id: "",
        name: "[Sharkie] Sharktist Role 🧑\u200d🎨",
        link: "https://zealy.io/c/nftfeed/questboard/2f78a9b5-7d34-4af3-866d-2a4342ae0cfe",
        amount: 40000
    },
    {
        id: "",
        name: "[Sharkie] Sharkreator Role 🧑\u200d💻",
        link: "https://zealy.io/c/nftfeed/questboard/7e5a193a-e9ee-4f7c-8b86-bbf172d1e56d",
        amount: 40000
    },
    {
        id: "",
        name: "[Sharkie] Sharkt The Feed Role 👨\u200d🔧",
        link: "https://zealy.io/c/nftfeed/questboard/6d2af88d-0ad7-4226-a6a2-5537ccf469a9",
        amount: 40000
    }
].map(v => ({ ...v, id: v.link.replace("https://zealy.io/c/nftfeed/questboard/", "").trim() }))
    .map(v => ({ ...v, amount: parseAmountToken(v.amount) }));

QUESTS.push({
    id: "bonus_quest_1200xp",
    name: " 🎁 Reach 1,200 XP - Bonus 💵 DOO DOO",
    link: "",
    amount: parseAmountToken(240000)
});

export default {
    NODE_ENV,
    NETWORK_PROVIDER,
    TOKEN_ADDRESS,
    DEX_CONTRACT,
    QUESTS
}