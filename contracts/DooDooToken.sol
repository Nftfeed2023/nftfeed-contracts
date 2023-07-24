// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./interfaces/IPancakeRouter.sol";
import "./interfaces/IPancakeFactory.sol";
import "./interfaces/IPancakePair.sol";

contract DooDooToken is ERC20, Ownable {
    mapping(address => bool) public dexPairs;

    uint256 public constant ONE_HUNDRED_PERCENT = 100 * 100; // 100%
    uint256 public sellTax = 100; // 1 %

    constructor() ERC20("Doo Doo", "DooDoo") {
        _mint(msg.sender, uint256(1_000_000_000) * uint256(10) ** decimals());
    }

    function updateDexPair(address[] calldata _routers) external onlyOwner {
        for (uint i = 0; i < _routers.length; i++) {
            address dexPair;
            IPancakeRouter dexRouter = IPancakeRouter(_routers[i]);

            dexPair = IPancakeFactory(dexRouter.factory()).getPair(
                address(this),
                dexRouter.WETH()
            );
            if (dexPair == address(0)) {
                dexPair = IPancakeFactory(dexRouter.factory()).createPair(
                    address(this),
                    dexRouter.WETH()
                );
            }
            _approve(address(this), address(dexRouter), type(uint256).max);
            dexPairs[dexPair] = true;
        }
    }

    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");

        if (amount == 0) {
            super._transfer(from, to, 0);
            return;
        }

        uint256 fees;
        if (dexPairs[to]) {
            fees = (amount * sellTax) / ONE_HUNDRED_PERCENT;
        }

        if (fees > 0) {
            amount = amount - fees;
            super._transfer(from, address(this), fees);
            _burn(address(this), fees);
        }

        super._transfer(from, to, amount);
    }
}
