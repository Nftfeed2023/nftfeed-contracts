import { ethers, run } from "hardhat";
import { expect } from 'chai'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { FeedVault, FeedVault__factory, TokenERC20, TokenERC20__factory, TokenERC721, TokenERC721__factory } from "../typechain";
import { increaseTimeTo, parseAmountToken, stringDateToUTCDate } from "../scripts/@helpers/block-chain.helper";






const { utils, constants, getSigners, getContractFactory } = ethers;
const { parseEther, formatEther, keccak256 } = utils;
const { MaxUint256 } = constants;






const baseUrl = "";




const totalNft = 10;

const tokenIds = Array.from({ length: totalNft }, (_, index) => index + 1)
console.log(`-------------------`);
console.log({ tokenIds });
console.log(`-------------------`);


describe("FeedVault", () => {

  let deployer: SignerWithAddress, admin: SignerWithAddress, rewardFrom: SignerWithAddress;
  let users: SignerWithAddress[];

  let erc20Factory: TokenERC20__factory;
  let erc20Ct: TokenERC20;


  let vaultFactory: FeedVault__factory;
  let vaultCt: FeedVault;





  before(async function () {

    const signers = await getSigners();
    deployer = signers[0];
    users = signers.slice(1);
    console.log("deployer: ", deployer.address);

    vaultFactory = await getContractFactory("FeedVault");

  })



  beforeEach(async function () {
    erc20Ct = await erc20Factory.deploy("BUSD", "BUSD", Math.pow(10, 6));
    await erc20Ct.deployed();

    console.log(`erc20Ct  deployed to:`, erc20Ct.address);



  });



  const tranferTokenByUser = async () => {
    for (const user of users) {
      await erc20Ct.connect(deployer).transfer(user.address, parseAmountToken(1000));
    }


  }





  describe("Chạy happy case", function () {

    it("Run", async () => {


      expect(true).to.equal(true);



    }).timeout(5 * 60 * 1000)
  })




})
