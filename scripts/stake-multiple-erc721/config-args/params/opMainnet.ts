import { stringDateToUTCDate } from "../../../@helpers/block-chain.helper";


const rawData = [
    // {
    //     "image": "https://mirror-media.imgix.net/publication-images/IEKl-j9GMB5uxe4FUGuWF.png?height=588&width=1176&h=588&w=1176&auto=compress",
    //     "name": "NFTFeed's Internal Testnet for Next-Gen NFT Liquidity",
    //     "address": "0xeb5151b6ef125ef9c96cb81bad8b7dfa8a0f2c1c",
    //     "tokenId": "",
    //     "chainName": "OP",
    //     "chainId": 10,
    //     "tokenType": "ERC721"
    // },
    // {
    //     "image": "https://mirror-media.imgix.net/publication-images/flVHMvnMC3NBr1c9qAF5w.png?height=611&width=1221&h=611&w=1221&auto=compress",
    //     "name": "Internal Testnet Guideline",
    //     "address": "0x49650f943f3aa9a12661dcadc1e191071d0f3cd4",
    //     "tokenId": "",
    //     "chainName": "OP",
    //     "chainId": 10,
    //     "tokenType": "ERC721"
    // },
    // {
    //     "image": "https://mirror-media.imgix.net/publication-images/gb6HEqmAB1nrzbjw6aC9g.jpeg?height=611&width=1221&h=611&w=1221&auto=compress",
    //     "name": "Azuki NFT floor dumps 45% What is the a problem",
    //     "address": "0xfe7a77a2c4926f622a70b261aee5869fc9934311",
    //     "tokenId": "",
    //     "chainName": "OP",
    //     "chainId": 10,
    //     "tokenType": "ERC721"
    // },
    // {
    //     "image": "https://mirror-media.imgix.net/publication-images/FKpgU5v3G76g-7NbDLcpR.png?height=611&width=1221&h=611&w=1221&auto=compress",
    //     "name": "NFTFeed Unveils Exciting Upcoming Activities for July 2023",
    //     "address": "0x8285fd7d1ea24e6d7e77c2e428aba211daa06ae6",
    //     "tokenId": "",
    //     "chainName": "OP",
    //     "chainId": 10,
    //     "tokenType": "ERC721"
    // },
    // {
    //     "image": "https://mirror-media.imgix.net/publication-images/HbEoucNYAMqvAOBTD_GWY.png?height=640&width=1280&h=640&w=1280&auto=compress",
    //     "name": "Uncover #Layer2's hidden gems: Coin98's top airdrop projects revealed!",
    //     "address": "0x2116daa18f5bb19205ae480b68550bd117c164b8",
    //     "tokenId": "",
    //     "chainName": "OP",
    //     "chainId": 10,
    //     "tokenType": "ERC721"
    // },
    // {
    //     "image": "https://mirror-media.imgix.net/publication-images/mHs6NLQ9bP_SfJHJviIhp.jpeg?height=611&width=1221&h=611&w=1221&auto=compress",
    //     "name": "[ NFTFeed x Base Name Service] Giveaway of 5 Azuki Red Bean Radio NFT",
    //     "address": "0xf80940b3c5604c84899874af33d156ff9081903f",
    //     "tokenId": "",
    //     "chainName": "OP",
    //     "chainId": 10,
    //     "tokenType": "ERC721"
    // },
    // {
    //     "image": "https://mirror-media.imgix.net/publication-images/mJ7Ryk6ClO94X8vBieJGH.png?height=611&width=1221&h=611&w=1221&auto=compress",
    //     "name": "Azuki's Preparation for Their 'Mistake'? 🧐",
    //     "address": "0x6EDebc40d727ED42e03F290b9FF556D1ECcD135C",
    //     "tokenId": "",
    //     "chainName": "OP",
    //     "chainId": 10,
    //     "tokenType": "ERC721"
    // },
    // {
    //     "image": "https://mirror-media.imgix.net/publication-images/t205Hu8WTmi1TDhA596A_.jpeg?height=611&width=1221&h=611&w=1221&auto=compress",
    //     "name": "All about the benefit of NFTFeed Free Mint",
    //     "address": "0x151931e2e39cbbbd909cdc27a3986044d2920c72",
    //     "tokenId": "",
    //     "chainName": "OP",
    //     "chainId": 10,
    //     "tokenType": "ERC721"
    // },
    // {
    //     "image": "https://mirror-media.imgix.net/publication-images/VE0PjcrGhzFs5D3Z311g6.png?height=600&width=1200&h=600&w=1200&auto=compress",
    //     "name": "NFTFeed Partners with Bitgert Chain: Unlocking New Possibilities in the Blockchain World",
    //     "address": "0x33a451260de3931e31509674682068fab0e6e477",
    //     "tokenId": "",
    //     "chainName": "OP",
    //     "chainId": 10,
    //     "tokenType": "ERC721"
    // },
    // {
    //     "image": "",
    //     "name": "NFTFeed Multiverse - Bitgert",
    //     "address": "0x42D126090fd6985a43b8551DC5D77b95BE14B262",
    //     "tokenId": 0,
    //     "chainName": "OP",
    //     "chainId": 10,
    //     "tokenType": "ERC1155"
    // },
    // {
    //     "image": "https://mirror-media.imgix.net/publication-images/scl60uE0XX0r_SdnJYRXq.png?height=600&width=1200&h=600&w=1200&auto=compress",
    //     "name": "[NFTFeed x Bee Network] Partnership giveaway",
    //     "address": "0x504153ce2b6a0a9eff1d199c5947c31fdba9dae9",
    //     "tokenId": "",
    //     "chainName": "OP",
    //     "chainId": 10,
    //     "tokenType": "ERC721"
    // },
    // {
    //     "image": "",
    //     "name": "Base Supporters",
    //     "address": "0x3e4b65cdf610d43bca81b88fe17b139501abf864",
    //     "tokenId": 0,
    //     "chainName": "OP",
    //     "chainId": 10,
    //     "tokenType": "ERC1155"
    // },
    // {
    //     "image": "",
    //     "name": "Base Fren",
    //     "address": "0x3e4b65cdf610d43bca81b88fe17b139501abf864",
    //     "tokenId": 3,
    //     "chainName": "OP",
    //     "chainId": 10,
    //     "tokenType": "ERC1155"
    // },
    // {
    //     "image": "",
    //     "name": "OAT on Galxe Poly Gon",
    //     "address": "0x5D666F215a85B87Cb042D59662A7ecd2C8Cc44e6",
    //     "tokenId": "",
    //     "chainName": "Polygon",
    //     "chainId": 137,
    //     "tokenType": "ERC721"
    // },
    // {
    //     "image": "https://qa.cdn.nftfeed.guru/files/ecommerce/1424c27d121a479f8fc48a1d291a4b4a16.png",
    //     "name": "OAT on Galxe OP",
    //     "address": "0xb20B4aC5cEC52fB65D3ef0CC74aF5875fF646bdF",
    //     "tokenId": "",
    //     "chainName": "OP",
    //     "chainId": 10,
    //     "tokenType": "ERC721"
    // },
    // {
    //     "image": "https://qa.cdn.nftfeed.guru/files/ecommerce/cf4c9d960dbe4ae7bc33646f97f8bdce17.png",
    //     "name": "NFT on QuestN OP",
    //     "address": "0xb277B4A9B07FFB66D49760c94dA06551bd64fece",
    //     "tokenId": "",
    //     "chainName": "OP",
    //     "chainId": 10,
    //     "tokenType": "ERC721"
    // },
    // {
    //     "image": "",
    //     "name": "NFT on QuestN BNB",
    //     "address": "0xA1D09C9061AF5189d202818198c6825C0a5cC6E2",
    //     "tokenId": "",
    //     "chainName": "BNB",
    //     "chainId": 56,
    //     "tokenType": "ERC721"
    // },
    // {
    //     "image": "https://qa.cdn.nftfeed.guru/files/ecommerce/2a9921c987b84048b1ae181431b1c141Thie%CC%82%CC%81t%20ke%CC%82%CC%81%20chu%CC%9Ba%20co%CC%81%20te%CC%82n%20(55).png",
    //     "name": "1000 NFT Dmission",
    //     "address": "0x20333f3a4ee967ea5f4f19c789dc73b0e4525bae",
    //     "tokenId": "",
    //     "chainName": "OP",
    //     "chainId": 10,
    //     "tokenType": "ERC721"
    // },
    // {
    //     "image": "",
    //     "name": "NFTFeed Multiverse - REI Network",
    //     "address": "0x42D126090fd6985a43b8551DC5D77b95BE14B262",
    //     "tokenId": 1,
    //     "chainName": "OP",
    //     "chainId": 10,
    //     "tokenType": "ERC1155"
    // },
    // {
    //     "image": "https://mirror-media.imgix.net/publication-images/lE31fQe5qFNLro-ISoqnY.png?height=600&width=1200&h=600&w=1200&auto=compress",
    //     "name": "NFTFeed Partners with REI Network for Seamless Cross-Chain Integration",
    //     "address": "0x0ec1ab9d1b51970f373c58b39bfe139b37945e72",
    //     "tokenId": "",
    //     "chainName": "OP",
    //     "chainId": 10,
    //     "tokenType": "ERC721"
    // },
    // {
    //     "image": "https://mirror-media.imgix.net/publication-images/KZ1MUDeGl2pnfmFke1ZKw.png?height=600&width=1200&h=600&w=1200&auto=compress",
    //     "name": "Airdrop hunting with NFTFeed project on the Path to Base Mainnet",
    //     "address": "0xFe318BaB34eb8d13BD4aD1cC66eFC4f10f69801F",
    //     "tokenId": "",
    //     "chainName": "OP",
    //     "chainId": 10,
    //     "tokenType": "ERC721"
    // },
    // {
    //     "image": "https://qa.cdn.nftfeed.guru/files/ecommerce/bb89d1a0a0f944f7b2f454b36e96c213Thie%CC%82%CC%81t%20ke%CC%82%CC%81%20chu%CC%9Ba%20co%CC%81%20te%CC%82n%20(56).png",
    //     "name": "Base Surfer",
    //     "address": "0x98c74ca62df61d3de266237fa02df058d909d9eb",
    //     "tokenId": "",
    //     "chainName": "OP",
    //     "chainId": 10,
    //     "tokenType": "ERC721"
    // },
    // {
    //     "image": "https://qa.cdn.nftfeed.guru/files/ecommerce/7de83f0239414760b08c630e5cf12b14Thie%CC%82%CC%81t%20ke%CC%82%CC%81%20chu%CC%9Ba%20co%CC%81%20te%CC%82n%20(58).png",
    //     "name": "Basebie Shark",
    //     "address": "0x7f1fc5d87f51dc178f9e883b02cada85056f47bb",
    //     "tokenId": "",
    //     "chainName": "OP",
    //     "chainId": 10,
    //     "tokenType": "ERC721"
    // },
    // {
    //     "image": "",
    //     "name": "All Your NFTFeed Are Belong To You",
    //     "address": "0xFBD2F3DDC31738119baaC0ee975b15388C7A7853",
    //     "tokenId": 0,
    //     "chainName": "OP",
    //     "chainId": 10,
    //     "tokenType": "ERC1155"
    // },
    // {
    //     "image": "https://mirror-media.imgix.net/publication-images/c-wY5tAiI1J0iT7wNAYzH.png?height=600&width=1200&h=600&w=1200&auto=compress",
    //     "name": "[NFTFeed x Mises Browser] All Your Chance Are Belong To You",
    //     "address": "0x2d9424e0e3b61a088fbac850fc741ac4b818c460",
    //     "tokenId": "",
    //     "chainName": "OP",
    //     "chainId": "",
    //     "tokenType": "ERC721"
    // },
    // {
    //     "image": "https://mirror-media.imgix.net/publication-images/hgZ5fgl1TtAE10DfQsoCj.png?height=960&width=1920&h=960&w=1920&auto=compress",
    //     "name": "[ NFTFeed x Pira Finance] Giveaway 50 USDT and OAT",
    //     "address": "0x210d5dcb9e36e0eb9976400ab0fc602063324f07",
    //     "tokenId": "",
    //     "chainName": "OP",
    //     "chainId": "",
    //     "tokenType": "ERC721"
    // },
    {
        "image": "https://images.mirror-media.xyz/publication-images/2fIj4SUK6jlw86-Ql0Dl3.png?height=600&width=1200",
        "name": "Revolutionizing NFT Trading: NFTFeed Partners with ZetaChain",
        "address": "0x7D01c787eb04C50987AB569351eE6A74f476C268",
        "tokenId": "",
        "chainName": "OP",
        "chainId": 10,
        "tokenType": "ERC721"
    },
]

export const params = rawData
    .filter(v => v.address)
    .filter(v => v.chainId === 10 && v.tokenType === "ERC721")
    .map(({ address, }) => ({
        nftAddress: address,
        daysLocked: 30,
        startTime: Math.floor(stringDateToUTCDate("2023/09/13 00:00:00").getTime() / 1000),
        endTime: Math.floor(stringDateToUTCDate("2024/09/13 00:00:00").getTime() / 1000),
    }));
