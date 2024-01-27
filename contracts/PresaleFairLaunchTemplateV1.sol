// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
pragma abicoder v2;

// import "hardhat/console.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import {IPancakeRouter} from "./interfaces/IPancakeRouter.sol";
import {IPancakeFactory} from "./interfaces/IPancakeFactory.sol";
import {IPancakePair} from "./interfaces/IPancakePair.sol";

contract PresaleFairLaunchTemplateV1 is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    enum EStatus {
        Upcoming,
        Live,
        Failed,
        Success,
        Listed,
        Canceled
    }

    uint256 public constant ONE_HUNDRED_PERCENT = 100 * 100; // 100%
    uint256 public constant MAX_PERCENT_FEE_SYSTEM = 2000; // 20%
    // address fee
    address public royaltyAddress;
    uint256 public percentFeeRaised;
    uint256 public percentRefund;

    uint256 public startTime;
    uint256 public endTime;

    uint256 public softCap;

    uint256 public maxContribution;

    address public manager;
    address public tokenAddress;
    address public dexRouter;

    uint256 public tokensForLiquidity;
    uint256 public tokensForPresale;

    uint256 public totalContributors;
    uint256 public totalRaised;

    bool public isListed;
    bool public isCanceled;

    // userAddress => allocation
    mapping(address => uint256) public userAllocations;
    // userAddress => isClaimed
    mapping(address => bool) public userClaimed;

    event CreatedPool(
        address royaltyAddress,
        uint256 percentFeeRaised,
        uint256 percentRefund,
        address tokenAddress,
        uint256 tokensForLiquidity,
        uint256 tokensForPresale,
        uint256 startTime,
        uint256 endTime,
        uint256 softCap,
        uint256 maxContribution,
        address manager,
        address dexRouter
    );

    event Deposit(address user, uint256 allocation, uint256 totalAllocation);
    event Refund(address user, uint256 amount);

    modifier onlyManager() {
        require(manager == _msgSender(), "Manager: caller is not the manager");
        _;
    }

    constructor(
        address _royaltyAddress,
        uint256 _percentFeeRaised,
        uint256 _percentRefund,
        address _tokenAddress,
        uint256 _tokensForLiquidity,
        uint256 _tokensForPresale,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _softCap,
        uint256 _maxContribution,
        address _manager,
        address _dexRouter
    ) {
        require(
            _royaltyAddress != address(0),
            "Royalty Address is Zero address"
        );
        require(
            _percentFeeRaised <= MAX_PERCENT_FEE_SYSTEM,
            "Percent fee raised over"
        );
        require(
            _percentRefund <= MAX_PERCENT_FEE_SYSTEM,
            "Percent fee refund over"
        );

        require(_startTime <= _endTime, "Start time over end time");
        require(_softCap > 0, "Soft cap is zero value");

        royaltyAddress = _royaltyAddress;
        percentFeeRaised = _percentFeeRaised;
        percentRefund = _percentRefund;
        tokenAddress = _tokenAddress;
        tokensForLiquidity = _tokensForLiquidity;
        tokensForPresale = _tokensForPresale;
        startTime = _startTime;
        endTime = _endTime;
        softCap = _softCap;
        maxContribution = _maxContribution;
        manager = _manager;
        dexRouter = _dexRouter;
        emit CreatedPool(
            _royaltyAddress,
            _percentFeeRaised,
            _percentRefund,
            _tokenAddress,
            _tokensForLiquidity,
            _tokensForPresale,
            _startTime,
            _endTime,
            _softCap,
            _maxContribution,
            _manager,
            _dexRouter
        );
    }

    function getStatus() public view returns (EStatus) {
        if (isCanceled) {
            return EStatus.Canceled;
        }
        if (startTime < block.timestamp) {
            return EStatus.Upcoming;
        }
        if (block.timestamp <= endTime) {
            return EStatus.Live;
        }
        if (totalRaised < softCap) {
            return EStatus.Failed;
        }

        if (isListed) {
            return EStatus.Listed;
        }
        return EStatus.Success;
    }

    //  system setup
    function changeRoyaltyAddress(
        address _royaltyAddress
    ) external onlyOwner nonReentrant {
        require(
            _royaltyAddress != address(0),
            "Royalty Address is Zero address"
        );

        royaltyAddress = _royaltyAddress;
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

    // end system setup

    // manager project setup
    function updateManager(
        address _newManager
    ) external onlyManager nonReentrant {
        manager = _newManager;
    }

    function updateStartTime(
        uint256 _startTime
    ) external onlyManager nonReentrant {
        require(
            getStatus() < EStatus.Live,
            "You cannot change start time once the pool is live, completed or listed"
        );
        startTime = _startTime;
    }

    function updateEndTime(uint256 _endTime) external onlyManager nonReentrant {
        require(_endTime > startTime, "End time invalid");
        require(
            getStatus() < EStatus.Success,
            "You cannot change endTime once the pool has success or listed"
        );

        endTime = _endTime;
    }

    function updateSoftCap(uint256 _softCap) external onlyManager nonReentrant {
        require(
            getStatus() < EStatus.Success,
            "You cannot change soft cap once the pool has success or listed"
        );
        softCap = _softCap;
    }

    function updateDexRouter(
        address _dexRouter
    ) external onlyManager nonReentrant {
        require(
            getStatus() < EStatus.Listed,
            "You cannot change soft cap once the pool has listed"
        );
        dexRouter = _dexRouter;
    }

    function finalize() external onlyManager nonReentrant {
        require(getStatus() == EStatus.Success, "Pool is not success");
        IERC20(tokenAddress).approve(dexRouter, tokensForLiquidity);
        uint256 amountSystemFeeRaised = (percentFeeRaised * totalRaised) /
            ONE_HUNDRED_PERCENT;
        uint256 amountNativeAddLP = (totalRaised * tokensForLiquidity) /
            tokensForPresale;

        uint256 deadline = block.timestamp + 600; // 600 s = 10 m
        IPancakeRouter(dexRouter).addLiquidityETH{value: amountNativeAddLP}(
            tokenAddress,
            tokensForLiquidity,
            0,
            0,
            address(this),
            deadline
        );

        payable(royaltyAddress).transfer(amountSystemFeeRaised);
        payable(manager).transfer(
            totalRaised - amountNativeAddLP - amountSystemFeeRaised
        );
        isListed = true;
    }

    function cancel() external onlyManager nonReentrant {
        require(getStatus() == EStatus.Failed, "Pool is not failed");
        IERC20(tokenAddress).safeTransfer(
            address(msg.sender),
            tokensForLiquidity + tokensForPresale
        );
        isCanceled = true;
    }

    // end manager project setup

    function deposit() external payable nonReentrant {
        require(getStatus() == EStatus.Live, "Pool is not live");
        uint256 amountDeposit = msg.value;
        uint256 amountAvailable = userAllocations[_msgSender()];
        totalContributors++;
        totalRaised += amountDeposit;
        // maxContribution == 0 if  Infinity
        if (maxContribution > 0) {
            require(
                amountDeposit + amountAvailable <= maxContribution,
                "Amount deposit is over max contribution"
            );
        }
        userAllocations[_msgSender()] += amountDeposit;
        emit Deposit(
            _msgSender(),
            amountDeposit,
            userAllocations[_msgSender()]
        );
    }

    function refund() external nonReentrant {
        require(getStatus() == EStatus.Live, "Pool is not live");
        uint256 amountAvailable = userAllocations[_msgSender()];
        require(amountAvailable > 0, "Amount available is zero");
        uint256 amountFeeRefund = (amountAvailable * percentRefund) /
            ONE_HUNDRED_PERCENT;
        userAllocations[_msgSender()] = 0;
        totalContributors--;
        totalRaised -= amountAvailable;
        payable(royaltyAddress).transfer(amountFeeRefund);
        payable(_msgSender()).transfer(amountAvailable - amountFeeRefund);
        emit Refund(_msgSender(), amountAvailable);
    }

    function withdraw() external nonReentrant {
        require(
            getStatus() == EStatus.Failed || getStatus() == EStatus.Canceled,
            "You can only withdraw when the pool failed or canceled"
        );
        uint256 amountAvailable = userAllocations[_msgSender()];
        require(amountAvailable > 0, "Amount available is zero");
        // totalContributors--;
        // totalRaised -= amountAvailable;
        payable(_msgSender()).transfer(amountAvailable);
    }

    // x NativeToken = y token
    function calculateSwapRate(
        uint256 _amountIn
    ) public view returns (uint256) {
        if (totalRaised == 0 || _amountIn == 0) {
            return 0;
        }
        return (_amountIn * tokensForPresale) / totalRaised;
    }

    function getAmountClaimByUser(address _user) public view returns (uint256) {
        return calculateSwapRate(userAllocations[_user]);
    }

    function claim() external nonReentrant {
        require(getStatus() == EStatus.Listed, "Pool is not listed");
        uint256 amountAvailable = userAllocations[_msgSender()];
        require(amountAvailable > 0, "Amount available is zero");
        // send token for user
        uint256 amountClaim = calculateSwapRate(amountAvailable);
        userClaimed[_msgSender()] = true;
        IERC20(tokenAddress).safeTransfer(address(msg.sender), amountClaim);
    }
}
