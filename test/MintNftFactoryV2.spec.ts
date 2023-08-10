import { ethers, run } from "hardhat";
import { expect } from 'chai'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { MintNftFactoryV2, MintNftFactoryV2__factory, TokenERC20, TokenERC20__factory, TokenERC721, TokenERC721__factory } from "../typechain";
import { formatAmountToken, increaseTimeTo, parseAmountToken, stringDateToUTCDate } from "../scripts/@helpers/block-chain.helper";






const { utils, constants, getSigners, getContractFactory } = ethers;
const { parseEther, formatEther, keccak256 } = utils;
const { MaxUint256 } = constants;






describe("MintNftFactoryV2", () => {

  let deployer: SignerWithAddress, royaltyAddress: SignerWithAddress;
  let users: SignerWithAddress[];




  let vaultFactory: MintNftFactoryV2__factory;
  let vaultCt: MintNftFactoryV2;





  before(async function () {

    const signers = await getSigners();
    deployer = signers[0];
    royaltyAddress = signers[1];
    users = signers.slice(2);
    console.log("deployer: ", deployer.address);

    vaultFactory = await getContractFactory("MintNftFactoryV2");

  })



  beforeEach(async function () {
    const royaltyFee = parseAmountToken(100);
    vaultCt = await vaultFactory.connect(deployer).deploy(
      royaltyAddress.address,
      royaltyFee
    );
    await vaultCt.deployed();

    console.log(`vaultCt  deployed to:`, vaultCt.address);

  });








  describe("Chạy happy case", function () {

    it("Run", async () => {

      const project = users[0];
      const partner = users[1];
      const userMint = users[2];
      const userRef = users[3];



      const logUser = async (user: SignerWithAddress, tag: string) => {
        const balance = formatAmountToken(await user.getBalance());
        console.log(`----------${tag}---------`);
        console.log({ balance });
        console.log(`-------------------`);
      }
      await logUser(royaltyAddress, "Royalty");
      await logUser(project, "project");
      await logUser(partner, "partner");
      await logUser(userMint, "userMint");
      await logUser(userRef, "userRef");
      {
        const { } = await (await vaultCt.connect(project).deploy(
          "NFTA",
          "NFTA",
          "https://qa.cdn.nftfeed.guru/files/ecommerce/53c6a545d7764c508087a7fa6b7564feThie%CC%82%CC%81t%20ke%CC%82%CC%81%20chu%CC%9Ba%20co%CC%81%20te%CC%82n%20(42).png",
          parseAmountToken(400),
          Math.floor(stringDateToUTCDate("2023/10/16 15:00:00").getTime() / 1000),
          0,
          0,
          5000
        )).wait();

        console.log(`=====AFTER DEPLOY=====`);
        await logUser(royaltyAddress, "Royalty");
        await logUser(project, "project");
        await logUser(partner, "partner");
        await logUser(userMint, "userMint");
        await logUser(userRef, "userRef");
      }


      {


        console.log(`=====START MINT=====`);
        await logUser(royaltyAddress, "Royalty");
        await logUser(project, "project");
        await logUser(partner, "partner");
        await logUser(userMint, "userMint");
        await logUser(userRef, "userRef");

        const totalPool = await vaultCt.totalPool();
        const nftAddress = await vaultCt.containerNfts(totalPool);
        const amountOut = await vaultCt.getAmountOut(nftAddress)
        console.log(`-------------------`);
        console.log({ nftAddress });
        console.log(`-------------------`);

        const { } = await (await vaultCt.connect(deployer).changeSystemPercentAff(nftAddress, 5000)).wait();
        const { } = await (await vaultCt.connect(deployer).updatePartnerAff(nftAddress, [partner.address], true)).wait();

        try {
          for (let i = 0; i < 1; i++) {
            const { } = await (await vaultCt.connect(userMint).mint(nftAddress, partner.address, {
              value: amountOut
            })).wait()

            const { } = await (await vaultCt.connect(userMint).mint(nftAddress, userRef.address, {
              value: amountOut
            })).wait()

          }
          console.log(`=====U1 SUCCESS=====`);
        } catch (error) {
          console.log(`=====U1 ERROR=====`);
        }











        console.log(`=====END MINT=====`);
        await logUser(royaltyAddress, "Royalty");
        await logUser(project, "project");
        await logUser(partner, "partner");
        await logUser(userMint, "userMint");
        await logUser(userRef, "userRef");

      }

      expect(true).to.equal(true);

    }).timeout(5 * 60 * 1000)
  })




})
