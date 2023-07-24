// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
pragma abicoder v2;

// import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

import "./ERC721Template.sol";

contract MintNftFactory is Ownable, ReentrancyGuard, ERC721Holder {
    address public royaltyAddress;

    // value fee to ETH
    uint256 public royaltyFee;
    uint256 public totalPool = 0;

    // poolId => nft address
    mapping(uint256 => address) public containerNfts;
    // nft address => priceNft
    mapping(address => uint256) public mapPrice;
    // nft address => address manager
    mapping(address => address) public managers;
    // nft address => time end
    mapping(address => uint256) public endTimes;

    // nft address => max allocation mint
    mapping(address => uint256) public maxTotalSupplys;

    // nft address => user address => minted
    mapping(address => mapping(address => bool)) public minteds;

    event DeployNft(uint256 poolId, address nftAddress, address manager);

    constructor(address _royaltyAddress, uint256 _royaltyFee) {
        require(
            _royaltyAddress != address(0),
            "Royalty Address is Zero address"
        );
        royaltyAddress = _royaltyAddress;
        royaltyFee = _royaltyFee;
    }

    function deploy(
        string memory _name,
        string memory _symbol,
        string memory _baseUrlNft,
        uint256 _priceNft, // price by ETH
        uint256 _endTime,
        uint256 _maxTotalSupply
    ) external nonReentrant returns (uint256 poolId, address nftAddress) {
        // create NFT
        totalPool++;
        ERC721Template nft = new ERC721Template(_name, _symbol, _baseUrlNft);
        containerNfts[totalPool] = address(nft);
        mapPrice[address(nft)] = _priceNft;
        managers[address(nft)] = msg.sender;
        endTimes[address(nft)] = _endTime;
        maxTotalSupplys[address(nft)] = _maxTotalSupply;
        emit DeployNft(totalPool, address(nft), msg.sender);
        return (totalPool, address(nft));
    }

    function mint(
        address _nft
    ) external payable nonReentrant returns (uint256 tokenId) {
        require(block.timestamp <= endTimes[_nft], "Time mint ended");
        require(managers[_nft] != address(0), "Nft not config manager");
        require(
            maxTotalSupplys[_nft] > ERC721Template(_nft).totalSupply(),
            "Qty over max total supply"
        );
        require(!minteds[_nft][msg.sender], "User is minted");
        uint256 amount = mapPrice[_nft] + royaltyFee;
        require(msg.value >= amount, "Not enough amount to mint");
        payable(royaltyAddress).transfer(royaltyFee);
        payable(managers[_nft]).transfer(mapPrice[_nft]);
        tokenId = ERC721Template(_nft).mint(address(msg.sender));
        minteds[_nft][msg.sender] = true;
        return tokenId;
    }

    function changeRoyaltyAddress(
        address _royaltyAddress
    ) external nonReentrant {
        require(royaltyAddress == msg.sender, "Owner not old royalty address");
        royaltyAddress = _royaltyAddress;
    }

    function changeRoyaltyFee(uint256 _royaltyFee) external nonReentrant {
        require(royaltyAddress == msg.sender, "Owner not old royalty address");
        royaltyFee = _royaltyFee;
    }

    function getAmountOut(
        address _nft
    ) public view returns (uint256 amountOut) {
        amountOut = mapPrice[_nft] + royaltyFee;
        return amountOut;
    }
}
