// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.19;

// A simple counter contract
contract Counter {
    // State variable to keep track of the count
    uint256 private count;

    /**
     * @dev Constructor to initialize the counter to zero
     */
    constructor() {
        count = 0;
    }

    /**
     * @dev Increment the counter by 1
     */
    function increment() public {
        count += 1;
    }

    /**
     * @dev Decrement the counter by 1
     * @dev Reverts if count is already 0
     */
    function decrement() public {
        require(count > 0, "Count cannot be negative");
        count -= 1;
    }

    /**
     * @dev Retrieve the current count
     * @return The current value of the counter
     */
    function getCount() public view returns (uint256) {
        return count;
    }
}
