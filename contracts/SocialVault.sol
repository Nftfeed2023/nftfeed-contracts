// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
pragma abicoder v2;

// import "hardhat/console.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import {ERC20Template} from "./ERC20Template.sol";
import {ERC404Template} from "./ERC404Template.sol";

contract SocialVault is Ownable, ReentrancyGuard {
    mapping(address => bool) public admins;

    // address fee
    address public royaltyAddress;
    // value fee to Native token
    uint256 public creationFee;

    uint256 public totalCampaign = 0;

    /// @dev campaignId => nftAddress
    mapping(uint256 => address) public containers;

    mapping(address => bool) public nftsRegistered;

    /// @dev nft address => tokenBonus
    mapping(address => address) public tokensBonus;

    /// @dev nft address => total amount bonus
    mapping(address => uint256) public totalAmountBonus;

    /// @dev nft address => address manager
    mapping(address => address) public managers;
    /// @dev nft address => start end
    mapping(address => uint256) public startTimes;
    /// @dev nft address => time end
    mapping(address => uint256) public endTimes;

    modifier onlyAdmin() {
        require(admins[_msgSender()], "Admin: caller is not the admin");
        _;
    }

    constructor(address _royaltyAddress, uint256 _creationFee) {
        require(
            _royaltyAddress != address(0),
            "Royalty Address is Zero address"
        );
        royaltyAddress = _royaltyAddress;
        creationFee = _creationFee;
        admins[_msgSender()] = true;
    }

    function updateAdmin(
        address _admin,
        bool _isAdd
    ) external onlyAdmin nonReentrant {
        require(_admin != address(0), "Admin address is Zero ");
        admins[_admin] = _isAdd;
    }

    function changeRoyaltyAddress(
        address _royaltyAddress
    ) external onlyAdmin nonReentrant {
        royaltyAddress = _royaltyAddress;
    }

    function changeCreationFee(
        uint256 _creationFee
    ) external onlyAdmin nonReentrant {
        creationFee = _creationFee;
    }

    function createCampaign(
        address _ntfAddress,
        address _token,
        uint256 _totalAmountBonus,
        uint256 _startTime,
        uint256 _endTime
    ) external payable nonReentrant returns (uint256 poolId) {
        // create token
        totalCampaign++;

        payable(royaltyAddress).transfer(creationFee);

        return 1;
    }
}
