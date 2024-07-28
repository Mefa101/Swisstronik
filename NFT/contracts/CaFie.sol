// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract CaFie is ERC721URIStorage {
    uint256 private _tokenIdCounter;
    string private _baseTokenURI;
    constructor(string memory baseTokenURI) ERC721("CaFie", "Cafie") {
        _baseTokenURI = baseTokenURI;
    }

    /**
     * @dev Mint a new NFT to the specified address
     * @param to The address to receive the minted NFT
     * @return The ID of the newly minted token
     */
    function mint(address to) public returns (uint256) {
        uint256 tokenId = _tokenIdCounter;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, string(abi.encodePacked(_baseTokenURI, tokenId, ".json")));
        _tokenIdCounter += 1;
        return tokenId;
    }

    /**
     * @dev Set a new base URI for the metadata
     * @param newBaseTokenURI The new base URI to be set
     */
    function setBaseURI(string memory newBaseTokenURI) public {
        _baseTokenURI = newBaseTokenURI;
    }

    /**
     * @dev Burn a token, removing it from existence
     * @param tokenId The ID of the token to be burned
     */
    function burn(uint256 tokenId) public {
        _burn(tokenId);
    }

    /**
     * @dev Public getter for the tokenId counter
     * @return The current tokenId counter value
     */
    function tokenIdCounter() public view returns (uint256) {
        return _tokenIdCounter;
    }
}