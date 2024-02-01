import { ethers, } from "hardhat";
import { expect } from 'chai'
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ERC20Template, ERC20Template__factory, PresaleFairLaunchFactoryV1, PresaleFairLaunchFactoryV1__factory, PresaleFairLaunchTemplateV1, PresaleFairLaunchTemplateV1__factory } from "../typechain";
import { formatAmountToken, increaseTimeTo, parseAmountToken, stringDateToUTCDate } from "../scripts/@helpers/block-chain.helper";
import { Contract } from "ethers";






const { utils, constants, getSigners, getContractFactory, provider } = ethers;
const { parseEther, formatEther, keccak256 } = utils;
const { MaxUint256, AddressZero } = constants;





const creationFee = parseAmountToken(0.1);
const percentFeeRaised = 5 * 100;
const percentRefund = 10 * 100;

describe("PresaleFairLaunchFactoryV1", () => {

  let deployer: SignerWithAddress, royalty: SignerWithAddress;
  let users: SignerWithAddress[];




  let vaultFactory: PresaleFairLaunchFactoryV1__factory;
  let vaultCt: PresaleFairLaunchFactoryV1;

  let tokenFactory: ERC20Template__factory;

  let tokenCt: ERC20Template;


  const percentForLiquidity = 60 * 100;
  const tokensForPresale = parseAmountToken(400);


  before(async function () {

    const signers = await getSigners();
    deployer = signers[0];
    royalty = signers[1];
    users = signers.slice(2);
    console.log("deployer: ", deployer.address);
    vaultFactory = await getContractFactory("PresaleFairLaunchFactoryV1");
    tokenFactory = await getContractFactory("ERC20Template");

  })



  beforeEach(async function () {

    vaultCt = await vaultFactory.connect(deployer).deploy(
      royalty.address,
      creationFee,
      percentFeeRaised,
      percentRefund,

    );
    await vaultCt.deployed();

    console.log(`vaultCt  deployed to:`, vaultCt.address);
    const project = users[0];
    tokenCt = await tokenFactory.deploy("FEED", "FEED", 1000, project.address);

  });








  describe("Chạy happy case", function () {

    it("Run", async () => {

      const project = users[0];
      const user1 = users[1];
      const user2 = users[2];

      const logUser = async (user: SignerWithAddress, tag: string) => {
        const balance = formatAmountToken(await user.getBalance());
        const balanceToken = formatAmountToken(await tokenCt.balanceOf(user.address));
        console.log(`----------${tag}---------`);
        console.log({ balance, balanceToken });
        console.log(`-------------------`);
      }

      await logUser(royalty, "Royalty");
      await logUser(project, "project");
      await logUser(user1, "user1");
      await logUser(user2, "user2");

      const startTime = Math.floor(stringDateToUTCDate("2024/01/28 8:00:00").getTime() / 1000);
      const endTime = Math.floor(stringDateToUTCDate("2024/01/28 10:00:00").getTime() / 1000);

      const softCap = parseAmountToken(1);
      const maxContribution = parseAmountToken(20);

      let presaleAddress;
      {

        await tokenCt.connect(project).approve(vaultCt.address, parseAmountToken(1000));
        const value = await vaultCt.creationFee();
        const { transactionHash, events } = await (await vaultCt.connect(project).deploy(
          tokenCt.address,
          percentForLiquidity,
          tokensForPresale,
          startTime,
          endTime,
          softCap,
          maxContribution,
          AddressZero,
          { value }
        )).wait();
        const presaleAddress1 = events[0].address;
        presaleAddress = events.find(v => v.event === 'DeployPool').args[1]



        console.log(`=====AFTER DEPLOY=====`);
        await logUser(royalty, "Royalty");
        await logUser(project, "project");
        await logUser(user1, "user1");
        await logUser(user2, "user2");
      }

      const presaleCt = new Contract(presaleAddress, PresaleFairLaunchTemplateV1__factory.abi, ethers.provider) as PresaleFairLaunchTemplateV1;

      const logStatus = async () => {
        console.log(`----------PRESALE STATUS---------`);
        console.log("status", await presaleCt.getStatus());
        console.log(`-------------------`);
      }
      {



        enum EStatus {
          Upcoming = 0,
          Live = 1,
          Failed = 2,
          Success = 3,
          Listed = 4,
          Canceled = 5
        }
        await logStatus();
        await increaseTimeTo(startTime);
        await logStatus();
        await presaleCt.connect(user1).deposit({
          value: parseAmountToken(2)
        })
        await increaseTimeTo(endTime + 1);
        await logStatus();

        await presaleCt.connect(project).deposit({
          value: parseAmountToken(2)
        })



      }

      expect(true).to.equal(true);

    }).timeout(5 * 60 * 1000)
  })




})
