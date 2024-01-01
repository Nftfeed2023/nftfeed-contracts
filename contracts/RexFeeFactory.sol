// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
pragma abicoder v2;
import {Address} from "@openzeppelin/contracts/utils/Address.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract RexFeeFactory is Ownable, ReentrancyGuard {
    using Address for address;
    address public royaltyAddress;
    // value fee to native token (ETH,BNB,...)
    uint256 public royaltyFee;
    event TakeFee(address nftAddress, uint256 qty, uint256 fee);

    constructor(address _royaltyAddress, uint256 _royaltyFee) {
        require(
            _royaltyAddress != address(0),
            "Royalty Address is Zero address"
        );
        royaltyAddress = _royaltyAddress;
        royaltyFee = _royaltyFee;
    }

    function changeRoyaltyAddress(
        address _royaltyAddress
    ) external nonReentrant {
        require(
            royaltyAddress == msg.sender || msg.sender == owner(),
            "Address not permisson change royalty address"
        );
        royaltyAddress = _royaltyAddress;
    }

    function changeRoyaltyFee(uint256 _royaltyFee) external nonReentrant {
        require(
            royaltyAddress == msg.sender || msg.sender == owner(),
            "Address not permisson change royalty fee"
        );
        royaltyFee = _royaltyFee;
    }

    function takeFee(
        address _nftAddress,
        uint256 _qty
    ) external payable nonReentrant {
        uint256 fee = getFeeByQty(_qty);
        payable(royaltyAddress).transfer(fee);
        emit TakeFee(_nftAddress, _qty, fee);
    }

    function getFeeByQty(uint256 _qty) public view returns (uint256) {
        return _qty * royaltyFee;
    }
}
