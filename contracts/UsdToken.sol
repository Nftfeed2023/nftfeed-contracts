// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract UsdToken is ERC20 {
    address public minter;
    // Modifier checking Minter role
    modifier onlyMinter() {
        require(
            msg.sender != address(0) && minter == msg.sender,
            "UsdToken: account not role minter"
        );
        _;
    }

    constructor() ERC20("USD Testnet", "TUSD") {
        _mint(msg.sender, uint256(1000_000_000) * uint256(10) ** decimals());
        minter = msg.sender;
    }

    function decimals() public view virtual override returns (uint8) {
        return 6;
    }

    /// @notice Creates `_amount` token to `_to`.
    function mint(address _to, uint256 _amount) external onlyMinter {
        super._mint(_to, _amount);
    }
}
