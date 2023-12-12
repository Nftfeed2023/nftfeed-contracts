// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import {IPriceFeed} from "./IPriceFeed.sol";

contract PriceFeed is Ownable, IPriceFeed {
    uint80 public roundId;
    mapping(uint80 => int256) public answers;

    function latestAnswer() public view override returns (int256) {
        return answers[roundId];
    }

    function latestRound() public view override returns (uint80) {
        return roundId;
    }

    function getRoundData(
        uint80 _roundId
    ) public view override returns (uint80, int256, uint256, uint256, uint80) {
        return (_roundId, answers[_roundId], 0, 0, 0);
    }

    function setLatestAnswer(int256 _answer) public onlyOwner {
        roundId = roundId + 1;
        answers[roundId] = _answer;
    }
}
