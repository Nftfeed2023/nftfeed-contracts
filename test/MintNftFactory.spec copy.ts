import { ethers, run } from "hardhat";
import { expect } from 'chai'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { MintNftFactory, MintNftFactory__factory, TokenERC20, TokenERC20__factory, TokenERC721, TokenERC721__factory } from "../typechain";
import { formatAmountToken, increaseTimeTo, parseAmountToken, stringDateToUTCDate } from "../scripts/@helpers/block-chain.helper";






const { utils, constants, getSigners, getContractFactory } = ethers;
const { parseEther, formatEther, keccak256 } = utils;
const { MaxUint256 } = constants;






const baseUrl = "";




const totalNft = 10;

const tokenIds = Array.from({ length: totalNft }, (_, index) => index + 1)
console.log(`-------------------`);
console.log({ tokenIds });
console.log(`-------------------`);


describe("MintNftFactory", () => {

  let deployer: SignerWithAddress, royaltyAddress: SignerWithAddress;
  let users: SignerWithAddress[];




  let vaultFactory: MintNftFactory__factory;
  let vaultCt: MintNftFactory;





  before(async function () {

    const signers = await getSigners();
    deployer = signers[0];
    royaltyAddress = signers[1];
    users = signers.slice(2);
    console.log("deployer: ", deployer.address);

    vaultFactory = await getContractFactory("MintNftFactory");

  })



  beforeEach(async function () {
    const royaltyFee = parseAmountToken(0.00069);
    vaultCt = await vaultFactory.connect(deployer).deploy(
      royaltyAddress.address,
      royaltyFee
    );
    await vaultCt.deployed();

    console.log(`vaultCt  deployed to:`, vaultCt.address);

  });








  describe("Chạy happy case", function () {

    it("Run", async () => {

      const user0 = users[0];
      const user1 = users[1];


      const balanceUser0 = formatAmountToken(await user0.getBalance());
      const balanceUser1 = formatAmountToken(await user1.getBalance());

      console.log(`-------------------`);
      console.log({ balanceUser0, balanceUser1 });
      console.log(`-------------------`);
      {
        const { transactionHash } = await (await vaultCt.connect(user0).deploy(
          "NFTA",
          "NFTA",
          "https://qa.cdn.nftfeed.guru/files/ecommerce/53c6a545d7764c508087a7fa6b7564feThie%CC%82%CC%81t%20ke%CC%82%CC%81%20chu%CC%9Ba%20co%CC%81%20te%CC%82n%20(42).png",
          parseAmountToken(0.00009),
          Math.floor(stringDateToUTCDate("2023/10/16 15:00:00").getTime() / 1000),
          1000
        )).wait();

      }


      {

        // const qty = 10;
        // const totalPool = await vaultCt.totalPool();
        // const nftAddress = await vaultCt.containerNfts(totalPool);
        // const amountOut = await vaultCt.getAmountOut(nftAddress, qty)
        // console.log(`-------------------`);
        // console.log({ nftAddress });
        // console.log(`-------------------`);

        // const { transactionHash } = await (await vaultCt.connect(user1).mint(nftAddress, qty, {
        //   value: amountOut
        // })).wait()
        // const balanceUser0 = formatAmountToken(await user0.getBalance());
        // const balanceUser1 = formatAmountToken(await user1.getBalance());

        // console.log(`-------BALANCE STEP02------------`);
        // console.log({ balanceUser0, balanceUser1 });
        // console.log(`-------------------`);

      }

      expect(true).to.equal(true);



    }).timeout(5 * 60 * 1000)
  })




})
