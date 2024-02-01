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
    uint256 public creationFee;

    uint256 public totalToken;

    mapping(address => bool) public admins;

    event DeployToken(
        address token,
        string name,
        string symbol,
        uint256 totalSupply
    );

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

    function deploy(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply
    ) external payable nonReentrant returns (address tokenAddress) {
        // create token
        totalToken++;
        ERC20Template token = new ERC20Template(
            _name,
            _symbol,
            _totalSupply,
            msg.sender
        );
        payable(royaltyAddress).transfer(creationFee);
        emit DeployToken(address(token), _name, _symbol, _totalSupply);
        return (address(token));
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
}
