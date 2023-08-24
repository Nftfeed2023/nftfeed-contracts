import { BigNumber } from "ethers";
import { parseAmountToken, stringDateToUTCDate } from "../../../@helpers/block-chain.helper";



const totalReward = parseAmountToken(1000_000);

const startTime = Math.floor(stringDateToUTCDate("2023/08/20 07:30:00").getTime() / 1000);
const endTimeBonus = Math.floor(stringDateToUTCDate("2023/10/20 07:30:00").getTime() / 1000);

export const params = {
    tokenReward: "0x03D8A7ad755E5645145D0a7c3CFD0DCF5F52DF8C",
    nft: "0x268174fF68633901A2EC6511b33c590aAC4Fe263",
    startTime,
    endTimeBonus,
    rewardPerSeconds: totalReward.div(BigNumber.from(endTimeBonus).sub(BigNumber.from(startTime)))
}
