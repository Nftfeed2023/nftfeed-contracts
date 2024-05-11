// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract VixFaucetPool is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    mapping(address => bool) public admins;
    // user => next time faucet token
    mapping(address => uint256) public timeFaucetTokenOfUser;

    address tokenC98 = 0xeE63687645ce6aaE47e6D20Db2b9FD089D2bdf4c;
    address tokenCUSD = 0xE2d9d45921BCfCCf0894B1D532b3F6Afe591F748;

    uint256 public amountC98;
    uint256 public amountCUSD;
    uint256 public amountVIC;
    uint256 public hoursNextClaim;

    // uint256 public startTime;
    // uint256 public endTime;

    modifier onlyAdmin() {
        require(admins[_msgSender()], "Admin: caller is not the admin");
        _;
    }

    constructor(
        uint256 _amountC98,
        uint256 _amountCUSD,
        uint256 _amountVIC,
        uint256 _hoursNextClaim
    ) {
        amountC98 = _amountC98;
        amountCUSD = _amountCUSD;
        amountVIC = _amountVIC;
        hoursNextClaim = _hoursNextClaim;
        admins[_msgSender()] = true;
    }

    receive() external payable {}

    function setupAmountParams(
        uint256 _amountC98,
        uint256 _amountCUSD,
        uint256 _amountVIC
    ) external nonReentrant onlyOwner {
        amountC98 = _amountC98;
        amountCUSD = _amountCUSD;
        amountVIC = _amountVIC;
    }

    function setupTokemParams(
        address _tokenC98,
        address _tokenCUSD
    ) external nonReentrant onlyOwner {
        tokenC98 = _tokenC98;
        tokenCUSD = _tokenCUSD;
    }

    function setupHoursNextClaim(
        uint256 _hoursNextClaim
    ) external nonReentrant onlyOwner {
        hoursNextClaim = _hoursNextClaim;
    }

    function updateAdmin(
        address _admin,
        bool _isAdd
    ) external onlyOwner nonReentrant {
        require(_admin != address(0), "Admin address is Zero ");
        admins[_admin] = _isAdd;
    }

    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function faucetTo(address payable _user) external onlyAdmin nonReentrant {
        require(
            timeFaucetTokenOfUser[_user] + hoursNextClaim * 1 hours <
                block.timestamp,
            "User is fauceted to session"
        );
        IERC20(tokenC98).safeTransfer(_user, amountC98);
        IERC20(tokenCUSD).safeTransfer(_user, amountCUSD);
        _user.transfer(amountVIC);
        timeFaucetTokenOfUser[_user] = block.timestamp;
    }

    function withdraw() external nonReentrant {
        IERC20(tokenC98).safeTransfer(
            owner(),
            ERC20(tokenC98).balanceOf(address(this))
        );
        IERC20(tokenCUSD).safeTransfer(
            owner(),
            ERC20(tokenCUSD).balanceOf(address(this))
        );
        payable(owner()).transfer(getBalance());
    }
}
