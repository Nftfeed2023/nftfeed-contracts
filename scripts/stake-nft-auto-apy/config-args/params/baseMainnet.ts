import { BigNumber } from "ethers";
import { parseAmountToken, stringDateToUTCDate } from "../../../@helpers/block-chain.helper";



const totalReward = parseAmountToken(700_000);

const startTime = Math.floor(stringDateToUTCDate("2023/09/29 10:00:00").getTime() / 1000);
const endTimeBonus = Math.floor(stringDateToUTCDate("2023/10/30 10:00:00").getTime() / 1000);

export const params = {
    tokenReward: "0x78A0ad4EB97A71077B12fBDaC2ECA3550767eE2b",
    nft: "0x27dac2f25edb24c75cd1781e68b0358c91a9765a", // base Punk
    startTime,
    endTimeBonus,
    rewardPerSeconds: totalReward.div(BigNumber.from(endTimeBonus).sub(BigNumber.from(startTime)))
}
