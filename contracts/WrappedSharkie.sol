// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract WrappedSharkie is ERC20 {
    constructor() ERC20("Wrapped Sharkie", "WSHARKIE") {
        _mint(msg.sender, uint256(1_000_000_000) * uint256(10) ** decimals());
    }
}
