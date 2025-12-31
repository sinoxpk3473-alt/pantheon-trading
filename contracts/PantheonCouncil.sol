// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PantheonCouncil
 * @dev Records AI agent debates on-chain for transparency and auditability
 */
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
        address indexed recorder
    );

    /**
     * @dev Record a new AI council debate
     * @param symbol Trading pair symbol (e.g., "ETH")
     * @param analystView Technical analyst's opinion
     * @param skepticView Risk manager's opinion
     * @param degenView Momentum trader's opinion
     * @param consensus Final consensus decision
     * @param finalConfidence Average confidence level (1-100)
     */
    function recordDebate(
        string memory symbol,
        string memory analystView,
        string memory skepticView,
        string memory degenView,
        string memory consensus,
        uint256 finalConfidence
    ) external {
        require(bytes(symbol).length > 0, "Symbol required");
        require(bytes(analystView).length > 0, "Analyst view required");
        require(bytes(skepticView).length > 0, "Skeptic view required");
        require(bytes(degenView).length > 0, "Degen view required");
        require(bytes(consensus).length > 0, "Consensus required");
        require(finalConfidence > 0 && finalConfidence <= 100, "Invalid confidence");

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

    /**
     * @dev Get total number of debates recorded
     */
    function getTotalDebates() external view returns (uint256) {
        return debates.length;
    }

    /**
     * @dev Get a specific debate by ID
     */
    function getDebate(uint256 debateId) external view returns (Debate memory) {
        require(debateId < debates.length, "Invalid debate ID");
        return debates[debateId];
    }

    /**
     * @dev Get the most recent debate
     */
    function getLatestDebate() external view returns (Debate memory) {
        require(debates.length > 0, "No debates yet");
        return debates[debates.length - 1];
    }

    /**
     * @dev Get all debates (use with caution for large arrays)
     */
    function getAllDebates() external view returns (Debate[] memory) {
        return debates;
    }

    /**
     * @dev Get the N most recent debates
     */
    function getRecentDebates(uint256 count) external view returns (Debate[] memory) {
        require(count > 0, "Count must be > 0");
        
        uint256 total = debates.length;
        if (count > total) count = total;

        Debate[] memory recent = new Debate[](count);
        for (uint256 i = 0; i < count; i++) {
            recent[i] = debates[total - count + i];
        }

        return recent;
    }
}