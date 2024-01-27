// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
pragma abicoder v2;

// import "hardhat/console.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import {ERC20Template} from "./ERC20Template.sol";

contract TokenFactoryV1 is Ownable, ReentrancyGuard {
    // address fee
    address public royaltyAddress;
    // value fee to Native token
    uint256 public royaltyFee;

    uint256 public totalToken;

    mapping(address => bool) public admins;

    event DeployToken(uint256 tokenIdex, address tokenAddress, address owner);

    modifier onlyAdmin() {
        require(admins[_msgSender()], "Admin: caller is not the admin");
        _;
    }

    constructor(address _royaltyAddress, uint256 _royaltyFee) {
        require(
            _royaltyAddress != address(0),
            "Royalty Address is Zero address"
        );
        royaltyAddress = _royaltyAddress;
        royaltyFee = _royaltyFee;
        admins[_msgSender()] = true;
    }

    function updateAdmin(
        address _admin,
        bool _isAdd
    ) external onlyAdmin nonReentrant {
        require(_admin != address(0), "Admin address is Zero ");
        admins[_admin] = _isAdd;
    }

    function deploy(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply
    ) external payable nonReentrant {
        // create token
        totalToken++;
        ERC20Template token = new ERC20Template(
            _name,
            _symbol,
            _totalSupply,
            msg.sender
        );
        emit DeployToken(totalToken, address(token), msg.sender);
        payable(royaltyAddress).transfer(royaltyFee);
    }

    function changeRoyaltyAddress(
        address _royaltyAddress
    ) external onlyAdmin nonReentrant {
        royaltyAddress = _royaltyAddress;
    }

    function changeRoyaltyFee(
        uint256 _royaltyFee
    ) external onlyAdmin nonReentrant {
        royaltyFee = _royaltyFee;
    }
}
