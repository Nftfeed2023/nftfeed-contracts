// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
pragma abicoder v2;
import {Address} from "@openzeppelin/contracts/utils/Address.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract FeedAgg is Ownable, ReentrancyGuard {
    uint256 public constant ONE_HUNDRED_PERCENT = 100 * 100; // 100%
    using Address for address;
    address public royaltyAddress;
    // value fee to native token (ETH,BNB,...)
    uint256 public mintFee;
    uint256 public crawlFee;
    uint256 public percentShareCrawler;
    // nft address => crawler address
    mapping(address => address) public managers;

    event TransactionVerification(address nftAddress, uint256 qty, uint256 fee);

    event Crawl(address nftAddress, address manager, uint256 fee);

    constructor(
        address _royaltyAddress,
        uint256 _crawlFee,
        uint256 _mintFee,
        uint256 _percentShareCrawler
    ) {
        require(
            _royaltyAddress != address(0),
            "Royalty Address is Zero address"
        );
        require(
            _percentShareCrawler <= ONE_HUNDRED_PERCENT,
            "Percent over 100%"
        );
        royaltyAddress = _royaltyAddress;
        crawlFee = _crawlFee;
        mintFee = _mintFee;
    }

    function changeRoyaltyAddress(
        address _royaltyAddress
    ) external nonReentrant {
        require(
            royaltyAddress == msg.sender || msg.sender == owner(),
            "Address not permisson change royalty address"
        );
        royaltyAddress = _royaltyAddress;
    }

    function changeMintFee(uint256 _mintFee) external nonReentrant {
        require(
            royaltyAddress == msg.sender || msg.sender == owner(),
            "Address not permisson change royalty fee"
        );
        mintFee = _mintFee;
    }

    function changeCrawlFee(uint256 _crawlFee) external nonReentrant {
        require(
            royaltyAddress == msg.sender || msg.sender == owner(),
            "Address not permisson change royalty fee"
        );
        crawlFee = _crawlFee;
    }

    function changePercentShareCrawler(
        uint256 _percentShareCrawler
    ) external nonReentrant {
        require(
            royaltyAddress == msg.sender || msg.sender == owner(),
            "Address not permisson change royalty fee"
        );
        require(
            _percentShareCrawler <= ONE_HUNDRED_PERCENT,
            "Percent over 100%"
        );
        percentShareCrawler = percentShareCrawler;
    }

    function crawl(address _nftAddress) external payable nonReentrant {
        require(managers[_nftAddress] == address(0), "Collection crawled");
        managers[_nftAddress] = _msgSender();
        payable(royaltyAddress).transfer(crawlFee);
        emit Crawl(_nftAddress, _msgSender(), crawlFee);
    }

    function transactionVerification(
        address _nftAddress,
        uint256 _qty
    ) external payable nonReentrant {
        uint256 fee = getFeeByQty(_qty);
        if (managers[_nftAddress] == address(0)) {
            payable(royaltyAddress).transfer(fee);
            emit TransactionVerification(_nftAddress, _qty, fee);
        } else {
            uint256 feeShare = (fee * percentShareCrawler) /
                ONE_HUNDRED_PERCENT;
            if (feeShare > 0) {
                payable(managers[_nftAddress]).transfer(feeShare);
            }
            if (fee - feeShare > 0) {
                payable(royaltyAddress).transfer(fee - feeShare);
            }
            emit TransactionVerification(_nftAddress, _qty, fee);
        }
    }

    function getFeeByQty(uint256 _qty) public view returns (uint256) {
        return _qty * mintFee;
    }
}
