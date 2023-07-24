// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
pragma abicoder v2;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

contract TokenTool is Ownable, ReentrancyGuard, ERC721Holder {
    using SafeERC20 for IERC20;
    string public name;

    constructor() {
        name = "Token Tool V2";
    }

    function transferFullErc721(address _erc721, address _to) external {
        uint256 balance = IERC721(_erc721).balanceOf(address(msg.sender));
        for (uint256 i = 0; i < balance; i++) {
            uint256 tokenId = IERC721Enumerable(_erc721).tokenOfOwnerByIndex(
                address(msg.sender),
                0
            );
            IERC721(_erc721).safeTransferFrom(
                address(msg.sender),
                _to,
                tokenId
            );
        }
    }

    function batchTranferErc20(
        address _erc20,
        address[] calldata _tos,
        uint256[] calldata _amounts
    ) external {
        IERC20 token = IERC20(_erc20);
        for (uint256 i = 0; i < _tos.length; i++) {
            token.safeTransferFrom(
                address(msg.sender),
                address(_tos[i]),
                _amounts[i]
            );
        }
    }
}
