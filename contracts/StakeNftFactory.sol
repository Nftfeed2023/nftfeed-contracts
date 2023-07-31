// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
pragma abicoder v2;

// import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "./StakeERC721Fixed.sol";

contract StakeNftFactory is Ownable, ReentrancyGuard {
    uint256 public totalPool = 0;

    // poolId => poolAddress
    mapping(uint256 => address) public containerPools;

    constructor() {}

    function deploy(
        address _nftAddress,
        uint256 _nftPrice,
        uint256 _daysLocked,
        uint256 _rewardPerSecond,
        uint256 _startTime,
        uint256 _endTime
    ) external {
        StakeERC721Fixed pool = new StakeERC721Fixed(
            _nftAddress,
            _nftPrice,
            _daysLocked,
            _rewardPerSecond,
            _startTime,
            _endTime
        );
        totalPool++;
        containerPools[totalPool] = address(pool);
    }
}
