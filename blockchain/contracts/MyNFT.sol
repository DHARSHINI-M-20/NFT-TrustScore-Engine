// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721, Ownable {

    uint256 public tokenCounter;

    mapping(uint256 => string) private _tokenURIs;

    constructor() ERC721("TrustNFT", "TNFT") Ownable(msg.sender) {
        tokenCounter = 0;
    }

    function mintNFT(address to, string memory tokenURI) public onlyOwner {
        uint256 tokenId = tokenCounter;

        _safeMint(to, tokenId);
        _tokenURIs[tokenId] = tokenURI;

        tokenCounter++;
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        return _tokenURIs[tokenId];
    }
}