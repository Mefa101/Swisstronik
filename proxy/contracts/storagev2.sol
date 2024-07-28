// contracts/SimpleStorageV2.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorageV2 {
    uint256 public value;

    function set(uint256 _value) public {
        value = _value;
    }

    function increment() public {
        value++;
    }
}
