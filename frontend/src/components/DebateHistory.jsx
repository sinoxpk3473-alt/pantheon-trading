import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = '0x13713f5E8fbfD05E7B7DcA81E231D89D51D2ccB3';
const RPC_URL = 'https://rpc-amoy.polygon.technology';

const CONTRACT_ABI = [
  "function getTotalDebates() external view returns (uint256)",
  "function getDebate(uint256 id) external view returns (tuple(uint256 id, uint256 timestamp, string symbol, string analystView, string skepticView, string degenView, string consensus, uint256 finalConfidence, address recorder))"
];

const DebateHistory = () => {
  const [debates, setDebates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [totalDebates, setTotalDebates] = useState(0);

  useEffect(() => {
    fetchDebateHistory();
  }, []);

  const fetchDebateHistory = async () => {
    try {
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      const total = await contract.getTotalDebates();
      setTotalDebates(Number(total));

      // Fetch last 10 debates
      const debatePromises = [];
      const startId = Math.max(1, Number(total) - 9);
      
      for (let i = Number(total); i >= startId; i--) {
        debatePromises.push(contract.getDebate(i));
      }

      const fetchedDebates = await Promise.all(debatePromises);
      const parsedDebates = fetchedDebates.map(parseDebate);
      setDebates(parsedDebates);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching history:', error);
      setLoading(false);
    }
  };

  const parseDebate = (debate) => {
    const parseView = (viewStr) => {
      const [decision, confidence, reasoning] = viewStr.split('|');
      return { decision, confidence: parseInt(confidence), reasoning };
    };

    const [consensusDecision, consensusType, avgConfidence] = debate.consensus.split('|');

    return {
      id: Number(debate.id),
      timestamp: Number(debate.timestamp),
      symbol: debate.symbol,
      analyst: parseView(debate.analystView),
      skeptic: parseView(debate.skepticView),
      degen: parseView(debate.degenView),
      consensus: {
        decision: consensusDecision,
        type: consensusType,
        confidence: parseInt(avgConfidence)
      }
    };
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  const getConsensusColor = (decision) => {
    switch(decision) {
      case 'BUY': return '#6B9A96';
      case 'SELL': return '#D0D0D0';
      case 'HOLD': return '#A89968';
      default: return '#808080';
    }
  };

  const DebateCard = ({ debate, isExpanded, onToggle }) => {
    return (
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(15,15,15,0.98) 0%, rgba(25,25,25,0.98) 100%)',
          border: isExpanded ? '2px solid #D4AF37' : '2px solid rgba(212,175,55,0.2)',
          padding: '1.5rem',
          marginBottom: '1rem',
          position: 'relative',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          boxShadow: isExpanded ? '0 8px 32px rgba(212,175,55,0.3)' : 'none'
        }}
        onClick={onToggle}
      >
        {/* Corner nodes */}
        <div style={{position: 'absolute', top: '8px', left: '8px', width: '6px', height: '6px', background: '#D4AF37', borderRadius: '50%', boxShadow: '0 0 8px rgba(212,175,55,0.8)'}} />
        <div style={{position: 'absolute', top: '8px', right: '8px', width: '6px', height: '6px', background: '#D4AF37', borderRadius: '50%', boxShadow: '0 0 8px rgba(212,175,55,0.8)'}} />
        <div style={{position: 'absolute', bottom: '8px', left: '8px', width: '6px', height: '6px', background: '#D4AF37', borderRadius: '50%', boxShadow: '0 0 8px rgba(212,175,55,0.8)'}} />
        <div style={{position: 'absolute', bottom: '8px', right: '8px', width: '6px', height: '6px', background: '#D4AF37', borderRadius: '50%', boxShadow: '0 0 8px rgba(212,175,55,0.8)'}} />

        {/* Header Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: isExpanded ? '1.5rem' : '0'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '0.75rem',
              color: '#808080',
              letterSpacing: '0.1em'
            }}>
              DEBATE #{debate.id}
            </div>
            <div style={{
              fontSize: '0.7rem',
              color: '#606060',
              fontFamily: "'Space Mono', monospace"
            }}>
              {formatTimestamp(debate.timestamp)}
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{
              padding: '0.4rem 1rem',
              background: `${getConsensusColor(debate.consensus.decision)}20`,
              border: `1px solid ${getConsensusColor(debate.consensus.decision)}`,
              fontFamily: "'Cinzel', serif",
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.15em',
              color: getConsensusColor(debate.consensus.decision)
            }}>
              {debate.consensus.decision}
            </div>

            <div style={{
              fontSize: '0.7rem',
              color: '#D4AF37',
              fontFamily: "'Space Mono', monospace"
            }}>
              {debate.consensus.type}
            </div>

            <div style={{
              fontSize: '1.2rem',
              color: isExpanded ? '#D4AF37' : '#808080',
              transition: 'all 0.3s ease',
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
            }}>
              ▼
            </div>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div style={{
            borderTop: '1px solid rgba(212,175,55,0.2)',
            paddingTop: '1.5rem',
            animation: 'fadeIn 0.3s ease'
          }}>
            {/* Agent Votes Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              {/* Analyst */}
              <div style={{
                background: 'rgba(10,10,10,0.6)',
                border: '1px solid rgba(212,175,55,0.2)',
                padding: '1rem',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '1.5rem',
                  color: '#D4AF37',
                  marginBottom: '0.5rem'
                }}>
                  ◈
                </div>
                <div style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '0.7rem',
                  letterSpacing: '0.1em',
                  color: '#D4AF37',
                  marginBottom: '0.5rem'
                }}>
                  ANALYST
                </div>
                <div style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: getConsensusColor(debate.analyst.decision),
                  marginBottom: '0.5rem',
                  fontFamily: "'Space Mono', monospace"
                }}>
                  {debate.analyst.decision}
                </div>
                <div style={{
                  fontSize: '0.65rem',
                  color: '#C0C0C0',
                  fontStyle: 'italic',
                  fontFamily: "'Playfair Display', serif",
                  marginBottom: '0.5rem',
                  minHeight: '40px'
                }}>
                  "{debate.analyst.reasoning}"
                </div>
                <div style={{
                  fontSize: '0.7rem',
                  color: '#808080',
                  fontFamily: "'Space Mono', monospace"
                }}>
                  Confidence: <span style={{color: '#D4AF37'}}>{debate.analyst.confidence}%</span>
                </div>
              </div>

              {/* Skeptic */}
              <div style={{
                background: 'rgba(10,10,10,0.6)',
                border: '1px solid rgba(212,175,55,0.2)',
                padding: '1rem',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '1.5rem',
                  color: '#D4AF37',
                  marginBottom: '0.5rem'
                }}>
                  ◆
                </div>
                <div style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '0.7rem',
                  letterSpacing: '0.1em',
                  color: '#D4AF37',
                  marginBottom: '0.5rem'
                }}>
                  SKEPTIC
                </div>
                <div style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: getConsensusColor(debate.skeptic.decision),
                  marginBottom: '0.5rem',
                  fontFamily: "'Space Mono', monospace"
                }}>
                  {debate.skeptic.decision}
                </div>
                <div style={{
                  fontSize: '0.65rem',
                  color: '#C0C0C0',
                  fontStyle: 'italic',
                  fontFamily: "'Playfair Display', serif",
                  marginBottom: '0.5rem',
                  minHeight: '40px'
                }}>
                  "{debate.skeptic.reasoning}"
                </div>
                <div style={{
                  fontSize: '0.7rem',
                  color: '#808080',
                  fontFamily: "'Space Mono', monospace"
                }}>
                  Confidence: <span style={{color: '#D4AF37'}}>{debate.skeptic.confidence}%</span>
                </div>
              </div>

              {/* Degen */}
              <div style={{
                background: 'rgba(10,10,10,0.6)',
                border: '1px solid rgba(212,175,55,0.2)',
                padding: '1rem',
                textAlign: 'center'
              }}>
                <div style={{
                  fontSize: '1.5rem',
                  color: '#D4AF37',
                  marginBottom: '0.5rem'
                }}>
                  ◇
                </div>
                <div style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '0.7rem',
                  letterSpacing: '0.1em',
                  color: '#D4AF37',
                  marginBottom: '0.5rem'
                }}>
                  DEGEN
                </div>
                <div style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: getConsensusColor(debate.degen.decision),
                  marginBottom: '0.5rem',
                  fontFamily: "'Space Mono', monospace"
                }}>
                  {debate.degen.decision}
                </div>
                <div style={{
                  fontSize: '0.65rem',
                  color: '#C0C0C0',
                  fontStyle: 'italic',
                  fontFamily: "'Playfair Display', serif",
                  marginBottom: '0.5rem',
                  minHeight: '40px'
                }}>
                  "{debate.degen.reasoning}"
                </div>
                <div style={{
                  fontSize: '0.7rem',
                  color: '#808080',
                  fontFamily: "'Space Mono', monospace"
                }}>
                  Confidence: <span style={{color: '#D4AF37'}}>{debate.degen.confidence}%</span>
                </div>
              </div>
            </div>

            {/* Consensus Summary */}
            <div style={{
              background: 'rgba(10,10,10,0.8)',
              border: '1px solid rgba(212,175,55,0.3)',
              padding: '1rem',
              textAlign: 'center'
            }}>
              <div style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '0.7rem',
                letterSpacing: '0.15em',
                color: '#808080',
                marginBottom: '0.5rem'
              }}>
                FINAL CONSENSUS
              </div>
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 900,
                color: getConsensusColor(debate.consensus.decision),
                letterSpacing: '0.2em',
                fontFamily: "'Cinzel', serif"
              }}>
                {debate.consensus.decision}
              </div>
              <div style={{
                fontSize: '0.8rem',
                color: '#D4AF37',
                marginTop: '0.5rem',
                fontFamily: "'Space Mono', monospace"
              }}>
                {debate.consensus.type} • {debate.consensus.confidence}% Confidence
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <section style={{marginBottom: '3rem'}}>
        <h2 style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '1.5rem',
          fontWeight: 600,
          letterSpacing: '0.3em',
          color: '#D4AF37',
          textAlign: 'center',
          marginBottom: '2rem',
          textTransform: 'uppercase',
          textShadow: '0 0 20px rgba(212,175,55,0.4)'
        }}>
          DEBATE HISTORY
        </h2>
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: '#808080',
          fontStyle: 'italic',
          fontFamily: "'Playfair Display', serif"
        }}>
          Loading historical debates...
        </div>
      </section>
    );
  }

  return (
    <section style={{marginBottom: '3rem'}}>
      <h2 style={{
        fontFamily: "'Cinzel', serif",
        fontSize: '1.5rem',
        fontWeight: 600,
        letterSpacing: '0.3em',
        color: '#D4AF37',
        textAlign: 'center',
        marginBottom: '1rem',
        textTransform: 'uppercase',
        textShadow: '0 0 20px rgba(212,175,55,0.4)'
      }}>
        DEBATE HISTORY
      </h2>

      <div style={{
        textAlign: 'center',
        marginBottom: '2rem',
        fontFamily: "'Playfair Display', serif",
        fontStyle: 'italic',
        fontSize: '0.9rem',
        color: '#A0A0A0'
      }}>
        Last {debates.length} of {totalDebates} debates • Click to expand
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {debates.map((debate) => (
          <DebateCard
            key={debate.id}
            debate={debate}
            isExpanded={expandedId === debate.id}
            onToggle={() => setExpandedId(expandedId === debate.id ? null : debate.id)}
          />
        ))}
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
};

export default DebateHistory;