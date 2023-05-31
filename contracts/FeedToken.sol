// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract FeedToken is Ownable, ERC20 {
    constructor() ERC20("Feed Token", "FEED") {}

    function mint(address _to, uint256 _amount) public onlyOwner {
        super._mint(_to, _amount);
    }

    function burn(address _to, uint256 _amount) public onlyOwner {
        super._burn(_to, _amount);
    }
}
