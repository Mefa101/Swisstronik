// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./PERC20.sol";

/**
 * @dev Sample implementation of the {PERC20} contract.
 */
contract PERC20Sample is PERC20 {
    constructor() PERC20("Sample PERC20", "pSWTR") {}

    /// @dev Wraps SWTR to PSWTR.
    receive() external payable {
        _mint(_msgSender(), msg.value);
    }

    /**
     * @dev Mint new tokens to the specified address.
     * @param to The address that will receive the minted tokens.
     * @param amount The amount of tokens to mint.
     */
    function mint(address to, uint256 amount) public {
        // Ensure that the amount is greater than 0
        require(amount > 0, "PERC20Sample: amount must be greater than 0");
        
        // Call the internal _mint function
        _mint(to, amount);
    }

    /**
     * @dev Regular `balanceOf` function marked as internal, so we override it to extend visibility  
     */ 
    function balanceOf(address account) public view override returns (uint256) {
        // This function should be called by EOA using signed `eth_call` to make EVM able to
        // extract original sender of this request. In case of regular (non-signed) `eth_call`
        // msg.sender will be empty address (0x0000000000000000000000000000000000000000).
        require(msg.sender == account, "PERC20Sample: msg.sender != account");

        // If msg.sender is correct we return the balance
        return _balances[account];
    }

    /**
     * @dev Regular `allowance` function marked as internal, so we override it to extend visibility  
     */
    function allowance(address owner, address spender) public view virtual override returns (uint256) {
        // This function should be called by EOA using signed `eth_call` to make EVM able to
        // extract original sender of this request. In case of regular (non-signed) `eth_call`
        // msg.sender will be empty address (0x0000000000000000000000000000000000000000)
        require(msg.sender == spender, "PERC20Sample: msg.sender != account");
        
        // If msg.sender is correct we return the allowance
        return _allowances[owner][spender];
    }

    /**
     * @dev Override internal `_mint` function to handle minting tokens.
     * @param account The account to mint tokens to.
     * @param amount The amount of tokens to mint.
     */
    function _mint(address account, uint256 amount) internal override {
        super._mint(account, amount);
        // Any additional logic related to minting can go here
    }
}