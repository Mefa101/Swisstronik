
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract CaFie is ERC721URIStorage {
    uint256 private _tokenIdCounter;
    string private _baseTokenURI;
    mapping(address => bool) private _whitelist;
    address private _owner;
    modifier onlyOwner() {
        require(msg.sender == _owner, "Caller is not the owner");
        _;
    }
    constructor(string memory baseTokenURI) ERC721("CaFie", "Cafie") {
        _baseTokenURI = baseTokenURI;
        _owner = msg.sender; 
    }
    function mint(address to) public {
        require(_whitelist[msg.sender], "Not whitelisted");
        uint256 tokenId = _tokenIdCounter;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, string(abi.encodePacked(_baseTokenURI, tokenId, ".json")));
        _tokenIdCounter += 1;
    }
    function setBaseURI(string memory newBaseTokenURI) public onlyOwner {
        _baseTokenURI = newBaseTokenURI;
    }
    function burn(uint256 tokenId) public onlyOwner {
        _burn(tokenId);
    }
    function addToWhitelist(address[] calldata addresses) external onlyOwner {
        for (uint i = 0; i < addresses.length; i++) {
            _whitelist[addresses[i]] = true;
        }
    }

    function removeFromWhitelist(address[] calldata addresses) external onlyOwner {
        for (uint i = 0; i < addresses.length; i++) {
            _whitelist[addresses[i]] = false;
        }
    }
    function isWhitelisted(address account) external view returns (bool) {
        return _whitelist[account];
    }
    function tokenIdCounter() public view returns (uint256) {
        return _tokenIdCounter;
    }
}