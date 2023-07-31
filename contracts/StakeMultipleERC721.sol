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

contract StakeMultipleERC721 is Ownable, ReentrancyGuard, ERC721Holder {
    using EnumerableSet for EnumerableSet.UintSet;

    // The precision factor
    // uint256 public constant PRECISION_FACTOR = 1e12;

    struct PoolInfo {
        // days locked nft;
        uint256 daysLocked;
        // eth bonus by ${daysLocked}
        uint256 rewardPerSecond;
        // start time Stake
        uint256 startTime;
        // end time Stake
        uint256 endTime;
    }

    uint256 public totalPool = 0;
    uint256 public chainId;
    uint256 public nftPrice;

    // poolId => nftAddress
    mapping(uint256 => address) public containerNfts;
    mapping(address => bool) public authorizeNfts;

    // nftAddress => PoolInfo
    mapping(address => PoolInfo) public poolInfos;
    // nftAddress => user address => tokenIds
    mapping(address => mapping(address => EnumerableSet.UintSet))
        private tokenIdsOfUser;

    //nftAddress =>tokenId => startTime stake
    mapping(address => mapping(uint256 => uint256))
        public startTimeStakeOfTokenId;

    //nftAddress => qty staked
    mapping(address => uint256) public qtyStaked;

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
    modifier verifyTimeStake(address _nftAddress) {
        require(
            block.timestamp >= poolInfos[_nftAddress].startTime,
            "Not active time"
        );
        require(
            block.timestamp <= poolInfos[_nftAddress].endTime,
            "Pool is close"
        );
        _;
    }

    modifier verifyAuthNft(address _nftAddress) {
        require(authorizeNfts[_nftAddress], "Nft not permission pool");
        _;
    }

    constructor(uint256 _nftPrice) {
        chainId = block.chainid;
        require(_nftPrice > 0, "Price invalid");
        nftPrice = _nftPrice;
    }

    function _updateParamsPool(
        address _nftAddress,
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
        require(_daysLocked > 0, "Days locker invalid");
        PoolInfo storage poolInfo = poolInfos[_nftAddress];
        poolInfo.daysLocked = _daysLocked;
        poolInfo.rewardPerSecond = _rewardPerSecond;
        poolInfo.startTime = _startTime;
        poolInfo.endTime = _endTime;
        if (!authorizeNfts[_nftAddress]) {
            authorizeNfts[_nftAddress] = true;
            totalPool++;
            containerNfts[totalPool] = _nftAddress;
        }
    }

    function updateParamsPool(
        address _nftAddress,
        uint256 _daysLocked,
        uint256 _rewardPerSecond,
        uint256 _startTime,
        uint256 _endTime
    ) external {
        _updateParamsPool(
            _nftAddress,
            _daysLocked,
            _rewardPerSecond,
            _startTime,
            _endTime
        );
    }

    function updateParamsPools(
        address[] calldata _nftAddresss,
        PoolInfo[] calldata _poolInfos
    ) external {
        for (uint i = 0; i < _nftAddresss.length; i++) {
            _updateParamsPool(
                _nftAddresss[i],
                _poolInfos[i].daysLocked,
                _poolInfos[i].rewardPerSecond,
                _poolInfos[i].startTime,
                _poolInfos[i].endTime
            );
        }
    }

    function stakes(
        address _nftAddress,
        uint256[] memory _tokenIds
    )
        external
        nonReentrant
        verifyAuthNft(_nftAddress)
        verifyTimeStake(_nftAddress)
    {
        require(_tokenIds.length > 0, "Empty input tokenIds");
        require(authorizeNfts[_nftAddress], "Nft not permission pool");
        for (uint i = 0; i < _tokenIds.length; i++) {
            IERC721(_nftAddress).safeTransferFrom(
                address(msg.sender),
                address(this),
                _tokenIds[i]
            );
            tokenIdsOfUser[_nftAddress][address(msg.sender)].add(_tokenIds[i]);
        }
        qtyStaked[_nftAddress] += _tokenIds.length;
    }

    function unStake(
        address _nftAddress
    ) external nonReentrant verifyAuthNft(_nftAddress) {
        require(
            block.timestamp > poolInfos[_nftAddress].endTime,
            "Please wailt pool finish"
        );
        uint256 size = tokenIdsOfUser[_nftAddress][address(msg.sender)]
            .length();
        require(size > 0, "User empty nft staked");
        for (uint i = 0; i < size; i++) {
            uint256 tokenId = tokenIdsOfUser[_nftAddress][address(msg.sender)]
                .at(i);
            IERC721(_nftAddress).safeTransferFrom(
                address(this),
                address(msg.sender),
                tokenId
            );
            tokenIdsOfUser[_nftAddress][address(msg.sender)].remove(tokenId);
        }
        qtyStaked[_nftAddress] -= size;
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
        address _nftAddress,
        uint256 _tokenId,
        uint256 _time
    ) private view returns (uint256) {
        uint256 startTimeOfUser = startTimeStakeOfTokenId[_nftAddress][
            _tokenId
        ];
        uint256 endTimeOfUser = startTimeOfUser +
            (poolInfos[_nftAddress].daysLocked * 1 days);
        if (startTimeOfUser == 0) {
            return 0;
        }
        if (_time <= startTimeOfUser) {
            return 0;
        }
        uint256 endTimeCal = min(
            endTimeOfUser,
            _time,
            poolInfos[_nftAddress].endTime
        );
        return
            (endTimeCal - startTimeOfUser) *
            poolInfos[_nftAddress].rewardPerSecond;
    }

    function getPendingRewardByTokenIdOfTime(
        address _nftAddress,
        uint256 _tokenId,
        uint256 _time
    ) public view returns (uint256) {
        return _getPendingRewardByTokenIdOfTime(_nftAddress, _tokenId, _time);
    }

    function getPendingRewardByTokenId(
        address _nftAddress,
        uint256 _tokenId
    ) public view returns (uint256) {
        return
            _getPendingRewardByTokenIdOfTime(
                _nftAddress,
                _tokenId,
                block.timestamp
            );
    }

    function _getPendingRewardByUserOfTime(
        address _nftAddress,
        address _user,
        uint256 _time
    ) private view returns (uint256) {
        uint256 result = 0;
        uint256 size = tokenIdsOfUser[_nftAddress][address(_user)].length();
        for (uint256 i = 0; i < size; i++) {
            result += _getPendingRewardByTokenIdOfTime(
                _nftAddress,
                tokenIdsOfUser[_nftAddress][address(_user)].at(i),
                _time
            );
        }
        return result;
    }

    function getPendingRewardByUserOfTime(
        address _nftAddress,
        address _user,
        uint256 _time
    ) public view returns (uint256) {
        return _getPendingRewardByUserOfTime(_nftAddress, _user, _time);
    }

    function getPendingRewardByUser(
        address _nftAddress,
        address _user
    ) public view returns (uint256) {
        return
            _getPendingRewardByUserOfTime(_nftAddress, _user, block.timestamp);
    }

    function getQtyStakedByUser(
        address _nftAddress,
        address _user
    ) public view returns (uint256) {
        return tokenIdsOfUser[_nftAddress][_user].length();
    }

    function grantedUnStake(
        address _nftAddress,
        address _user
    ) public view returns (bool) {
        return
            tokenIdsOfUser[_nftAddress][_user].length() > 0 &&
            block.timestamp > poolInfos[_nftAddress].endTime;
    }
}
