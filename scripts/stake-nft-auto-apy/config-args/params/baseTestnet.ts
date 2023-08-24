import { BigNumber } from "ethers";
import { parseAmountToken, stringDateToUTCDate } from "../../../@helpers/block-chain.helper";



const totalReward = parseAmountToken(1000_000);

const startTime = Math.floor(stringDateToUTCDate("2023/08/19 18:30:00").getTime() / 1000);
const endTimeBonus = Math.floor(stringDateToUTCDate("2023/09/19 18:30:00").getTime() / 1000);

export const params = {
    tokenReward: "0x295B04B08a425c882C34a4ce0a85255cD22281fc",
    nft: "0xD858f831511f9e58c5146f4ed643c8bf55ACCfb4",
    startTime,
    endTimeBonus,
    rewardPerSeconds: totalReward.div(BigNumber.from(endTimeBonus).sub(BigNumber.from(startTime)))
}
