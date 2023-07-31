// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
pragma abicoder v2;

// import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

contract StakeERC721Fixed is Ownable, ReentrancyGuard, ERC721Holder {
    using EnumerableSet for EnumerableSet.UintSet;
    // The precision factor
    // uint256 public constant PRECISION_FACTOR = 1e12;

    address public nftAddress;
    uint public chainId;
    uint256 public nftPrice;

    // days locked nft;
    uint256 public daysLocked;
    // eth bonus by ${daysLocked}
    uint256 public rewardPerSecond;
    // start time Stake
    uint256 public startTime;
    // end time Stake
    uint256 public endTime;

    // user address => tokenIds
    mapping(address => EnumerableSet.UintSet) private tokenIdsOfUser;

    // tokenId => startTime stake
    mapping(uint256 => uint256) private startTimeStakeOfTokenId;

    modifier validateNftAddress(address _nftAddress) {
        require(_nftAddress != address(0), "NFT address is zere address");

        _;
    }

    modifier validateTimeStake(uint256 _startTime, uint256 _endTime) {
        require(_startTime <= _endTime, "Start time is greater than end time");
        require(
            _endTime >= block.timestamp,
            "Start time is greater than end time"
        );

        _;
    }

    // Modifier time stake
    modifier verifyTimeStake() {
        require(block.timestamp >= startTime, "Not active time");
        require(block.timestamp <= endTime, "Pool is close");
        _;
    }

    constructor(
        address _nftAddress,
        uint256 _nftPrice,
        uint256 _daysLocked,
        uint256 _rewardPerSecond,
        uint256 _startTime,
        uint256 _endTime
    ) {
        chainId = block.chainid;
        _setupParams(
            _nftAddress,
            _nftPrice,
            _daysLocked,
            _rewardPerSecond,
            _startTime,
            _endTime
        );
    }

    function _setupParams(
        address _nftAddress,
        uint256 _nftPrice,
        uint256 _daysLocked,
        uint256 _rewardPerSecond,
        uint256 _startTime,
        uint256 _endTime
    )
        private
        nonReentrant
        onlyOwner
        validateNftAddress(_nftAddress)
        validateTimeStake(_startTime, _endTime)
    {
        require(_nftPrice > 0, "Price invalid");
        require(_daysLocked > 0, "Days locker invalid");
        nftAddress = _nftAddress;
        nftPrice = _nftPrice;
        daysLocked = _daysLocked;
        rewardPerSecond = _rewardPerSecond;
        startTime = _startTime;
        endTime = _endTime;
    }

    function setupParams(
        address _nftAddress,
        uint256 _nftPrice,
        uint256 _daysLocked,
        uint256 _rewardPerSecond,
        uint256 _startTime,
        uint256 _endTime
    ) external {
        _setupParams(
            _nftAddress,
            _nftPrice,
            _daysLocked,
            _rewardPerSecond,
            _startTime,
            _endTime
        );
    }

    function stakes(
        uint256[] memory _tokenIds
    ) external nonReentrant verifyTimeStake {
        require(_tokenIds.length > 0, "Empty input tokenIds");
        for (uint i = 0; i < _tokenIds.length; i++) {
            IERC721(nftAddress).safeTransferFrom(
                address(msg.sender),
                address(this),
                _tokenIds[i]
            );
            tokenIdsOfUser[address(msg.sender)].add(_tokenIds[i]);
        }
    }

    function unStake() external nonReentrant {
        require(block.timestamp > endTime, "Please wailt pool finish");
        uint256 size = tokenIdsOfUser[address(msg.sender)].length();
        require(size > 0, "User empty nft staked");
        for (uint i = 0; i < size; i++) {
            uint256 tokenId = tokenIdsOfUser[address(msg.sender)].at(i);
            IERC721(nftAddress).safeTransferFrom(
                address(this),
                address(msg.sender),
                tokenId
            );
            tokenIdsOfUser[address(msg.sender)].remove(tokenId);
        }
    }

    function min(
        uint256 a,
        uint256 b,
        uint256 c
    ) private pure returns (uint256) {
        if (a <= b && a <= c) {
            return a;
        } else if (b <= a && b <= c) {
            return b;
        } else {
            return c;
        }
    }

    function _getPendingRewardByTokenIdOfTime(
        uint256 _tokenId,
        uint256 _time
    ) private view returns (uint256) {
        uint256 startTimeOfUser = startTimeStakeOfTokenId[_tokenId];
        uint256 endTimeOfUser = startTimeOfUser + (daysLocked * 1 days);
        if (startTimeOfUser == 0) {
            return 0;
        }
        if (_time <= startTimeOfUser) {
            return 0;
        }
        uint256 endTimeCal = min(endTimeOfUser, _time, endTime);
        return (endTimeCal - startTimeOfUser) * rewardPerSecond;
    }

    function getPendingRewardByTokenIdOfTime(
        uint256 _tokenId,
        uint256 _time
    ) public view returns (uint256) {
        return _getPendingRewardByTokenIdOfTime(_tokenId, _time);
    }

    function getPendingRewardByTokenId(
        uint256 _tokenId
    ) public view returns (uint256) {
        return _getPendingRewardByTokenIdOfTime(_tokenId, block.timestamp);
    }

    function _getPendingRewardByUserOfTime(
        address _user,
        uint256 _time
    ) private view returns (uint256) {
        uint256 result = 0;
        uint256 size = tokenIdsOfUser[address(_user)].length();
        for (uint256 i = 0; i < size; i++) {
            result += _getPendingRewardByTokenIdOfTime(
                tokenIdsOfUser[address(_user)].at(i),
                _time
            );
        }
        return result;
    }

    function getPendingRewardByUserOfTime(
        address _user,
        uint256 _time
    ) public view returns (uint256) {
        return _getPendingRewardByUserOfTime(_user, _time);
    }

    function getPendingRewardByUser(
        address _user
    ) public view returns (uint256) {
        return _getPendingRewardByUserOfTime(_user, block.timestamp);
    }
}
