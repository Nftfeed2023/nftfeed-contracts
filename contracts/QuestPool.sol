// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
pragma abicoder v2;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";

contract QuestPool is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    string public name;

    address public token;
    // questId => amount
    mapping(string => uint256) amountBonusQuestId;

    // questId => user address => amount claimed
    mapping(string => mapping(address => uint256)) usersClaimed;

    constructor(address _token) {
        name = "Quest Pool";
        token = _token;
    }

    function setAmountBonus(
        string memory _questId,
        uint256 _amount
    ) external onlyOwner {
        amountBonusQuestId[_questId] = _amount;
    }

    function claim(string memory _questId) external {
        require(usersClaimed[_questId][msg.sender] == 0, "User claimed");
        IERC20(token).safeTransfer(
            address(msg.sender),
            amountBonusQuestId[_questId]
        );
        usersClaimed[_questId][msg.sender] = amountBonusQuestId[_questId];
    }

    function getUserInfoByQuest(
        string memory _questId,
        address _user
    ) public view returns (uint256 amountClaimed, bool isClaimed) {
        return (
            usersClaimed[_questId][_user],
            usersClaimed[_questId][_user] > 0
        );
    }
}
