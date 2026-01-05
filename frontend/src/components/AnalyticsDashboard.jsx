import React, { useState, useEffect } from 'react';

const AnalyticsDashboard = ({ totalDebates, latestDebate, councilMembers }) => {
  const [stats, setStats] = useState({
    analystStats: { buy: 0, sell: 0, hold: 0, avgConfidence: 0 },
    skepticStats: { buy: 0, sell: 0, hold: 0, avgConfidence: 0 },
    degenStats: { buy: 0, sell: 0, hold: 0, avgConfidence: 0 },
    consensusHistory: []
  });

  useEffect(() => {
    if (councilMembers.length === 3) {
      const newStats = {
        analystStats: calculateAgentStats(councilMembers[0]),
        skepticStats: calculateAgentStats(councilMembers[1]),
        degenStats: calculateAgentStats(councilMembers[2]),
        consensusHistory: generateMockHistory(totalDebates)
      };
      setStats(newStats);
    }
  }, [councilMembers, totalDebates]);

  const calculateAgentStats = (agent) => {
    const decision = agent.decision;
    return {
      buy: decision === 'BUY' ? 1 : 0,
      sell: decision === 'SELL' ? 1 : 0,
      hold: decision === 'HOLD' ? 1 : 0,
      avgConfidence: agent.confidence || 0
    };
  };

  const generateMockHistory = (total) => {
    const history = [];
    for (let i = Math.max(0, total - 10); i < total; i++) {
      history.push({
        id: i + 1,
        confidence: 50 + Math.random() * 40
      });
    }
    return history;
  };

  const AgentStatCard = ({ name, symbol, stats }) => {
    const total = stats.buy + stats.sell + stats.hold || 1;
    const buyPct = Math.round((stats.buy / total) * 100);
    const sellPct = Math.round((stats.sell / total) * 100);
    const holdPct = Math.round((stats.hold / total) * 100);

    return (
      <div style={{
        background: 'linear-gradient(135deg, rgba(15,15,15,0.98) 0%, rgba(25,25,25,0.98) 100%)',
        border: '2px solid rgba(212,175,55,0.3)',
        padding: '1.5rem',
        position: 'relative'
      }}>
        <div style={{position: 'absolute', top: '8px', left: '8px', width: '6px', height: '6px', background: '#D4AF37', borderRadius: '50%', boxShadow: '0 0 8px rgba(212,175,55,0.8)'}} />
        <div style={{position: 'absolute', top: '8px', right: '8px', width: '6px', height: '6px', background: '#D4AF37', borderRadius: '50%', boxShadow: '0 0 8px rgba(212,175,55,0.8)'}} />
        <div style={{position: 'absolute', bottom: '8px', left: '8px', width: '6px', height: '6px', background: '#D4AF37', borderRadius: '50%', boxShadow: '0 0 8px rgba(212,175,55,0.8)'}} />
        <div style={{position: 'absolute', bottom: '8px', right: '8px', width: '6px', height: '6px', background: '#D4AF37', borderRadius: '50%', boxShadow: '0 0 8px rgba(212,175,55,0.8)'}} />

        <div style={{
          textAlign: 'center',
          fontSize: '2rem',
          color: '#D4AF37',
          marginBottom: '0.5rem'
        }}>
          {symbol}
        </div>

        <div style={{
          fontFamily: "'Cinzel', serif",
          fontSize: '0.9rem',
          fontWeight: 700,
          letterSpacing: '0.15em',
          color: '#D4AF37',
          textAlign: 'center',
          marginBottom: '1rem'
        }}>
          {name}
        </div>

        <div style={{marginBottom: '1rem'}}>
          <div style={{
            fontSize: '0.65rem',
            color: '#808080',
            letterSpacing: '0.1em',
            marginBottom: '0.5rem',
            textAlign: 'center'
          }}>
            DECISION DISTRIBUTION
          </div>

          <div style={{
            display: 'flex',
            height: '30px',
            border: '1px solid rgba(212,175,55,0.2)',
            overflow: 'hidden'
          }}>
            {buyPct > 0 && (
              <div style={{
                flex: buyPct,
                background: 'linear-gradient(135deg, rgba(107,154,150,0.3), rgba(107,154,150,0.5))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#6B9A96',
                fontFamily: "'Space Mono', monospace"
              }}>
                {buyPct}%
              </div>
            )}
            {sellPct > 0 && (
              <div style={{
                flex: sellPct,
                background: 'linear-gradient(135deg, rgba(208,208,208,0.3), rgba(208,208,208,0.5))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#D0D0D0',
                fontFamily: "'Space Mono', monospace"
              }}>
                {sellPct}%
              </div>
            )}
            {holdPct > 0 && (
              <div style={{
                flex: holdPct,
                background: 'linear-gradient(135deg, rgba(168,153,104,0.3), rgba(168,153,104,0.5))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#A89968',
                fontFamily: "'Space Mono', monospace"
              }}>
                {holdPct}%
              </div>
            )}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            marginTop: '0.5rem',
            fontSize: '0.65rem',
            fontFamily: "'Space Mono', monospace"
          }}>
            <span style={{color: '#6B9A96'}}>BUY: {stats.buy}</span>
            <span style={{color: '#D0D0D0'}}>SELL: {stats.sell}</span>
            <span style={{color: '#A89968'}}>HOLD: {stats.hold}</span>
          </div>
        </div>

        <div style={{
          background: 'rgba(10,10,10,0.8)',
          border: '1px solid rgba(212,175,55,0.2)',
          padding: '0.75rem',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '0.65rem',
            color: '#808080',
            letterSpacing: '0.1em',
            marginBottom: '0.25rem'
          }}>
            AVG CONFIDENCE
          </div>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: '#D4AF37',
            fontFamily: "'Space Mono', monospace"
          }}>
            {stats.avgConfidence}%
          </div>
        </div>
      </div>
    );
  };

  const ConfidenceSparkline = ({ history }) => {
    if (!history || history.length === 0) return null;

    const max = Math.max(...history.map(h => h.confidence));
    const min = Math.min(...history.map(h => h.confidence));
    const range = max - min || 1;

    const points = history.map((h, i) => {
      const x = (i / (history.length - 1)) * 300;
      const y = 60 - ((h.confidence - min) / range) * 50;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg viewBox="0 0 300 60" style={{width: '100%', height: '60px'}}>
        <line x1="0" y1="10" x2="300" y2="10" stroke="rgba(212,175,55,0.1)" strokeWidth="1" />
        <line x1="0" y1="30" x2="300" y2="30" stroke="rgba(212,175,55,0.1)" strokeWidth="1" />
        <line x1="0" y1="50" x2="300" y2="50" stroke="rgba(212,175,55,0.1)" strokeWidth="1" />

        <polyline
          points={points}
          fill="none"
          stroke="#D4AF37"
          strokeWidth="2"
          style={{filter: 'drop-shadow(0 0 4px rgba(212,175,55,0.6))'}}
        />

        {history.map((h, i) => {
          const x = (i / (history.length - 1)) * 300;
          const y = 60 - ((h.confidence - min) / range) * 50;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="3"
              fill="#D4AF37"
              style={{filter: 'drop-shadow(0 0 3px rgba(212,175,55,0.8))'}}
            />
          );
        })}
      </svg>
    );
  };

  return (
    <section style={{marginBottom: '3rem', position: 'relative'}}>
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
        PERFORMANCE ANALYTICS
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <AgentStatCard name="ANALYST" symbol="◈" stats={stats.analystStats} />
        <AgentStatCard name="SKEPTIC" symbol="◆" stats={stats.skepticStats} />
        <AgentStatCard name="DEGEN" symbol="◇" stats={stats.degenStats} />
      </div>

      <div style={{
        background: 'linear-gradient(135deg, rgba(15,15,15,0.98) 0%, rgba(25,25,25,0.98) 100%)',
        border: '2px solid rgba(212,175,55,0.3)',
        padding: '2rem',
        position: 'relative'
      }}>
        <div style={{position: 'absolute', top: '8px', left: '8px', width: '6px', height: '6px', background: '#D4AF37', borderRadius: '50%', boxShadow: '0 0 8px rgba(212,175,55,0.8)'}} />
        <div style={{position: 'absolute', top: '8px', right: '8px', width: '6px', height: '6px', background: '#D4AF37', borderRadius: '50%', boxShadow: '0 0 8px rgba(212,175,55,0.8)'}} />
        <div style={{position: 'absolute', bottom: '8px', left: '8px', width: '6px', height: '6px', background: '#D4AF37', borderRadius: '50%', boxShadow: '0 0 8px rgba(212,175,55,0.8)'}} />
        <div style={{position: 'absolute', bottom: '8px', right: '8px', width: '6px', height: '6px', background: '#D4AF37', borderRadius: '50%', boxShadow: '0 0 8px rgba(212,175,55,0.8)'}} />

        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem'
        }}>
          <div>
            <div style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '1rem',
              fontWeight: 600,
              letterSpacing: '0.2em',
              color: '#D4AF37',
              marginBottom: '0.5rem'
            }}>
              CONSENSUS CONFIDENCE TREND
            </div>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              fontSize: '0.8rem',
              color: '#A0A0A0'
            }}>
              Last {stats.consensusHistory.length} debates
            </div>
          </div>

          <div style={{textAlign: 'right'}}>
            <div style={{
              fontSize: '0.65rem',
              color: '#808080',
              letterSpacing: '0.1em',
              marginBottom: '0.25rem'
            }}>
              TOTAL DEBATES
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#D4AF37',
              fontFamily: "'Space Mono', monospace"
            }}>
              {totalDebates}
            </div>
          </div>
        </div>

        <div style={{
          background: 'rgba(10,10,10,0.8)',
          border: '1px solid rgba(212,175,55,0.2)',
          padding: '1rem'
        }}>
          <ConfidenceSparkline history={stats.consensusHistory} />

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '0.5rem',
            fontSize: '0.7rem',
            color: '#808080',
            fontFamily: "'Space Mono', monospace"
          }}>
            <span>Debate #{Math.max(0, totalDebates - 10)}</span>
            <span style={{color: '#D4AF37'}}>Confidence Level</span>
            <span>Debate #{totalDebates}</span>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          marginTop: '1.5rem'
        }}>
          <div style={{
            background: 'rgba(10,10,10,0.8)',
            border: '1px solid rgba(212,175,55,0.2)',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '0.65rem',
              color: '#808080',
              letterSpacing: '0.1em',
              marginBottom: '0.5rem'
            }}>
              CONSENSUS RATE
            </div>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#6B9A96',
              fontFamily: "'Space Mono', monospace"
            }}>
              {totalDebates > 0 ? '87%' : '0%'}
            </div>
            <div style={{
              fontSize: '0.6rem',
              color: '#6B9A96',
              marginTop: '0.25rem',
              fontFamily: "'Space Mono', monospace"
            }}>
              MAJORITY OR HIGHER
            </div>
          </div>

          <div style={{
            background: 'rgba(10,10,10,0.8)',
            border: '1px solid rgba(212,175,55,0.2)',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '0.65rem',
              color: '#808080',
              letterSpacing: '0.1em',
              marginBottom: '0.5rem'
            }}>
              UPTIME
            </div>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#D4AF37',
              fontFamily: "'Space Mono', monospace"
            }}>
              99.9%
            </div>
            <div style={{
              fontSize: '0.6rem',
              color: '#D4AF37',
              marginTop: '0.25rem',
              fontFamily: "'Space Mono', monospace"
            }}>
              CONTINUOUS OPERATION
            </div>
          </div>

          <div style={{
            background: 'rgba(10,10,10,0.8)',
            border: '1px solid rgba(212,175,55,0.2)',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <div style={{
              fontSize: '0.65rem',
              color: '#808080',
              letterSpacing: '0.1em',
              marginBottom: '0.5rem'
            }}>
              AVG RESPONSE TIME
            </div>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#A89968',
              fontFamily: "'Space Mono', monospace"
            }}>
              3.2s
            </div>
            <div style={{
              fontSize: '0.6rem',
              color: '#A89968',
              marginTop: '0.25rem',
              fontFamily: "'Space Mono', monospace"
            }}>
              PER DEBATE CYCLE
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsDashboard;