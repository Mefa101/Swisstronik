// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TransparentUpgradeableProxy {
    address public implementation;

    // Use the standard way to manage storage
    address private _admin;

    constructor(address _implementation, address _adminAddress) {
        implementation = _implementation;
        _admin = _adminAddress;
    }

    // Fallback function to delegate calls to the implementation
    fallback() external payable {
        _delegate(implementation);
    }

    receive() external payable {
        _delegate(implementation);
    }

    function _delegate(address _impl) internal {
        assembly {
            let returndata := delegatecall(gas(), _impl, 0, 0, 0, 0)
            let size := returndatasize()
            returndatacopy(0, 0, size)
            switch returndata
            case 0 { revert(0, size) }
            default { return(0, size) }
        }
    }

    function upgradeTo(address newImplementation) public {
        require(msg.sender == _admin, "Not authorized");
        implementation = newImplementation;
    }
    
    // Admin getter function
    function admin() public view returns (address) {
        return _admin;
    }
}
