// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract ERC721TemplateGMMT is Ownable, Pausable, ERC721Enumerable {
    using Counters for Counters.Counter;
    using EnumerableSet for EnumerableSet.UintSet;

    Counters.Counter public tokenIdTracker;
    string public baseUrl;

    // code
    mapping(bytes32 => bool) public whiteListCodes;
    //
    bool public isMinting;

    modifier validateZeroAddress(address _address) {
        require(_address != address(0), "Address is not zero");
        _;
    }

    modifier verifyMint() {
        require(isMinting, "Stop mint");
        _;
    }

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _baseUrl
    ) ERC721(_name, _symbol) {
        baseUrl = _baseUrl;
    }

    function setBaseUrl(string memory _baseUrl) public onlyOwner {
        baseUrl = _baseUrl;
    }

    function endcodeString(string calldata _str) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_str));
    }

    function setIsMint(bool _isMinting) external onlyOwner {
        isMinting = _isMinting;
    }

    function updateWhiteList(
        string[] calldata _codes,
        bool _isAdd
    ) external onlyOwner {
        for (uint256 i = 0; i < _codes.length; i++) {
            whiteListCodes[endcodeString(_codes[i])] = _isAdd;
        }
    }

    function mints(uint256 _qty, string calldata _code) external verifyMint {
        require(_qty > 0, "Qty cannot be 0");
        require(bytes(_code).length != 0, "Empty code input");
        require(
            whiteListCodes[endcodeString(_code)],
            "The code does not exist"
        );
        for (uint256 i = 0; i < _qty; i++) {
            tokenIdTracker.increment();
            uint256 tokenId = tokenIdTracker.current();
            _mint(_msgSender(), tokenId);
        }
    }

    function tokenURI(
        uint256 _tokenId
    ) public view override returns (string memory) {
        return (
            string(
                abi.encodePacked(
                    baseUrl,
                    "/",
                    Strings.toHexString(uint160(address(this)), 20),
                    "/",
                    Strings.toString(_tokenId)
                )
            )
        );
    }

    function tokenIdsOfOwner(
        address _owner
    ) external view returns (uint256[] memory tokenIds) {
        uint256 balance = balanceOf(_owner);
        tokenIds = new uint256[](balance);
        for (uint256 i = 0; i < balance; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokenIds;
    }

    function viewPageTokenIdsOfOwner(
        address _owner,
        uint256 _pageIndex,
        uint256 _pageSize
    ) external view returns (uint256[] memory data, uint256 total) {
        total = balanceOf(_owner);
        if (_pageIndex < 1) {
            _pageIndex = 1;
        }
        uint256 startIndex = (_pageIndex - 1) * _pageSize;
        if (startIndex >= total) {
            return (new uint256[](0), total);
        }

        uint256 endIndex = _pageIndex * _pageSize > total
            ? total
            : _pageIndex * _pageSize;
        data = new uint256[](endIndex - startIndex);
        for (uint256 i = startIndex; i < endIndex; i++) {
            data[i - startIndex] = tokenOfOwnerByIndex(_owner, i);
        }
        return (data, total);
    }
}
