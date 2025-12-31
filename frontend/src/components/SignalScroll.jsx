import React from 'react';
import { motion } from 'framer-motion';

const SignalScroll = ({ signal, index }) => {
  const { decision, confidence, reasoning, timestamp, symbol } = signal;

  // Determine verdict style based on decision
  const verdictStyle = {
    BUY: {
      borderColor: '#4B6E6A',
      textColor: '#6B9A96',
      oracle: 'The oracle suggests accumulation at these levels...'
    },
    SELL: {
      borderColor: '#C0C0C0',
      textColor: '#D0D0D0',
      oracle: 'The augurs advise liquidation of positions...'
    },
    HOLD: {
      borderColor: '#8C7853',
      textColor: '#A89968',
      oracle: 'Wisdom dictates patience in this hour...'
    }
  };

  const style = verdictStyle[decision] || verdictStyle.HOLD;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="signal-scroll"
      style={{
        position: 'relative',
        background: 'rgba(10, 10, 10, 0.95)',
        borderTop: `1px solid ${style.borderColor}20`,
        borderBottom: `1px solid ${style.borderColor}20`,
        padding: '1.618rem 2.618rem',
        marginBottom: '1rem',
        backdropFilter: 'blur(10px)',
        minHeight: '100px',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {/* Vertical accent line */}
      <div style={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '3px',
        background: `linear-gradient(to bottom, transparent, ${style.borderColor}, transparent)`
      }} />

      <div style={{ flex: 1 }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '0.618rem'
        }}>
          {/* Symbol */}
          <div style={{
            fontFamily: 'Cinzel, serif',
            fontSize: '0.875rem',
            fontWeight: 600,
            letterSpacing: '0.2em',
            color: '#D4AF37',
            textTransform: 'uppercase'
          }}>
            {symbol || 'ETHVSVSD'}
          </div>

          {/* Timestamp */}
          <div style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '0.625rem',
            color: '#808080',
            letterSpacing: '0.05em'
          }}>
            {timestamp ? new Date(timestamp).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }) : 'MMXV.XII.XXX'}
          </div>
        </div>

        {/* Oracle's Verdict (Italic Serif) */}
        <div style={{
          fontFamily: 'Playfair Display, serif',
          fontStyle: 'italic',
          fontSize: '1rem',
          lineHeight: '1.8',
          color: '#E8E8E8',
          marginBottom: '0.618rem',
          letterSpacing: '0.02em'
        }}>
          {reasoning || style.oracle}
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem'
        }}>
          {/* Decision Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              background: style.borderColor,
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)'
            }} />
            <span style={{
              fontFamily: 'Cinzel, serif',
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.15em',
              color: style.textColor,
              textTransform: 'uppercase'
            }}>
              {decision}
            </span>
          </div>

          {/* Confidence Meter */}
          <div style={{
            flex: 1,
            maxWidth: '200px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '0.25rem'
            }}>
              <span style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '0.625rem',
                color: '#808080',
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
              }}>
                Certitudo
              </span>
              <span style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '0.625rem',
                color: '#D4AF37',
                fontWeight: 700
              }}>
                {confidence}%
              </span>
            </div>
            
            {/* Progress bar */}
            <div style={{
              height: '2px',
              background: 'rgba(212, 175, 55, 0.1)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${confidence}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                style={{
                  height: '100%',
                  background: `linear-gradient(to right, ${style.borderColor}, #D4AF37)`,
                  boxShadow: `0 0 4px ${style.borderColor}`
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Reflection overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />
    </motion.div>
  );
};

export default SignalScroll;