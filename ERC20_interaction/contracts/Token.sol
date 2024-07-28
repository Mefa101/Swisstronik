// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CoFi is ERC20 {
    constructor() ERC20("TestB", "TestB") {}

    function mint100tokens() public {
        _mint(msg.sender, 100 * 10**18);
    }

    function burn100tokens() public {
        _burn(msg.sender, 100 * 10**18);
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
        // Custom logic or checks can be added here
        require(amount > 0, "Amount must be greater than zero");

        // Call the base transfer function
        return super.transfer(recipient, amount);
    }

    /**
     * @dev Safe transfer function that ensures tokens are transferred safely.
     * Emits a Transfer event and reverts if the transfer fails.
     */
    function safeTransfer(address recipient, uint256 amount) public returns (bool) {
        uint256 initialBalance = balanceOf(recipient);
        bool success = transfer(recipient, amount);
        require(success, "Transfer failed");

        // Verify the recipient's balance has increased by the amount transferred
        require(balanceOf(recipient) == initialBalance + amount, "SafeTransfer: balance check failed");

        return true;
    }
}
