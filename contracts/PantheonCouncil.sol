// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PantheonCouncil {
    struct Debate {
        uint256 id;
        uint256 timestamp;
        string symbol;
        string analystView;
        string skepticView;
        string degenView;
        string consensus;
        uint256 finalConfidence;
        address recorder;
    }

    Debate[] public debates;
    
    event DebateRecorded(
        uint256 indexed id,
        uint256 timestamp,
        string symbol,
        string consensus,
        uint256 finalConfidence,
        address recorder
    );

    // Record a new debate - NO OWNER CHECK, ANYONE CAN RECORD
    function recordDebate(
        string memory symbol,
        string memory analystView,
        string memory skepticView,
        string memory degenView,
        string memory consensus,
        uint256 finalConfidence
    ) external {
        // Validate inputs
        require(bytes(symbol).length > 0, "Symbol cannot be empty");
        require(bytes(analystView).length > 0, "Analyst view cannot be empty");
        require(bytes(skepticView).length > 0, "Skeptic view cannot be empty");
        require(bytes(degenView).length > 0, "Degen view cannot be empty");
        require(bytes(consensus).length > 0, "Consensus cannot be empty");
        require(finalConfidence > 0 && finalConfidence <= 100, "Confidence must be 1-100");

        Debate memory newDebate = Debate({
            id: debates.length,
            timestamp: block.timestamp,
            symbol: symbol,
            analystView: analystView,
            skepticView: skepticView,
            degenView: degenView,
            consensus: consensus,
            finalConfidence: finalConfidence,
            recorder: msg.sender
        });

        debates.push(newDebate);

        emit DebateRecorded(
            newDebate.id,
            newDebate.timestamp,
            symbol,
            consensus,
            finalConfidence,
            msg.sender
        );
    }

    // Get total number of debates
    function getTotalDebates() external view returns (uint256) {
        return debates.length;
    }

    // Get a specific debate by ID
    function getDebate(uint256 debateId) external view returns (Debate memory) {
        require(debateId < debates.length, "Debate does not exist");
        return debates[debateId];
    }

    // Get the latest debate
    function getLatestDebate() external view returns (Debate memory) {
        require(debates.length > 0, "No debates recorded yet");
        return debates[debates.length - 1];
    }

    // Get all debates (be careful with gas limits for large arrays)
    function getAllDebates() external view returns (Debate[] memory) {
        return debates;
    }

    // Get recent debates (last N debates)
    function getRecentDebates(uint256 count) external view returns (Debate[] memory) {
        require(count > 0, "Count must be greater than 0");
        
        uint256 total = debates.length;
        if (count > total) {
            count = total;
        }

        Debate[] memory recentDebates = new Debate[](count);
        
        for (uint256 i = 0; i < count; i++) {
            recentDebates[i] = debates[total - count + i];
        }

        return recentDebates;
    }
}