// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "./ERC404.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract ERC404Template is ERC404 {
    string public baseUrl;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _totalSupply,
        string memory _baseUrl,
        address _owner
    ) ERC404(_name, _symbol, 18, _totalSupply, _owner) {
        balanceOf[_owner] = _totalSupply * 10 ** 18;
        baseUrl = _baseUrl;
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

    function setBaseUrl(string memory _baseUrl) public onlyOwner {
        baseUrl = _baseUrl;
    }

    function setNameSymbol(
        string memory _name,
        string memory _symbol
    ) public onlyOwner {
        _setNameSymbol(_name, _symbol);
    }
}
