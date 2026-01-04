import React, { useState, useEffect } from 'react';

const AnimatedDebate = ({ councilMembers, onComplete }) => {
  const [currentSpeaker, setCurrentSpeaker] = useState(null);
  const [phase, setPhase] = useState('intro'); // intro, debate, consensus, complete
  const [showConsensus, setShowConsensus] = useState(false);

  useEffect(() => {
    if (!councilMembers || councilMembers.length === 0) return;

    const runDebateSequence = async () => {
      // Phase 1: Intro (2 seconds)
      setPhase('intro');
      await sleep(2000);

      // Phase 2: Each agent speaks (4 seconds each)
      setPhase('debate');
      for (let i = 0; i < councilMembers.length; i++) {
        setCurrentSpeaker(i);
        await sleep(4000);
      }

      // Phase 3: Building consensus (2 seconds)
      setCurrentSpeaker(null);
      setPhase('consensus');
      await sleep(2000);

      // Phase 4: Show result
      setShowConsensus(true);
      setPhase('complete');
      
      if (onComplete) {
        setTimeout(onComplete, 2000);
      }
    };

  runDebateSequence();
}, []);

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  // Calculate consensus
  const getConsensus = () => {
    if (!councilMembers || councilMembers.length === 0) return null;
    
    const decisions = councilMembers.map(m => m.decision);
    const counts = { BUY: 0, SELL: 0, HOLD: 0 };
    decisions.forEach(d => counts[d]++);
    
    const maxVotes = Math.max(counts.BUY, counts.SELL, counts.HOLD);
    const winner = Object.keys(counts).find(k => counts[k] === maxVotes);
    
    return {
      decision: winner,
      votes: counts,
      agreement: maxVotes === 3 ? 'UNANIMOUS' : maxVotes === 2 ? 'MAJORITY' : 'SPLIT'
    };
  };

  const consensus = getConsensus();

  return (
    <div style={{
      background: 'rgba(10, 10, 10, 0.95)',
      border: '1px solid rgba(212, 175, 55, 0.3)',
      borderRadius: '4px',
      padding: '3rem',
      marginBottom: '3rem',
      minHeight: '500px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Background glow effect */}
      {currentSpeaker !== null && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at center, rgba(212, 175, 55, 0.1) 0%, transparent 70%)`,
          animation: 'pulse 2s ease-in-out infinite',
          pointerEvents: 'none'
        }} />
      )}

      {/* Intro Phase */}
      {phase === 'intro' && (
        <div style={{
          textAlign: 'center',
          paddingTop: '6rem',
          animation: 'fadeIn 1s ease-in'
        }}>
          <div style={{
            fontSize: '4rem',
            color: '#D4AF37',
            marginBottom: '2rem',
            animation: 'rotate 2s linear infinite'
          }}>
            ◇
          </div>
          <h2 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '2rem',
            fontWeight: 600,
            letterSpacing: '0.3em',
            color: '#D4AF37',
            marginBottom: '1rem'
          }}>
            CONSILIUM IN SESSION
          </h2>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            fontSize: '1.1rem',
            color: '#A0A0A0'
          }}>
            Three minds deliberate...
          </p>
        </div>
      )}

      {/* Debate Phase */}
      {phase === 'debate' && (
        <div>
          {/* Agent Podiums */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            {councilMembers.map((member, idx) => (
              <div
                key={idx}
                style={{
                  textAlign: 'center',
                  padding: '2rem',
                  background: currentSpeaker === idx 
                    ? 'rgba(212, 175, 55, 0.1)' 
                    : 'rgba(16, 16, 16, 0.5)',
                  border: `2px solid ${
                    currentSpeaker === idx 
                      ? '#D4AF37' 
                      : 'rgba(212, 175, 55, 0.2)'
                  }`,
                  transform: currentSpeaker === idx ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.3s ease',
                  boxShadow: currentSpeaker === idx 
                    ? '0 0 30px rgba(212, 175, 55, 0.4)' 
                    : 'none'
                }}
              >
                {/* Speaking indicator */}
                {currentSpeaker === idx && (
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#D4AF37',
                    padding: '4px 12px',
                    fontSize: '0.7rem',
                    fontFamily: "'Cinzel', serif",
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    color: '#050505',
                    borderRadius: '2px'
                  }}>
                    SPEAKING
                  </div>
                )}

                <div style={{
                  fontSize: '3rem',
                  color: '#D4AF37',
                  marginBottom: '1rem',
                  animation: currentSpeaker === idx ? 'bounce 0.6s ease-in-out infinite' : 'none'
                }}>
                  {member.symbol}
                </div>
                
                <div style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  letterSpacing: '0.15em',
                  color: '#D4AF37',
                  marginBottom: '0.5rem'
                }}>
                  {member.name}
                </div>

                <div style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: '0.75rem',
                  color: member.decision === 'BUY' ? '#6B9A96' :
                         member.decision === 'SELL' ? '#D0D0D0' :
                         '#A89968',
                  fontWeight: 700
                }}>
                  {member.decision}
                </div>
              </div>
            ))}
          </div>

          {/* Speech Bubble */}
          {currentSpeaker !== null && councilMembers[currentSpeaker] && (
            <div style={{
              background: 'rgba(16, 16, 16, 0.9)',
              border: '1px solid rgba(212, 175, 55, 0.4)',
              padding: '2rem',
              borderRadius: '4px',
              animation: 'slideUp 0.5s ease-out'
            }}>
              <div style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '0.8rem',
                letterSpacing: '0.15em',
                color: '#D4AF37',
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                {councilMembers[currentSpeaker].name} DECLARES:
              </div>
              
              <p style={{
                fontFamily: "'Playfair Display', serif",
                fontStyle: 'italic',
                fontSize: '1.1rem',
                lineHeight: '1.8',
                color: '#E8E8E8',
                textAlign: 'center',
                marginBottom: '1rem'
              }}>
                "{councilMembers[currentSpeaker].reasoning}"
              </p>

              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '2rem',
                fontFamily: "'Space Mono', monospace",
                fontSize: '0.75rem',
                color: '#A0A0A0'
              }}>
                <span>Confidence: <strong style={{ color: '#D4AF37' }}>
                  {councilMembers[currentSpeaker].confidence}%
                </strong></span>
                <span>Risk: <strong style={{ color: '#A89968' }}>
                  {councilMembers[currentSpeaker].riskLevel}/X
                </strong></span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Consensus Phase */}
      {phase === 'consensus' && !showConsensus && (
        <div style={{
          textAlign: 'center',
          paddingTop: '6rem',
          animation: 'fadeIn 1s ease-in'
        }}>
          <div style={{
            fontSize: '4rem',
            color: '#D4AF37',
            marginBottom: '2rem',
            animation: 'pulse 1s ease-in-out infinite'
          }}>
            ⚖️
          </div>
          <h2 style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '1.8rem',
            fontWeight: 600,
            letterSpacing: '0.3em',
            color: '#D4AF37',
            marginBottom: '1rem'
          }}>
            BUILDING CONSENSUS
          </h2>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontStyle: 'italic',
            fontSize: '1rem',
            color: '#A0A0A0'
          }}>
            The council deliberates...
          </p>
        </div>
      )}

      {/* Consensus Result */}
      {showConsensus && consensus && (
        <div style={{
          textAlign: 'center',
          paddingTop: '4rem',
          animation: 'scaleIn 0.5s ease-out'
        }}>
          <div style={{
            marginBottom: '2rem'
          }}>
            <div style={{
              display: 'inline-block',
              padding: '2rem 4rem',
              background: `linear-gradient(135deg, ${
                consensus.decision === 'BUY' ? '#4B6E6A, #6B9A96' :
                consensus.decision === 'SELL' ? '#C0C0C0, #D0D0D0' :
                '#8C7853, #A89968'
              })`,
              borderRadius: '4px',
              boxShadow: '0 8px 32px rgba(212, 175, 55, 0.3)'
            }}>
              <div style={{
                fontFamily: "'Cinzel', serif",
                fontSize: '3.5rem',
                fontWeight: 900,
                letterSpacing: '0.2em',
                color: '#FFFFFF',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                {consensus.decision}
              </div>
            </div>
          </div>

          <div style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '1rem',
            letterSpacing: '0.2em',
            color: '#D4AF37',
            marginBottom: '1.5rem'
          }}>
            {consensus.agreement} CONSENSUS
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '3rem',
            fontFamily: "'Space Mono', monospace",
            fontSize: '0.9rem',
            color: '#C0C0C0'
          }}>
            <div>
              <span style={{ color: '#6B9A96' }}>BUY:</span> {consensus.votes.BUY}
            </div>
            <div>
              <span style={{ color: '#D0D0D0' }}>SELL:</span> {consensus.votes.SELL}
            </div>
            <div>
              <span style={{ color: '#A89968' }}>HOLD:</span> {consensus.votes.HOLD}
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes scaleIn {
          from { 
            opacity: 0;
            transform: scale(0.8);
          }
          to { 
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes pulse {
          0%, 100% { 
            opacity: 0.6;
            transform: scale(1);
          }
          50% { 
            opacity: 1;
            transform: scale(1.1);
          }
        }
        
        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};

export default AnimatedDebate;