// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
pragma abicoder v2;

// import "hardhat/console.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract BatchTransferTool is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    address private feeAddress;

    constructor() {}

    receive() external payable {}

    function sendMultipleNative(
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external nonReentrant {
        for (uint256 i = 0; i < recipients.length; i++) {
            payable(recipients[i]).transfer(amounts[i]);
        }
    }

    function sendMultipleErc20(
        address erc20,
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external {
        IERC20 token = IERC20(erc20);
        for (uint256 i = 0; i < recipients.length; i++) {
            token.safeTransferFrom(
                address(msg.sender),
                address(recipients[i]),
                amounts[i]
            );
        }
    }

    function sendMultipleErc721(
        address erc721Address,
        address[] memory recipients,
        uint256[] memory tokenIds
    ) public {
        require(recipients.length == tokenIds.length, "Invaid inouts");
        for (uint256 i = 0; i < recipients.length; i++) {
            IERC721(erc721Address).safeTransferFrom(
                _msgSender(),
                recipients[i],
                tokenIds[i]
            );
        }
    }
}
