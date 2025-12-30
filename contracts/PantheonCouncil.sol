// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PantheonCouncil is ERC721, Ownable {
    uint256 private _tradeCounter;
    uint256 private _agentCounter;
    uint256 private _debateCounter;

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
    
    struct Debate {
        uint256 id;
        uint256 timestamp;
        string symbol;
        string analystView;      // Format: "DECISION|CONFIDENCE|REASONING"
        string skepticView;      // Format: "DECISION|CONFIDENCE|REASONING"
        string degenView;        // Format: "DECISION|CONFIDENCE|REASONING"
        string consensus;        // Format: "DECISION|AGREEMENT|CONFIDENCE"
        uint256 finalConfidence;
        address recorder;
    }

    mapping(uint256 => Trade) public trades;
    mapping(uint256 => AgentNFT) public agents;
    mapping(uint256 => Debate) public debates;

    event TradeRecorded(uint256 indexed tradeId, string symbol, string side);
    event DebateRecorded(
        uint256 indexed debateId, 
        string symbol,
        string consensus,
        uint256 finalConfidence
    );

    constructor() ERC721("Pantheon Agent", "PAGENT") Ownable(msg.sender) {
        _mintAgent(msg.sender, "Analyst", "Data-driven technical analyst");
        _mintAgent(msg.sender, "Skeptic", "Risk-focused contrarian thinker");
        _mintAgent(msg.sender, "Degen", "Aggressive momentum trader");
    }

    // Record a multi-agent debate
    function recordDebate(
        string memory analystView,
        string memory skepticView,
        string memory degenView,
        string memory consensus,
        uint256 finalConfidence
    ) external onlyOwner returns (uint256) {
        uint256 debateId = _debateCounter++;
        
        debates[debateId] = Debate({
            id: debateId,
            timestamp: block.timestamp,
            symbol: "ETH", // Hardcoded for now, can be made dynamic
            analystView: analystView,
            skepticView: skepticView,
            degenView: degenView,
            consensus: consensus,
            finalConfidence: finalConfidence,
            recorder: msg.sender
        });

        emit DebateRecorded(debateId, "ETH", consensus, finalConfidence);
        return debateId;
    }

    // Original recordTrade function (keep for backward compatibility)
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

    // View functions
    function getTrade(uint256 tradeId) external view returns (Trade memory) {
        return trades[tradeId];
    }

    function getDebate(uint256 debateId) external view returns (Debate memory) {
        return debates[debateId];
    }

    function getAgent(uint256 tokenId) external view returns (AgentNFT memory) {
        return agents[tokenId];
    }

    function getTotalTrades() external view returns (uint256) {
        return _tradeCounter;
    }
    
    function getTotalDebates() external view returns (uint256) {
        return _debateCounter;
    }
    
    function getLatestDebate() external view returns (Debate memory) {
        require(_debateCounter > 0, "No debates yet");
        return debates[_debateCounter - 1];
    }
}