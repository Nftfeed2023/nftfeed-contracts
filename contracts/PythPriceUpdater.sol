// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {IPyth} from "@pythnetwork/pyth-sdk-solidity/IPyth.sol";
import {PythStructs} from "@pythnetwork/pyth-sdk-solidity/PythStructs.sol";
import {PriceFeed} from "./PriceFeed.sol";

contract PythPriceUpdater is AccessControl {
    using SafeERC20 for IERC20;

    event NewPriceFeed(address token, bytes32 priceId, address priceFeed);
    event PriceUpdate(address token, int256 price, address priceFeed);

    bytes32 public constant UPDATER_ROLE = keccak256("UPDATER");

    IPyth public pyth;
    mapping(bytes32 => PriceFeed) public priceFeeds;
    mapping(bytes32 => address) public priceTokens;

    constructor(address pythContract) {
        pyth = IPyth(pythContract);

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(UPDATER_ROLE, msg.sender);
    }

    receive() external payable {}

    function deployPriceFeed(
        address token,
        bytes32 priceId
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        if (priceTokens[priceId] == address(0)) {
            priceTokens[priceId] = token;
            priceFeeds[priceId] = new PriceFeed();
            emit NewPriceFeed(token, priceId, address(priceFeeds[priceId]));
        }
    }

    function update(
        bytes[] calldata priceUpdateData,
        bytes32[] calldata priceIds
    ) public payable onlyRole(UPDATER_ROLE) {
        // Update the prices to be set to the latest values
        uint fee = pyth.getUpdateFee(priceUpdateData);
        pyth.updatePriceFeeds{value: fee}(priceUpdateData);

        // Update price feeds
        for (uint256 i = 0; i < priceIds.length; i++) {
            bytes32 priceId = priceIds[i];
            PythStructs.Price memory price = pyth.getPrice(priceId);
            priceFeeds[priceId].setLatestAnswer(price.price);
            emit PriceUpdate(
                priceTokens[priceId],
                price.price,
                address(priceFeeds[priceId])
            );
        }
    }

    function recoverWrongTokens(
        IERC20 token,
        uint256 amount
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        token.safeTransfer(address(msg.sender), amount);
    }
}
