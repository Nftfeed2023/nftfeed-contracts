// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
pragma abicoder v2;

import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

contract FreeMintPool is Ownable, ReentrancyGuard, ERC721Holder {
    string public name;
    address public erc721;

    // user address => isClaimed
    mapping(address => bool) public usersClaimed;

    constructor(address _erc721) {
        name = "Free Mint Pool";
        erc721 = _erc721;
    }

    function setNftAddress(address _nft) external onlyOwner {
        erc721 = _nft;
    }

    function claim() external {
        require(!usersClaimed[msg.sender], "User claimed");
        require(IERC721(erc721).balanceOf(address(this)) > 0, "Pool empty");
        uint256 tokenId = IERC721Enumerable(erc721).tokenOfOwnerByIndex(
            address(this),
            0
        );
        IERC721(erc721).transferFrom(address(this), msg.sender, tokenId);
        usersClaimed[msg.sender] = true;
    }
}
