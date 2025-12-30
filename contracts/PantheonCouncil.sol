// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PantheonCouncil is ERC721, Ownable {
    uint256 private _tradeCounter;
    uint256 private _agentCounter;

    struct Trade {
        uint256 id;
        uint256 timestamp;
        string symbol;
        string side;
        uint256 entryPrice;
        uint256 quantity;
        uint256 confidence;
        string verdict;
        bool executed;
    }

    struct AgentNFT {
        string name;
        string personality;
        uint256 totalTrades;
        uint256 performanceScore;
    }

    mapping(uint256 => Trade) public trades;
    mapping(uint256 => AgentNFT) public agents;

    event TradeRecorded(uint256 indexed tradeId, string symbol, string side);

    constructor() ERC721("Pantheon Agent", "PAGENT") Ownable(msg.sender) {
        _mintAgent(msg.sender, "Analyst", "Data-driven analyst");
        _mintAgent(msg.sender, "Skeptic", "Risk-focused contrarian");
        _mintAgent(msg.sender, "Degen", "Momentum trader");
    }

    function recordTrade(
        string memory symbol,
        string memory side,
        uint256 entryPrice,
        uint256 quantity,
        uint256 confidence,
        string memory verdict
    ) external onlyOwner returns (uint256) {
        uint256 tradeId = _tradeCounter++;
        
        trades[tradeId] = Trade({
            id: tradeId,
            timestamp: block.timestamp,
            symbol: symbol,
            side: side,
            entryPrice: entryPrice,
            quantity: quantity,
            confidence: confidence,
            verdict: verdict,
            executed: true
        });

        emit TradeRecorded(tradeId, symbol, side);
        return tradeId;
    }

    function _mintAgent(address to, string memory name, string memory personality) private returns (uint256) {
        uint256 tokenId = _agentCounter++;
        _safeMint(to, tokenId);
        agents[tokenId] = AgentNFT(name, personality, 0, 50);
        return tokenId;
    }

    function getTrade(uint256 tradeId) external view returns (Trade memory) {
        return trades[tradeId];
    }

    function getAgent(uint256 tokenId) external view returns (AgentNFT memory) {
        return agents[tokenId];
    }

    function getTotalTrades() external view returns (uint256) {
        return _tradeCounter;
    }
}