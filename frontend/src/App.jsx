import React, { useState, useEffect } from 'react';

const OldMoneyDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeDebate, setActiveDebate] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock data
  const councilMembers = [
    {
      name: 'ANALYST',
      latinTitle: 'Magister Rationis',
      symbol: '◈',
      decision: 'HOLD',
      confidence: 50,
      reasoning: 'Market showing consolidation pattern',
      risk: 3
    },
    {
      name: 'SKEPTIC', 
      latinTitle: 'Custos Prudentiae',
      symbol: '◆',
      decision: 'HOLD',
      confidence: 85,
      reasoning: 'RSI 86 suggests potential overextension. Downside risk elevated; prudent to protect capital from correction.',
      risk: 2
    },
    {
      name: 'DEGEN',
      latinTitle: 'Dux Fortunae', 
      symbol: '◇',
      decision: 'HOLD',
      confidence: 50,
      reasoning: 'Market showing consolidation pattern',
      risk: 9
    }
  ];

  const recentSignal = {
    asset: 'ETH',
    decision: 'HOLD',
    timestamp: '16 • POLYGON AMOY'
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
      {/* Subtle marble texture overlay */}
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
        
        {/* Elegant Header */}
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
            <div style={{ marginBottom: '0.5rem' }}>
              {currentTime.toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: false 
              })}
            </div>
            <div style={{
              color: '#D4AF37',
              fontSize: '0.7rem'
            }}>
              POLYGON • AMOY
            </div>
          </div>
        </header>

        {/* Asset & Decision Summary */}
        <section style={{
          background: 'rgba(10, 10, 10, 0.6)',
          border: '1px solid rgba(212, 175, 55, 0.2)',
          padding: '2rem',
          marginBottom: '3rem',
          position: 'relative'
        }}>
          {/* Corner ornaments */}
          <div style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            width: '24px',
            height: '24px',
            borderTop: '2px solid rgba(212, 175, 55, 0.4)',
            borderLeft: '2px solid rgba(212, 175, 55, 0.4)'
          }} />
          <div style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            width: '24px',
            height: '24px',
            borderTop: '2px solid rgba(212, 175, 55, 0.4)',
            borderRight: '2px solid rgba(212, 175, 55, 0.4)'
          }} />

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr auto 1fr',
            gap: '2rem',
            alignItems: 'center'
          }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '0.75rem',
                letterSpacing: '0.2em',
                color: '#808080',
                marginBottom: '0.5rem'
              }}>
                INSTRUMENTUM
              </div>
              <div style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '2rem',
                fontWeight: 600,
                letterSpacing: '0.15em',
                color: '#D4AF37'
              }}>
                {recentSignal.asset}
              </div>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: 'italic',
                fontSize: '0.875rem',
                color: '#A0A0A0',
                marginTop: '0.25rem'
              }}>
                Detected
              </div>
            </div>

            {/* Center ornament */}
            <div style={{
              fontSize: '2rem',
              color: '#D4AF37',
              opacity: 0.3
            }}>
              ◇
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '0.75rem',
                letterSpacing: '0.2em',
                color: '#808080',
                marginBottom: '0.5rem'
              }}>
                SENTENTIA
              </div>
              <div style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '2rem',
                fontWeight: 600,
                letterSpacing: '0.15em',
                color: '#8C7853'
              }}>
                {recentSignal.decision}
              </div>
              <div style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: 'italic',
                fontSize: '0.875rem',
                color: '#A0A0A0',
                marginTop: '0.25rem'
              }}>
                Consensus Reached
              </div>
            </div>
          </div>
        </section>

        {/* Council Section */}
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

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1.5rem'
          }}>
            {councilMembers.map((member, idx) => (
              <div key={idx} style={{
                background: '#0A0A0A',
                border: `1px solid rgba(212, 175, 55, 0.15)`,
                padding: '2rem',
                position: 'relative',
                transition: 'border-color 0.4s ease'
              }}>
                {/* Corner decorations */}
                <div style={{
                  position: 'absolute',
                  top: '0.75rem',
                  left: '0.75rem',
                  width: '16px',
                  height: '16px',
                  borderTop: '1px solid rgba(212, 175, 55, 0.3)',
                  borderLeft: '1px solid rgba(212, 175, 55, 0.3)'
                }} />
                <div style={{
                  position: 'absolute',
                  top: '0.75rem',
                  right: '0.75rem',
                  width: '16px',
                  height: '16px',
                  borderTop: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRight: '1px solid rgba(212, 175, 55, 0.3)'
                }} />
                <div style={{
                  position: 'absolute',
                  bottom: '0.75rem',
                  left: '0.75rem',
                  width: '16px',
                  height: '16px',
                  borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
                  borderLeft: '1px solid rgba(212, 175, 55, 0.3)'
                }} />
                <div style={{
                  position: 'absolute',
                  bottom: '0.75rem',
                  right: '0.75rem',
                  width: '16px',
                  height: '16px',
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
                <div style={{
                  textAlign: 'center',
                  marginBottom: '1rem'
                }}>
                  <div style={{
                    display: 'inline-block',
                    padding: '0.5rem 1.5rem',
                    border: '1px solid #8C7853',
                    background: 'rgba(140, 120, 83, 0.1)',
                    fontFamily: "'Cinzel', serif",
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: '0.2em',
                    color: '#A89968'
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
                      {member.risk}/X
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Immutable Record */}
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
                #16
              </div>
            </div>
            <div style={{
              width: '1px',
              background: 'rgba(212, 175, 55, 0.2)'
            }} />
            <div>
              <div style={{ color: '#808080', marginBottom: '0.5rem' }}>
                NETWORK
              </div>
              <div>
                POLYGON AMOY
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

          <div style={{
            marginTop: '1.5rem',
            textAlign: 'center'
          }}>
            <a
              href="https://amoy.polygonscan.com"
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
              INSPICE LIBRUM
            </a>
          </div>
        </section>

        {/* Footer ornament */}
        <div style={{
          marginTop: '3rem',
          textAlign: 'center'
        }}>
          <div style={{
            width: '120px',
            height: '1px',
            background: 'linear-gradient(to right, transparent, #D4AF37, transparent)',
            margin: '0 auto',
            opacity: 0.5
          }} />
        </div>
      </div>

      {/* Font imports */}
      <link
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Space+Mono:wght@400;700&family=Cinzel:wght@400;600;900&display=swap"
        rel="stylesheet"
      />
    </div>
  );
};

export default OldMoneyDashboard;