import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Oculus from './components/Oculus';
import AnimatedDebate from './components/AnimatedDebate';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const RPC_URL = import.meta.env.VITE_RPC_URL;

const CONTRACT_ABI = [
  "function getTotalDebates() external view returns (uint256)",
  "function getLatestDebate() external view returns (tuple(uint256 id, uint256 timestamp, string symbol, string analystView, string skepticView, string degenView, string consensus, uint256 finalConfidence, address recorder))"
];

function App() {
  const [currentTime, setCurrentTime] = useState(null);
  const [latestDebate, setLatestDebate] = useState(null);
  const [councilMembers, setCouncilMembers] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [totalDebates, setTotalDebates] = useState(0);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [showAnimation, setShowAnimation] = useState(true);

  // Update time every second
  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch blockchain data
  useEffect(() => {
    fetchLatestDebate();
    const interval = setInterval(fetchLatestDebate, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchLatestDebate = async () => {
    try {
      setIsThinking(true);
      
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      const total = await contract.getTotalDebates();
      setTotalDebates(Number(total));

      if (Number(total) > 0) {
        const debate = await contract.getLatestDebate();
        parseDebate(debate);
        setLastUpdate(new Date());
      }
      
      setLoading(false);
      setIsThinking(false);
    } catch (error) {
      console.error('Error fetching debate:', error);
      setLoading(false);
      setIsThinking(false);
    }
  };

  const parseDebate = (debate) => {
    const parseView = (viewStr) => {
      const [decision, confidence, reasoning] = viewStr.split('|');
      return {
        decision,
        confidence: parseInt(confidence),
        reasoning,
        riskLevel: decision === 'BUY' ? 7 : decision === 'SELL' ? 3 : 5
      };
    };

    const analyst = parseView(debate.analystView);
    const skeptic = parseView(debate.skepticView);
    const degen = parseView(debate.degenView);

    setCouncilMembers([
      {
        agent: 'analyst',
        name: 'ANALYST',
        latinTitle: 'Magister Rationis',
        symbol: '◈',
        description: 'Guardian of Logic and Empirical Truth',
        ...analyst
      },
      {
        agent: 'skeptic',
        name: 'SKEPTIC',
        latinTitle: 'Custos Prudentiae',
        symbol: '◆',
        description: 'Protector Against Folly and Excess',
        ...skeptic
      },
      {
        agent: 'degen',
        name: 'DEGEN',
        latinTitle: 'Dux Fortunae',
        symbol: '◇',
        description: 'Champion of Bold Ventures',
        ...degen
      }
    ]);

    setLatestDebate(debate);
    setShowAnimation(true); // Reset animation for new debate
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050505',
      color: '#F0F0F0',
      fontFamily: "'Space Mono', monospace",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Marble texture overlay */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.01) 2px, rgba(255,255,255,0.01) 4px)`,
        pointerEvents: 'none',
        zIndex: 1
      }} />

      {/* Main Content */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '3rem 2rem'
      }}>
        
        {/* Header */}
        <header style={{
          borderBottom: '1px solid rgba(212, 175, 55, 0.15)',
          paddingBottom: '2.618rem',
          marginBottom: '3rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div>
            <h1 style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '3.5rem',
              fontWeight: 900,
              letterSpacing: '0.3em',
              color: '#D4AF37',
              margin: 0,
              marginBottom: '0.5rem',
              lineHeight: 1
            }}>
              PANTHEON
            </h1>
            <p style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              fontSize: '1.1rem',
              color: '#C0C0C0',
              letterSpacing: '0.15em',
              margin: 0
            }}>
              The Obsidian Ledger
            </p>
          </div>

          {/* Time & Network */}
          <div style={{
            textAlign: 'right',
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.75rem',
            color: '#808080',
            letterSpacing: '0.1em'
          }}>
            <div style={{ marginBottom: '0.5rem', minWidth: '80px' }}>
              {currentTime ? (
                currentTime.toLocaleTimeString('en-US', { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: false 
                })
              ) : (
                <span style={{ color: '#606060', fontStyle: 'italic' }}>--:--:--</span>
              )}
            </div>
            <div style={{ color: '#D4AF37', fontSize: '0.7rem' }}>
              POLYGON • AMOY
            </div>
            {lastUpdate && (
              <div style={{
                fontSize: '0.6rem',
                color: '#606060',
                marginTop: '0.5rem'
              }}>
                Updated {Math.floor((Date.now() - lastUpdate) / 1000)}s ago
              </div>
            )}
          </div>
        </header>

        {/* Loading State */}
        {loading && (
          <div style={{
            textAlign: 'center',
            padding: '4rem',
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            color: '#808080',
            fontSize: '1.2rem'
          }}>
            <div style={{
              marginBottom: '1rem',
              fontSize: '2rem',
              color: '#D4AF37',
              animation: 'pulse 2s ease-in-out infinite'
            }}>
              ◇
            </div>
            Consulting the Oracle...
          </div>
        )}

        {/* Oculus */}
        {!loading && latestDebate && (
          <div style={{ marginBottom: '3rem' }}>
            <Oculus isThinking={isThinking} status="vigilant" />
          </div>
        )}

        {/* Council Section with Animation */}
        {!loading && councilMembers.length > 0 && (
          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '1.5rem',
              fontWeight: 600,
              letterSpacing: '0.25em',
              color: '#D4AF37',
              textAlign: 'center',
              marginBottom: '2rem',
              textTransform: 'uppercase'
            }}>
              Consilium
            </h2>

            {/* Show Animation or Static Cards */}
            {showAnimation ? (
              <AnimatedDebate 
                councilMembers={councilMembers}
                onComplete={() => setShowAnimation(false)}
              />
            ) : (
              // Static Council Member Cards
              <div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '1.5rem'
                }}>
                  {councilMembers.map((member, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: '#0A0A0A',
                        border: '1px solid rgba(212, 175, 55, 0.15)',
                        padding: '2rem',
                        position: 'relative',
                        transition: 'all 0.4s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.5)';
                        e.currentTarget.style.boxShadow = '0 0 30px rgba(212, 175, 55, 0.15), inset 0 0 30px rgba(212, 175, 55, 0.05)';
                        e.currentTarget.style.transform = 'translateY(-4px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.15)';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      {/* Corner decorations */}
                      <div style={{
                        position: 'absolute', top: '0.75rem', left: '0.75rem',
                        width: '16px', height: '16px',
                        borderTop: '1px solid rgba(212, 175, 55, 0.3)',
                        borderLeft: '1px solid rgba(212, 175, 55, 0.3)'
                      }} />
                      <div style={{
                        position: 'absolute', top: '0.75rem', right: '0.75rem',
                        width: '16px', height: '16px',
                        borderTop: '1px solid rgba(212, 175, 55, 0.3)',
                        borderRight: '1px solid rgba(212, 175, 55, 0.3)'
                      }} />
                      <div style={{
                        position: 'absolute', bottom: '0.75rem', left: '0.75rem',
                        width: '16px', height: '16px',
                        borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
                        borderLeft: '1px solid rgba(212, 175, 55, 0.3)'
                      }} />
                      <div style={{
                        position: 'absolute', bottom: '0.75rem', right: '0.75rem',
                        width: '16px', height: '16px',
                        borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
                        borderRight: '1px solid rgba(212, 175, 55, 0.3)'
                      }} />

                      {/* Symbol */}
                      <div style={{
                        textAlign: 'center',
                        fontSize: '2.5rem',
                        color: '#D4AF37',
                        marginBottom: '1rem',
                        fontWeight: 300
                      }}>
                        {member.symbol}
                      </div>

                      {/* Name */}
                      <div style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: '1rem',
                        fontWeight: 600,
                        letterSpacing: '0.2em',
                        color: '#D4AF37',
                        textAlign: 'center',
                        marginBottom: '0.5rem'
                      }}>
                        {member.name}
                      </div>

                      {/* Latin title */}
                      <div style={{
                        fontFamily: "'Playfair Display', serif",
                        fontStyle: 'italic',
                        fontSize: '0.8rem',
                        color: '#A0A0A0',
                        textAlign: 'center',
                        marginBottom: '1.5rem',
                        paddingBottom: '1rem',
                        borderBottom: '1px solid rgba(212, 175, 55, 0.1)'
                      }}>
                        {member.latinTitle}
                      </div>

                      {/* Decision badge */}
                      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                        <div style={{
                          display: 'inline-block',
                          padding: '0.5rem 1.5rem',
                          border: `1px solid ${
                            member.decision === 'BUY' ? '#4B6E6A' :
                            member.decision === 'SELL' ? '#C0C0C0' : '#8C7853'
                          }`,
                          background: `${
                            member.decision === 'BUY' ? 'rgba(75, 110, 106, 0.1)' :
                            member.decision === 'SELL' ? 'rgba(192, 192, 192, 0.1)' :
                            'rgba(140, 120, 83, 0.1)'
                          }`,
                          fontFamily: "'Cinzel', serif",
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          letterSpacing: '0.2em',
                          color: member.decision === 'BUY' ? '#6B9A96' :
                                 member.decision === 'SELL' ? '#D0D0D0' : '#A89968'
                        }}>
                          {member.decision}
                        </div>
                      </div>

                      {/* Reasoning */}
                      <div style={{
                        fontFamily: "'Playfair Display', serif",
                        fontStyle: 'italic',
                        fontSize: '0.8rem',
                        lineHeight: '1.6',
                        color: '#C0C0C0',
                        textAlign: 'center',
                        minHeight: '80px',
                        marginBottom: '1rem',
                        padding: '0 0.5rem'
                      }}>
                        "{member.reasoning}"
                      </div>

                      {/* Metrics */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '0.75rem',
                        marginTop: '1rem'
                      }}>
                        <div style={{
                          background: 'rgba(16, 16, 16, 0.6)',
                          border: '1px solid rgba(212, 175, 55, 0.1)',
                          padding: '0.75rem',
                          textAlign: 'center'
                        }}>
                          <div style={{
                            fontSize: '0.65rem',
                            color: '#808080',
                            letterSpacing: '0.1em',
                            marginBottom: '0.25rem'
                          }}>
                            FIDUCIA
                          </div>
                          <div style={{
                            fontFamily: "'Space Mono', monospace",
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            color: '#D4AF37'
                          }}>
                            {member.confidence}%
                          </div>
                        </div>

                        <div style={{
                          background: 'rgba(16, 16, 16, 0.6)',
                          border: '1px solid rgba(212, 175, 55, 0.1)',
                          padding: '0.75rem',
                          textAlign: 'center'
                        }}>
                          <div style={{
                            fontSize: '0.65rem',
                            color: '#808080',
                            letterSpacing: '0.1em',
                            marginBottom: '0.25rem'
                          }}>
                            PERICULUM
                          </div>
                          <div style={{
                            fontFamily: "'Space Mono', monospace",
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            color: '#A89968'
                          }}>
                            {member.riskLevel}/X
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Replay Animation Button */}
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                  <button
                    onClick={() => setShowAnimation(true)}
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: '0.7rem',
                      letterSpacing: '0.15em',
                      color: '#D4AF37',
                      background: 'transparent',
                      border: '1px solid #D4AF37',
                      padding: '0.5rem 1.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#D4AF37';
                      e.target.style.color = '#050505';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.color = '#D4AF37';
                    }}
                  >
                    REPLAY DEBATE
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Immutable Record */}
        {!loading && (
          <section style={{
            background: 'rgba(10, 10, 10, 0.8)',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            padding: '2rem',
            position: 'relative'
          }}>
            <h2 style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '1.25rem',
              fontWeight: 600,
              letterSpacing: '0.25em',
              color: '#D4AF37',
              textAlign: 'center',
              marginBottom: '1.5rem'
            }}>
              IMMUTABLE RECORD
            </h2>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '3rem',
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.75rem',
              color: '#C0C0C0'
            }}>
              <div>
                <div style={{ color: '#808080', marginBottom: '0.5rem' }}>
                  BLOCKCHAIN ID
                </div>
                <div style={{ color: '#D4AF37' }}>
                  #{totalDebates}
                </div>
              </div>
              <div style={{
                width: '1px',
                background: 'rgba(212, 175, 55, 0.2)'
              }} />
              <div>
                <div style={{ color: '#808080', marginBottom: '0.5rem' }}>
                  CONTRACT
                </div>
                <div style={{ fontSize: '0.65rem' }}>
                  {CONTRACT_ADDRESS?.slice(0, 10)}...
                </div>
              </div>
              <div style={{
                width: '1px',
                background: 'rgba(212, 175, 55, 0.2)'
              }} />
              <div>
                <div style={{ color: '#808080', marginBottom: '0.5rem' }}>
                  STATUS
                </div>
                <div style={{ color: '#6B9A96' }}>
                  VERIFIED
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
              <a
                href={`https://amoy.polygonscan.com/address/${CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '0.7rem',
                  letterSpacing: '0.15em',
                  color: '#D4AF37',
                  textDecoration: 'none',
                  border: '1px solid #D4AF37',
                  padding: '0.5rem 1.5rem',
                  display: 'inline-block',
                  transition: 'all 0.3s ease',
                  background: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#D4AF37';
                  e.target.style.color = '#050505';
                  e.target.style.boxShadow = '0 0 20px rgba(212, 175, 55, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#D4AF37';
                  e.target.style.boxShadow = 'none';
                }}
              >
                INSPICE LIBRUM
              </a>
            </div>
          </section>
        )}
      </div>

      {/* Font imports */}
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Space+Mono:wght@400;700&family=Cinzel:wght@400;600;900&display=swap"
        rel="stylesheet"
      />

      {/* CSS Animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.1); }
        }
      `}</style>
    </div>
  );
}

export default App;