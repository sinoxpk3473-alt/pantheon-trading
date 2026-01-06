import React, { useState, useEffect } from 'react';

const AnalyticsDashboard = ({ totalDebates, councilMembers }) => {
  const [stats, setStats] = useState({
    decisionBreakdown: { BUY: 0, SELL: 0, HOLD: 0 },
    agentPerformance: {
      analyst: { correct: 0, total: 0 },
      skeptic: { correct: 0, total: 0 },
      degen: { correct: 0, total: 0 }
    },
    confidenceTrend: [],
    avgConfidence: 0
  });

  useEffect(() => {
    if (councilMembers.length === 3) {
      // Mock data - in production, fetch from backend
      const newStats = {
        decisionBreakdown: {
          BUY: Math.floor(totalDebates * 0.35),
          SELL: Math.floor(totalDebates * 0.25),
          HOLD: Math.floor(totalDebates * 0.40)
        },
        agentPerformance: {
          analyst: { correct: Math.floor(totalDebates * 0.68), total: totalDebates },
          skeptic: { correct: Math.floor(totalDebates * 0.72), total: totalDebates },
          degen: { correct: Math.floor(totalDebates * 0.61), total: totalDebates }
        },
        confidenceTrend: generateTrend(20),
        avgConfidence: Math.round((councilMembers[0].confidence + councilMembers[1].confidence + councilMembers[2].confidence) / 3)
      };
      setStats(newStats);
    }
  }, [councilMembers, totalDebates]);

  const generateTrend = (count) => {
    const trend = [];
    for (let i = 0; i < count; i++) {
      trend.push({
        debate: totalDebates - count + i + 1,
        confidence: 50 + Math.random() * 40,
        decision: ['BUY', 'SELL', 'HOLD'][Math.floor(Math.random() * 3)]
      });
    }
    return trend;
  };

  const DecisionPieChart = ({ data }) => {
    const total = data.BUY + data.SELL + data.HOLD || 1;
    const buyPct = (data.BUY / total) * 100;
    const sellPct = (data.SELL / total) * 100;
    const holdPct = (data.HOLD / total) * 100;

    // Calculate pie slices
    const buyAngle = (buyPct / 100) * 360;
    const sellAngle = (sellPct / 100) * 360;
    const holdAngle = (holdPct / 100) * 360;

    const createArc = (startAngle, endAngle, color) => {
      const start = polarToCartesian(100, 100, 80, endAngle);
      const end = polarToCartesian(100, 100, 80, startAngle);
      const largeArc = endAngle - startAngle <= 180 ? '0' : '1';
      
      return `M 100 100 L ${start.x} ${start.y} A 80 80 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
    };

    const polarToCartesian = (cx, cy, r, angle) => {
      const rad = (angle - 90) * Math.PI / 180;
      return {
        x: cx + r * Math.cos(rad),
        y: cy + r * Math.sin(rad)
      };
    };

    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '3rem'
      }}>
        <svg width="200" height="200" viewBox="0 0 200 200">
          {/* BUY slice */}
          <path
            d={createArc(0, buyAngle, '#6B9A96')}
            fill="#6B9A96"
            opacity="0.8"
            stroke="#000"
            strokeWidth="2"
          />
          {/* SELL slice */}
          <path
            d={createArc(buyAngle, buyAngle + sellAngle, '#D0D0D0')}
            fill="#D0D0D0"
            opacity="0.8"
            stroke="#000"
            strokeWidth="2"
          />
          {/* HOLD slice */}
          <path
            d={createArc(buyAngle + sellAngle, 360, '#A89968')}
            fill="#A89968"
            opacity="0.8"
            stroke="#000"
            strokeWidth="2"
          />
          
          {/* Center circle */}
          <circle cx="100" cy="100" r="50" fill="rgba(10,10,10,0.9)" stroke="#D4AF37" strokeWidth="2" />
          
          {/* Center text */}
          <text x="100" y="95" textAnchor="middle" fill="#D4AF37" fontSize="12" fontFamily="'Cinzel', serif" letterSpacing="2">
            TOTAL
          </text>
          <text x="100" y="115" textAnchor="middle" fill="#D4AF37" fontSize="24" fontFamily="'Space Mono', monospace" fontWeight="700">
            {total}
          </text>
        </svg>

        <div style={{flex: 1}}>
          <div style={{marginBottom: '1rem'}}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '0.5rem'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                background: '#6B9A96',
                border: '2px solid #6B9A96'
              }} />
              <div style={{flex: 1}}>
                <div style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '0.8rem',
                  letterSpacing: '0.1em',
                  color: '#6B9A96',
                  marginBottom: '0.25rem'
                }}>
                  BUY
                </div>
                <div style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: '#D4AF37'
                }}>
                  {data.BUY} ({buyPct.toFixed(1)}%)
                </div>
              </div>
            </div>
          </div>

          <div style={{marginBottom: '1rem'}}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '0.5rem'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                background: '#D0D0D0',
                border: '2px solid #D0D0D0'
              }} />
              <div style={{flex: 1}}>
                <div style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '0.8rem',
                  letterSpacing: '0.1em',
                  color: '#D0D0D0',
                  marginBottom: '0.25rem'
                }}>
                  SELL
                </div>
                <div style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: '#D4AF37'
                }}>
                  {data.SELL} ({sellPct.toFixed(1)}%)
                </div>
              </div>
            </div>
          </div>

          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '0.5rem'
            }}>
              <div style={{
                width: '20px',
                height: '20px',
                background: '#A89968',
                border: '2px solid #A89968'
              }} />
              <div style={{flex: 1}}>
                <div style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '0.8rem',
                  letterSpacing: '0.1em',
                  color: '#A89968',
                  marginBottom: '0.25rem'
                }}>
                  HOLD
                </div>
                <div style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: '#D4AF37'
                }}>
                  {data.HOLD} ({holdPct.toFixed(1)}%)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AgentPerformanceChart = ({ data }) => {
    const maxCorrect = Math.max(data.analyst.correct, data.skeptic.correct, data.degen.correct);
    
    const agents = [
      { name: 'ANALYST', symbol: '◈', data: data.analyst, color: '#6B9A96' },
      { name: 'SKEPTIC', symbol: '◆', data: data.skeptic, color: '#D0D0D0' },
      { name: 'DEGEN', symbol: '◇', data: data.degen, color: '#A89968' }
    ];

    return (
      <div style={{display: 'grid', gap: '1rem'}}>
        {agents.map((agent) => {
          const winRate = ((agent.data.correct / agent.data.total) * 100).toFixed(1);
          const barWidth = (agent.data.correct / maxCorrect) * 100;

          return (
            <div key={agent.name} style={{
              background: 'rgba(10,10,10,0.6)',
              border: '1px solid rgba(212,175,55,0.2)',
              padding: '1rem'
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.75rem'
              }}>
                <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                  <span style={{fontSize: '1.5rem', color: '#D4AF37'}}>{agent.symbol}</span>
                  <span style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: '0.8rem',
                    letterSpacing: '0.15em',
                    color: '#D4AF37'
                  }}>
                    {agent.name}
                  </span>
                </div>
                <div style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  color: agent.color
                }}>
                  {winRate}%
                </div>
              </div>

              <div style={{
                height: '30px',
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(212,175,55,0.1)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <div style={{
                  height: '100%',
                  width: `${barWidth}%`,
                  background: `linear-gradient(90deg, ${agent.color}40, ${agent.color}80)`,
                  border: `1px solid ${agent.color}`,
                  transition: 'width 0.5s ease',
                  display: 'flex',
                  alignItems: 'center',
                  paddingLeft: '0.5rem'
                }}>
                  <span style={{
                    fontFamily: "'Space Mono', monospace",
                    fontSize: '0.7rem',
                    color: agent.color,
                    fontWeight: 700
                  }}>
                    {agent.data.correct} / {agent.data.total}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const ConfidenceTimeline = ({ data }) => {
    if (!data || data.length === 0) return null;

    const maxConf = Math.max(...data.map(d => d.confidence));
    const minConf = Math.min(...data.map(d => d.confidence));
    const range = maxConf - minConf || 1;

    const width = 800;
    const height = 150;
    const padding = 30;

    const points = data.map((d, i) => {
      const x = padding + (i / (data.length - 1)) * (width - padding * 2);
      const y = height - padding - ((d.confidence - minConf) / range) * (height - padding * 2);
      return { x, y, ...d };
    });

    return (
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{maxWidth: '100%'}}>
        {/* Grid lines */}
        <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(212,175,55,0.1)" strokeWidth="1" />
        <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="rgba(212,175,55,0.1)" strokeWidth="1" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(212,175,55,0.1)" strokeWidth="1" />

        {/* Confidence line */}
        <polyline
          points={points.map(p => `${p.x},${p.y}`).join(' ')}
          fill="none"
          stroke="#D4AF37"
          strokeWidth="2"
          style={{filter: 'drop-shadow(0 0 4px rgba(212,175,55,0.6))'}}
        />

        {/* Data points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r="4"
              fill={p.decision === 'BUY' ? '#6B9A96' : p.decision === 'SELL' ? '#D0D0D0' : '#A89968'}
              stroke="#000"
              strokeWidth="1"
            />
          </g>
        ))}

        {/* Axis labels */}
        <text x={padding} y={height - 5} fontSize="10" fill="#808080" fontFamily="'Space Mono', monospace">
          #{data[0].debate}
        </text>
        <text x={width - padding} y={height - 5} fontSize="10" fill="#808080" fontFamily="'Space Mono', monospace" textAnchor="end">
          #{data[data.length - 1].debate}
        </text>
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

      {/* Top Row: Decision Distribution + Agent Performance */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem',
        marginBottom: '2rem'
      }}>
        {/* Decision Distribution */}
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

          <h3 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '0.9rem',
            letterSpacing: '0.2em',
            color: '#D4AF37',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            DECISION DISTRIBUTION
          </h3>

          <DecisionPieChart data={stats.decisionBreakdown} />
        </div>

        {/* Agent Performance */}
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

          <h3 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '0.9rem',
            letterSpacing: '0.2em',
            color: '#D4AF37',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            AGENT WIN RATE
          </h3>

          <AgentPerformanceChart data={stats.agentPerformance} />
        </div>
      </div>

      {/* Bottom: Confidence Timeline */}
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
            <h3 style={{
              fontFamily: "'Cinzel', serif",
              fontSize: '0.9rem',
              letterSpacing: '0.2em',
              color: '#D4AF37',
              marginBottom: '0.5rem'
            }}>
              CONFIDENCE TREND
            </h3>
            <div style={{
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic',
              fontSize: '0.75rem',
              color: '#A0A0A0'
            }}>
              Last {stats.confidenceTrend.length} debates
            </div>
          </div>

          <div style={{textAlign: 'right'}}>
            <div style={{
              fontSize: '0.65rem',
              color: '#808080',
              letterSpacing: '0.1em',
              marginBottom: '0.25rem'
            }}>
              CURRENT AVG
            </div>
            <div style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#D4AF37',
              fontFamily: "'Space Mono', monospace"
            }}>
              {stats.avgConfidence}%
            </div>
          </div>
        </div>

        <div style={{
          background: 'rgba(10,10,10,0.8)',
          border: '1px solid rgba(212,175,55,0.2)',
          padding: '1rem'
        }}>
          <ConfidenceTimeline data={stats.confidenceTrend} />

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            marginTop: '1rem',
            fontSize: '0.7rem',
            fontFamily: "'Space Mono', monospace"
          }}>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <div style={{width: '12px', height: '12px', background: '#6B9A96', border: '1px solid #000'}} />
              <span style={{color: '#6B9A96'}}>BUY</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <div style={{width: '12px', height: '12px', background: '#D0D0D0', border: '1px solid #000'}} />
              <span style={{color: '#D0D0D0'}}>SELL</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <div style={{width: '12px', height: '12px', background: '#A89968', border: '1px solid #000'}} />
              <span style={{color: '#A89968'}}>HOLD</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnalyticsDashboard;