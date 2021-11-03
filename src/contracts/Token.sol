pragma solidity ^0.5.16;

// erc 20 token standard 
contract Token {
    string public name = "DNA TOKEN";
    string public symbol = "DNA";
    uint256 public decimals = 18;
    uint256 public totalSupply;

    constructor() public {
        totalSupply = 1000000 * (10 ** decimals);
    }
}

