// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IPriceFeed {
    function latestAnswer() external view returns (int256);

    function latestRound() external view returns (uint80);

    // returns roundId, answer, startedAt, updatedAt, answeredInRound
    function getRoundData(
        uint80 roundId
    ) external view returns (uint80, int256, uint256, uint256, uint80);
}
