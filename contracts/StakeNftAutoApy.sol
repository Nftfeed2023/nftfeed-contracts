// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
pragma abicoder v2;

// import "hardhat/console.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {EnumerableSet} from "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import {ERC721Holder} from "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

// Support erc721
contract StakeNftAutoApy is Ownable, ReentrancyGuard, ERC721Holder {
    using SafeERC20 for IERC20;
    using EnumerableSet for EnumerableSet.UintSet;

    uint256 public constant PRECISION_FACTOR = 1e12;

    struct UserInfo {
        EnumerableSet.UintSet tokenIds; // tokenIds by user
        uint256 rewardDebt; // Reward debt
    }

    // ERC20 token reward
    address public tokenReward;
    address public nft;

    uint256 public startTime;
    uint256 public endTimeBonus;

    // The seconds  of the last pool update
    uint256 public lastRewardSeconds;

    // Tokens rewarded per seconds.
    uint256 public rewardPerSeconds;

    // Accrued token per share
    uint256 public accTokenPerShare;

    // // user => rewardDebt amount token
    // mapping(address => uint256) public rewardDebtByUser;
    // // user => tokenIds
    // mapping(address => EnumerableSet.UintSet) private tokenIdsByUser;

    mapping(address => UserInfo) private userInfo;

    modifier validateZeroAddress(address _address) {
        require(_address != address(0), "Address is not zero");
        _;
    }

    modifier verifyStartTimeStake() {
        require(block.timestamp >= startTime, "Not active time");
        _;
    }

    constructor(
        address _tokenReward,
        address _nft,
        uint256 _startTime,
        uint256 _endTimeBonus
    ) validateZeroAddress(_tokenReward) validateZeroAddress(_nft) {
        tokenReward = _tokenReward;
        nft = _nft;
        startTime = _startTime;
        endTimeBonus = _endTimeBonus;
    }

    /*
     * @notice Update reward variables of the given pool to be up-to-date.
     */
    function _updatePool() internal {
        if (block.timestamp <= lastRewardSeconds) {
            return;
        }
        uint256 stakedNftSupply = IERC721(nft).balanceOf(address(this));
        if (stakedNftSupply == 0) {
            lastRewardSeconds = block.timestamp;
            return;
        }
        uint256 multiplier = _getMultiplier(lastRewardSeconds, block.timestamp);
        uint256 amountReward = multiplier * rewardPerSeconds;
        accTokenPerShare += (amountReward * PRECISION_FACTOR) / stakedNftSupply;
        lastRewardSeconds = block.timestamp;
    }

    function _getMultiplier(
        uint256 _from,
        uint256 _to
    ) internal view returns (uint256) {
        if (_from < startTime) {
            _from = startTime;
        }
        if (_to <= endTimeBonus) {
            return _to - _from;
        } else {
            if (_from >= endTimeBonus) {
                return 0;
            } else {
                return endTimeBonus - _from;
            }
        }
    }

    function stakes(
        uint256[] calldata _tokenIds
    ) external nonReentrant verifyStartTimeStake {
        require(_tokenIds.length > 0, "Empty nft input");

        UserInfo storage user = userInfo[msg.sender];

        require(
            user.tokenIds.length() + _tokenIds.length > 40,
            "Qty stake over 40"
        );
        _updatePool();
        if (user.tokenIds.length() > 0) {
            uint256 pending = ((user.tokenIds.length() * accTokenPerShare) /
                PRECISION_FACTOR) - user.rewardDebt;
            if (pending > 0) {
                // tranfer reward to user
                IERC20(tokenReward).safeTransfer(address(msg.sender), pending);
            }
        }

        // send nft to pool
        for (uint256 i = 0; i < _tokenIds.length; i++) {
            user.tokenIds.add(_tokenIds[i]);
            IERC721(nft).safeTransferFrom(
                address(msg.sender),
                address(this),
                _tokenIds[i]
            );
        }
        user.rewardDebt =
            (user.tokenIds.length() * accTokenPerShare) /
            PRECISION_FACTOR;
    }

    function unStakes(uint256[] calldata _tokenIds) external nonReentrant {
        UserInfo storage user = userInfo[msg.sender];
        require(_tokenIds.length > 0, "Empty nft input");

        _updatePool();

        uint256 pending = (user.tokenIds.length() * accTokenPerShare) /
            PRECISION_FACTOR -
            user.rewardDebt;

        for (uint256 i = 0; i < _tokenIds.length; i++) {
            user.tokenIds.remove(_tokenIds[i]);
        }

        if (pending > 0) {
            IERC20(tokenReward).safeTransfer(address(msg.sender), pending);
        }

        user.rewardDebt =
            (user.tokenIds.length() * accTokenPerShare) /
            PRECISION_FACTOR;
    }

    function stopReward() external onlyOwner {
        endTimeBonus = block.timestamp;
    }

    function updateRewardPerSeconds(
        uint256 _rewardPerSeconds
    ) external onlyOwner {
        require(block.timestamp < startTime, "Pool has started");
        rewardPerSeconds = _rewardPerSeconds;
    }

    function updateTimeActive(
        uint256 _startTime,
        uint256 _endTimeBonus
    ) external onlyOwner {
        require(block.timestamp < startTime, "Pool has started");
        require(
            _startTime < _endTimeBonus,
            "New startTime must be lower than new endBTime"
        );
        require(
            block.timestamp < _startTime,
            "New startTime must be higher than current time"
        );

        startTime = _startTime;
        endTimeBonus = _endTimeBonus;

        // Set the lastRewardSeconds as the startTime
        lastRewardSeconds = startTime;
    }

    function pendingReward(address _user) external view returns (uint256) {
        UserInfo storage user = userInfo[_user];
        uint256 stakedNftSupply = IERC721(nft).balanceOf(address(this));
        if (block.timestamp > lastRewardSeconds && stakedNftSupply != 0) {
            uint256 multiplier = _getMultiplier(
                lastRewardSeconds,
                block.timestamp
            );
            uint256 amountReward = multiplier * rewardPerSeconds;

            uint256 adjustedTokenPerShare = accTokenPerShare +
                (amountReward * PRECISION_FACTOR) /
                stakedNftSupply;

            return
                (user.tokenIds.length() * adjustedTokenPerShare) /
                PRECISION_FACTOR -
                user.rewardDebt;
        } else {
            return
                (user.tokenIds.length() * accTokenPerShare) /
                PRECISION_FACTOR -
                user.rewardDebt;
        }
    }

    function emergencyRewardWithdraw(uint256 _amount) external onlyOwner {
        IERC20(tokenReward).safeTransfer(address(msg.sender), _amount);
    }
}
