// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
pragma abicoder v2;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

contract TokenTool is Ownable, ReentrancyGuard, ERC721Holder {
    using SafeERC20 for IERC20;
    string public name;

    constructor() {}

    function transferErc721(
        address _erc721,
        uint256[] calldata _tokenIds,
        address[] calldata _tos
    ) external {
        for (uint256 i = 0; i < _tokenIds.length; i++) {
            IERC721(_erc721).safeTransferFrom(
                address(msg.sender),
                _tos[i],
                _tokenIds[i]
            );
        }
    }

    function batchTransferNative(
        address[] calldata _tos,
        uint256[] calldata _amounts
    ) external nonReentrant {
        for (uint256 i = 0; i < _tos.length; i++) {
            payable(_tos[i]).transfer(_amounts[i]);
        }
    }

    function batchTransferErc20(
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
