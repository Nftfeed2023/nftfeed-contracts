import { stringDateToUTCDate } from "../../../@helpers/block-chain.helper";


const rawData = [
    {
        "name": "NFTFeed's Internal Testnet for Next-Gen NFT Liquidity",
        "address": "0xeb5151b6ef125ef9c96cb81bad8b7dfa8a0f2c1c",
        "tokenId": "",
        "chainName": "OP",
        "chainId": 10,
        "tokenType": "ERC721"
    },
    {
        "name": "Internal Testnet Guideline",
        "address": "0x49650f943f3aa9a12661dcadc1e191071d0f3cd4",
        "tokenId": "",
        "chainName": "OP",
        "chainId": 10,
        "tokenType": "ERC721"
    },
    {
        "name": "Azuki NFT floor dumps 45% What is the a problem",
        "address": "0xfe7a77a2c4926f622a70b261aee5869fc9934311",
        "tokenId": "",
        "chainName": "OP",
        "chainId": 10,
        "tokenType": "ERC721"
    },
    {
        "name": "NFTFeed Unveils Exciting Upcoming Activities for July 2023",
        "address": "0x8285fd7d1ea24e6d7e77c2e428aba211daa06ae6",
        "tokenId": "",
        "chainName": "OP",
        "chainId": 10,
        "tokenType": "ERC721"
    },
    {
        "name": "Uncover #Layer2's hidden gems: Coin98's top airdrop projects revealed!",
        "address": "0x2116daa18f5bb19205ae480b68550bd117c164b8",
        "tokenId": "",
        "chainName": "OP",
        "chainId": 10,
        "tokenType": "ERC721"
    },
    {
        "name": "[ NFTFeed x Base Name Service] Giveaway of 5 Azuki Red Bean Radio NFT",
        "address": "0xf80940b3c5604c84899874af33d156ff9081903f",
        "tokenId": "",
        "chainName": "OP",
        "chainId": 10,
        "tokenType": "ERC721"
    },
    {
        "name": "Azuki's Preparation for Their 'Mistake'? 🧐",
        "address": "0x6EDebc40d727ED42e03F290b9FF556D1ECcD135C",
        "tokenId": "",
        "chainName": "OP",
        "chainId": 10,
        "tokenType": "ERC721"
    },
    {
        "name": "All about the benefit of NFTFeed Free Mint",
        "address": "0x151931e2e39cbbbd909cdc27a3986044d2920c72",
        "tokenId": "",
        "chainName": "OP",
        "chainId": 10,
        "tokenType": "ERC721"
    },
    {
        "name": "NFTFeed Partners with Bitgert Chain: Unlocking New Possibilities in the Blockchain World",
        "address": "0x33a451260de3931e31509674682068fab0e6e477",
        "tokenId": "",
        "chainName": "OP",
        "chainId": 10,
        "tokenType": "ERC721"
    },
    {
        "name": "NFTFeed Multiverse - Bitgert",
        "address": "0x42D126090fd6985a43b8551DC5D77b95BE14B262",
        "tokenId": 0,
        "chainName": "OP",
        "chainId": 10,
        "tokenType": "ERC1155"
    },
    {
        "name": "[NFTFeed x Bee Network] Partnership giveaway",
        "address": "0x504153ce2b6a0a9eff1d199c5947c31fdba9dae9",
        "tokenId": "",
        "chainName": "OP",
        "chainId": 10,
        "tokenType": "ERC721"
    },
    {
        "name": "Base Supporters",
        "address": "0x3e4b65cdf610d43bca81b88fe17b139501abf864",
        "tokenId": 0,
        "chainName": "OP",
        "chainId": 10,
        "tokenType": "ERC1155"
    },
    {
        "name": "Base Fren",
        "address": "0x3e4b65cdf610d43bca81b88fe17b139501abf864",
        "tokenId": 3,
        "chainName": "OP",
        "chainId": 10,
        "tokenType": "ERC1155"
    },
    {
        "name": "OAT on Galxe Poly Gon",
        "address": "0x5D666F215a85B87Cb042D59662A7ecd2C8Cc44e6",
        "tokenId": "",
        "chainName": "Polygon",
        "chainId": 137,
        "tokenType": "ERC721"
    },
    {
        "name": "OAT on Galxe OP",
        "address": "0xb20B4aC5cEC52fB65D3ef0CC74aF5875fF646bdF",
        "tokenId": "",
        "chainName": "OP",
        "chainId": 10,
        "tokenType": "ERC721"
    },
    {
        "name": "NFT on QuestN OP",
        "address": "0xb277B4A9B07FFB66D49760c94dA06551bd64fece",
        "tokenId": "",
        "chainName": "OP",
        "chainId": 10,
        "tokenType": "ERC721"
    },
    {
        "name": "NFT on QuestN BNB",
        "address": "0xA1D09C9061AF5189d202818198c6825C0a5cC6E2",
        "tokenId": "",
        "chainName": "BNB",
        "chainId": 56,
        "tokenType": "ERC721"
    },
    {
        "name": "1000 NFT Dmission",
        "address": "CHƯA PHÁT",
        "tokenId": "",
        "chainName": "TBA",
        "chainId": "",
        "tokenType": "ERC721"
    },
    {
        "name": "NFTFeed Multiverse - REI Network",
        "address": "0x42D126090fd6985a43b8551DC5D77b95BE14B262",
        "tokenId": 1,
        "chainName": "OP",
        "chainId": 10,
        "tokenType": "ERC1155"
    },
    {
        "name": "",
        "address": "",
        "tokenId": "",
        "chainName": "",
        "chainId": "",
        "tokenType": "ERC721"
    },
    {
        "name": "Airdrop hunting with NFTFeed project on the Path to Base Mainnet",
        "address": "0xFe318BaB34eb8d13BD4aD1cC66eFC4f10f69801F",
        "tokenId": "",
        "chainName": "OP",
        "chainId": 10,
        "tokenType": "ERC721"
    },
    {
        "name": "",
        "address": "",
        "tokenId": "",
        "chainName": "",
        "chainId": "",
        "tokenType": "ERC721"
    },
    {
        "name": "Base Surfer",
        "address": "0x98c74ca62df61d3de266237fa02df058d909d9eb",
        "tokenId": "",
        "chainName": "OP",
        "chainId": 10,
        "tokenType": "ERC721"
    },
    {
        "name": "Basebie Shark",
        "address": "0x7f1fc5d87f51dc178f9e883b02cada85056f47bb",
        "tokenId": "",
        "chainName": "OP",
        "chainId": 10,
        "tokenType": "ERC721"
    },
    {
        "name": "All Your NFTFeed Are Belong To You",
        "address": "0xFBD2F3DDC31738119baaC0ee975b15388C7A7853",
        "tokenId": 0,
        "chainName": "OP",
        "chainId": 10,
        "tokenType": "ERC1155"
    }
]

export const params = rawData
    .filter(v => v.address)
    .filter(v => v.chainId === 10 && v.tokenType === "ERC721")
    .map(({ address, }) => ({
        nftAddress: address,
        daysLocked: 30,
        startTime: Math.floor(stringDateToUTCDate("2023/07/31 00:00:00").getTime() / 1000),
        endTime: Math.floor(stringDateToUTCDate("2023/09/10 00:00:00").getTime() / 1000),
    }));

