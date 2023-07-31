import { stringDateToUTCDate } from "../../../@helpers/block-chain.helper";

export const params = [
    {
        nftAddress: "0xf80A719F127A86C845F12d6aC5E70011351B0385",
        daysLocked: 30,
        startTime: Math.floor(stringDateToUTCDate("2023/07/28 00:00:00").getTime() / 1000),
        endTime: Math.floor(stringDateToUTCDate("2023/09/30 00:00:00").getTime() / 1000),
    }
]
