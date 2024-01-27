// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
pragma abicoder v2;

// import "hardhat/console.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import {PresaleFairLaunchTemplateV1} from "./PresaleFairLaunchTemplateV1.sol";

contract PresaleFairLaunchFactoryV1 is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;
    uint256 public constant ONE_HUNDRED_PERCENT = 100 * 100; // 100%
    uint256 public constant MAX_PERCENT_FEE_SYSTEM = 2000; // 20%
    // address fee
    address public royaltyAddress;
    // value fee to Native token
    uint256 public creationFee;
    // value fee to Native token
    uint256 public percentFeeRaised;

    // % fee Raised
    uint256 public percentRefund;

    uint256 public totalPool = 0;

    mapping(address => bool) public admins;

    // poolId => pool Address
    mapping(uint256 => address) public containerPools;

    // pool address => address manager
    mapping(address => address) public managers;

    // pool address => address token
    mapping(address => address) public tokens;

    // pool address => address dexRouter
    mapping(address => address) public dexRouters;

    // pool address => start end
    mapping(address => uint256) public startTimes;
    // pool address => time end
    mapping(address => uint256) public endTimes;

    event DeployPool(uint256 poolId, address poolAddress, address manager);

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

    // x * (ONE_HUNDRED_PERCENT - _percentFeeRaised) * (liqPercent) : (x/tokensForPresale)
    // x=1 (ONE_HUNDRED_PERCENT - _percentFeeRaised) * liqPercent * tokensForPresale;
    function calculateTokensForLiquidity(
        uint256 _percentForLiquidity,
        uint256 _tokensForPresale
    ) public view returns (uint256) {
        return
            ((ONE_HUNDRED_PERCENT - percentFeeRaised) *
                _percentForLiquidity *
                _tokensForPresale) /
            (ONE_HUNDRED_PERCENT * ONE_HUNDRED_PERCENT);
    }

    function deploy(
        address _tokenAddress,
        uint256 _percentForLiquidity,
        uint256 _tokensForPresale,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _softCap,
        uint256 _maxContribution,
        address _manager,
        address _dexRouter
    ) external nonReentrant returns (uint256 poolId, address poolAddress) {
        totalPool++;
        uint256 tokensForLiquidity = calculateTokensForLiquidity(
            _percentForLiquidity,
            _tokensForPresale
        );
        payable(royaltyAddress).transfer(creationFee);
        IERC20(_tokenAddress).safeTransferFrom(
            address(msg.sender),
            address(this),
            tokensForLiquidity + _tokensForPresale
        );
        PresaleFairLaunchTemplateV1 pool = new PresaleFairLaunchTemplateV1(
            royaltyAddress,
            percentFeeRaised,
            percentRefund,
            _tokenAddress,
            tokensForLiquidity,
            _tokensForPresale,
            _startTime,
            _endTime,
            _softCap,
            _maxContribution,
            _manager,
            _dexRouter
        );
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

    function changePercentFeeRaised(
        uint256 _percentFeeRaised
    ) external onlyAdmin nonReentrant {
        require(
            _percentFeeRaised <= MAX_PERCENT_FEE_SYSTEM,
            "Percent fee raised over"
        );
        _percentFeeRaised = _percentFeeRaised;
    }

    function changePercentRefund(
        uint256 _percentRefund
    ) external onlyOwner nonReentrant {
        require(
            _percentRefund <= MAX_PERCENT_FEE_SYSTEM,
            "Percent fee refund over"
        );
        percentRefund = _percentRefund;
    }
}
