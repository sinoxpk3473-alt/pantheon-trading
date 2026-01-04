import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Oculus from './components/Oculus';
import './styles/circuit-board.css';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x13713f5E8fbfD05E7B7DcA81E231D89D51D2ccB3';
const RPC_URL = import.meta.env.VITE_RPC_URL || 'https://rpc-amoy.polygon.technology';

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

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
        ...analyst
      },
      {
        agent: 'skeptic',
        name: 'SKEPTIC',
        latinTitle: 'Custos Prudentiae',
        symbol: '◆',
        ...skeptic
      },
      {
        agent: 'degen',
        name: 'DEGEN',
        latinTitle: 'Dux Fortunae',
        symbol: '◇',
        ...degen
      }
    ]);

    setLatestDebate(debate);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000000',
      color: '#F0F0F0',
      fontFamily: "'Space Mono', monospace",
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Circuit Board Background Layers */}
      <div className="circuit-background" />
      <div className="circuit-lines" />

      {/* Main Content */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '3rem 2rem'
      }}>
        
        {/* Ornate Header */}
        <header className="ornate-header" style={{
          borderBottom: '2px solid rgba(212, 175, 55, 0.3)',
          paddingBottom: '2.618rem',
          marginBottom: '3rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start'
        }}>
          <div>
            <h1 className="text-gold-gradient" style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '3.5rem',
              fontWeight: 900,
              letterSpacing: '0.3em',
              margin: 0,
              marginBottom: '0.5rem',
              lineHeight: 1,
              textShadow: '0 0 20px rgba(212, 175, 55, 0.5)'
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

          <div style={{
            textAlign: 'right',
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.75rem',
            color: '#808080',
            letterSpacing: '0.1em'
          }}>
            <div style={{ marginBottom: '0.5rem', minWidth: '80px' }}>
              {currentTime ? currentTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                second: '2-digit',
                hour12: false 
              }) : '--:--:--'}
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
              color: '#D4AF37'
            }}>
              ◇
            </div>
            Consulting the Oracle...
          </div>
        )}

        {/* Oculus with Circuit Glow */}
        {!loading && latestDebate && (
          <div className="circuit-glow" style={{ marginBottom: '3rem' }}>
            <Oculus isThinking={isThinking} status="vigilant" />
          </div>
        )}

        {/* Council Section */}
        {!loading && councilMembers.length > 0 && (
          <section style={{ marginBottom: '3rem' }} className="fade-in-up">
            <h2 style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '1.5rem',
              fontWeight: 600,
              letterSpacing: '0.25em',
              color: '#D4AF37',
              textAlign: 'center',
              marginBottom: '2rem',
              textTransform: 'uppercase',
              textShadow: '0 0 10px rgba(212, 175, 55, 0.3)'
            }}>
              CONSILIUM
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1.5rem'
            }}>
              {councilMembers.map((member, idx) => (
                <div
                  key={idx}
                  className="metallic-card hover-glow"
                  style={{
                    padding: '2rem',
                    position: 'relative'
                  }}
                >
                  {/* Corner Ornaments */}
                  <div className="corner-ornament corner-ornament-tl" />
                  <div className="corner-ornament corner-ornament-tr" />
                  <div className="corner-ornament corner-ornament-bl" />
                  <div className="corner-ornament corner-ornament-br" />

                  {/* Circuit Nodes */}
                  <div className="circuit-node" style={{ top: '10px', left: '10px' }} />
                  <div className="circuit-node" style={{ top: '10px', right: '10px' }} />
                  <div className="circuit-node" style={{ bottom: '10px', left: '10px' }} />
                  <div className="circuit-node" style={{ bottom: '10px', right: '10px' }} />

                  {/* Symbol */}
                  <div style={{
                    textAlign: 'center',
                    fontSize: '2.5rem',
                    color: '#D4AF37',
                    marginBottom: '1rem',
                    fontWeight: 300,
                    textShadow: '0 0 15px rgba(212, 175, 55, 0.6)'
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
                    borderBottom: '1px solid rgba(212, 175, 55, 0.2)'
                  }}>
                    {member.latinTitle}
                  </div>

                  {/* Decision Badge */}
                  <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <div className={`decision-badge decision-badge-${member.decision.toLowerCase()}`}>
                      <span style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        letterSpacing: '0.2em',
                        color: member.decision === 'BUY' ? '#6B9A96' :
                               member.decision === 'SELL' ? '#D0D0D0' : '#A89968'
                      }}>
                        {member.decision}
                      </span>
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
                    <div className="metric-box" style={{ padding: '0.75rem', textAlign: 'center' }}>
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

                    <div className="metric-box" style={{ padding: '0.75rem', textAlign: 'center' }}>
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
          </section>
        )}

        {/* Immutable Record (Baroque Panel) */}
        {!loading && (
          <section className="baroque-panel fade-in-up" style={{
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
              marginBottom: '1.5rem',
              textShadow: '0 0 10px rgba(212, 175, 55, 0.3)'
            }}>
              IMMUTABLE RECORD
            </h2>

            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '3rem',
              fontFamily: "'Space Mono', monospace",
              fontSize: '0.75rem',
              color: '#C0C0C0',
              marginBottom: '1.5rem'
            }}>
              <div>
                <div style={{ color: '#808080', marginBottom: '0.5rem' }}>
                  BLOCKCHAIN ID
                </div>
                <div style={{ color: '#D4AF37', fontSize: '1.2rem', fontWeight: 700 }}>
                  #{totalDebates}
                </div>
              </div>
              
              <div style={{ width: '2px', height: '40px', background: 'linear-gradient(180deg, transparent, rgba(212, 175, 55, 0.4), transparent)' }} />
              
              <div>
                <div style={{ color: '#808080', marginBottom: '0.5rem' }}>
                  CONTRACT
                </div>
                <div style={{ fontSize: '0.65rem' }}>
                  {CONTRACT_ADDRESS?.slice(0, 10)}...
                </div>
              </div>
              
              <div style={{ width: '2px', height: '40px', background: 'linear-gradient(180deg, transparent, rgba(212, 175, 55, 0.4), transparent)' }} />
              
              <div style={{ position: 'relative' }}>
                <div className="verified-seal">
                  <span style={{ 
                    fontFamily: "'Cinzel', serif",
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#D4AF37'
                  }}>
                    ✓
                  </span>
                </div>
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <button
                className="gold-button"
                onClick={() => window.open(`https://amoy.polygonscan.com/address/${CONTRACT_ADDRESS}`, '_blank')}
              >
                <span>INSPICE LIBRUM</span>
              </button>
            </div>
          </section>
        )}
      </div>

      {/* Font imports */}
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Space+Mono:wght@400;700&family=Cinzel:wght@400;600;900&display=swap"
        rel="stylesheet"
      />
    </div>
  );
}

export default App;