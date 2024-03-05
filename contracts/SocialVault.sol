// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
pragma abicoder v2;

// import "hardhat/console.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import {SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract SocialVault is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    mapping(address => bool) public admins;

    address public systemAddress;
    // address fee
    address public royaltyAddress;
    // value fee to Native token
    uint256 public creationFee;

    // value token claim
    uint256 public minAmountClaim;

    uint256 public totalCampaign = 0;

    /// @dev campaignId => nftAddress
    mapping(uint256 => address) public containers;

    mapping(address => bool) public nftsRegistered;

    /// @dev nft address => token bonus
    mapping(address => address) public tokens;

    /// @dev nft address => total amount bonus
    mapping(address => uint256) public totalAmountBonus;

    /// @dev nft address => address manager
    mapping(address => address) public creators;
    /// @dev nft address => start end
    mapping(address => uint256) public startTimes;
    /// @dev nft address => time end
    mapping(address => uint256) public endTimes;

    bool public isClose;

    //user tokenAddress => userAddress => amount
    mapping(address => mapping(address => uint256)) public amountUsers;

    //user tokenAddress =>  amount
    mapping(address => uint256) totalAmountDeposit;

    modifier onlyAdmin() {
        require(admins[_msgSender()], "Admin: caller is not the admin");
        _;
    }

    event CreateCampaign(
        uint256 campaignId,
        address creator,
        address nftAddress,
        address tokenAddress,
        uint256 totalAmountBonus
    );

    constructor(
        address _royaltyAddress,
        uint256 _creationFee,
        uint256 _minAmountClaim,
        address _systemAddress
    ) {
        require(
            _royaltyAddress != address(0),
            "Royalty Address is Zero address"
        );
        require(_systemAddress != address(0), "System Address is Zero address");
        royaltyAddress = _royaltyAddress;
        creationFee = _creationFee;
        minAmountClaim = _minAmountClaim;
        systemAddress = _systemAddress;
        admins[_msgSender()] = true;
    }

    function updateAdmin(
        address _admin,
        bool _isAdd
    ) external onlyOwner nonReentrant {
        require(_admin != address(0), "Admin address is Zero ");
        admins[_admin] = _isAdd;
    }

    function changeRoyaltyAddress(
        address _royaltyAddress
    ) external onlyOwner nonReentrant {
        require(
            _royaltyAddress != address(0),
            "Royalty Address is Zero address"
        );

        royaltyAddress = _royaltyAddress;
    }

    function changeCreationFee(
        uint256 _creationFee
    ) external onlyOwner nonReentrant {
        creationFee = _creationFee;
    }

    function changeMinAmountClaim(
        uint256 _minAmountClaim
    ) external onlyOwner nonReentrant {
        minAmountClaim = _minAmountClaim;
    }

    function changeSystemAddress(address _systemAddress) external nonReentrant {
        require(_systemAddress != address(0), "System Address is Zero address");
        require(
            systemAddress == _msgSender() || owner() == _msgSender(),
            "Wallet not permisstion"
        );

        systemAddress = _systemAddress;
    }

    function createCampaign(
        address _ntfAddress,
        address _tokenAddress,
        uint256 _totalAmountBonus,
        uint256 _startTime,
        uint256 _endTime
    ) external payable nonReentrant returns (uint256 poolId) {
        require(!nftsRegistered[_ntfAddress], "Collection is create campaign");
        require(_endTime > _startTime, "endTime <= startTime");
        require(_endTime > block.timestamp, "Endtime error");
        payable(royaltyAddress).transfer(creationFee);
        IERC20(_tokenAddress).safeTransferFrom(
            address(_msgSender()),
            address(this),
            _totalAmountBonus
        );
        // create token
        totalCampaign++;
        containers[poolId] = _ntfAddress;
        tokens[_ntfAddress] = _tokenAddress;
        nftsRegistered[_ntfAddress] = true;
        creators[_ntfAddress] = _msgSender();
        totalAmountBonus[_ntfAddress] = _totalAmountBonus;
        startTimes[_ntfAddress] = _startTime;
        endTimes[_ntfAddress] = _endTime;
        totalAmountDeposit[_tokenAddress] += _totalAmountBonus;
        emit CreateCampaign(
            totalCampaign,
            _msgSender(),
            _ntfAddress,
            _tokenAddress,
            _totalAmountBonus
        );
        return totalCampaign;
    }

    function finalize(
        address _ntfAddress,
        address[] calldata _users
    ) external onlyAdmin nonReentrant {
        require(!isClose, "Campaign final");
        require(_users.length > 0, "List user is empty");
        uint256 amount = totalAmountBonus[_ntfAddress] / _users.length;
        for (uint i = 0; i < _users.length; i++) {
            // IERC20(tokens[_ntfAddress]).safeTransfer(_users[i], amount);
            amountUsers[tokens[_ntfAddress]][_users[i]] += amount;
        }
        isClose = true;
    }

    function claim(address _tokenAddress) external nonReentrant {
        uint256 amount = amountUsers[_tokenAddress][_msgSender()];
        require(
            amount >= minAmountClaim,
            "Your amount is not enough to withdraw"
        );

        IERC20(_tokenAddress).safeTransfer(_msgSender(), amount);
        amountUsers[_tokenAddress][_msgSender()] = 0;
    }

    function systemWithdraw(uint256 _amount) external nonReentrant {
        require(
            systemAddress == _msgSender() || owner() == _msgSender(),
            "Wallet not permisstion"
        );
        IERC20(systemAddress).safeTransfer(systemAddress, _amount);
    }

    function emergencyWithdraw(uint256 _amount) external nonReentrant {
        require(
            systemAddress == _msgSender() || owner() == _msgSender(),
            "Wallet not permisstion"
        );
        IERC20(systemAddress).safeTransfer(_msgSender(), _amount);
    }
}
