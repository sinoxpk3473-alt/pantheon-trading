import React from 'react';
import { motion } from 'framer-motion';

const CouncilMemberCard = ({ member, opinion, index }) => {
  const members = {
    analyst: {
      name: 'ANALYST',
      title: 'Magister Rationis',
      symbol: '◈',
      description: 'Guardian of Logic and Empirical Truth'
    },
    skeptic: {
      name: 'SKEPTIC',
      title: 'Custos Prudentiae',
      symbol: '◆',
      description: 'Protector Against Folly and Excess'
    },
    degen: {
      name: 'DEGEN',
      title: 'Dux Fortunae',
      symbol: '◇',
      description: 'Champion of Bold Ventures'
    }
  };

  const info = members[member.agent] || members.analyst;

  const decisionColors = {
    BUY: { primary: '#4B6E6A', secondary: '#6B9A96' },
    SELL: { primary: '#C0C0C0', secondary: '#D0D0D0' },
    HOLD: { primary: '#8C7853', secondary: '#A89968' }
  };

  const colors = decisionColors[opinion?.decision] || decisionColors.HOLD;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15, duration: 0.6 }}
      style={{
        background: '#0A0A0A',
        border: `1px solid ${colors.primary}20`,
        padding: '2.618rem',
        position: 'relative',
        transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
        cursor: 'pointer'
      }}
      whileHover={{
        borderColor: `${colors.primary}60`,
        boxShadow: `inset 0 0 20px ${colors.primary}10`
      }}
    >
      {/* Corner ornaments */}
      <div style={{
        position: 'absolute',
        top: '1rem',
        left: '1rem',
        width: '20px',
        height: '20px',
        borderTop: `2px solid ${colors.primary}40`,
        borderLeft: `2px solid ${colors.primary}40`
      }} />
      <div style={{
        position: 'absolute',
        top: '1rem',
        right: '1rem',
        width: '20px',
        height: '20px',
        borderTop: `2px solid ${colors.primary}40`,
        borderRight: `2px solid ${colors.primary}40`
      }} />
      <div style={{
        position: 'absolute',
        bottom: '1rem',
        left: '1rem',
        width: '20px',
        height: '20px',
        borderBottom: `2px solid ${colors.primary}40`,
        borderLeft: `2px solid ${colors.primary}40`
      }} />
      <div style={{
        position: 'absolute',
        bottom: '1rem',
        right: '1rem',
        width: '20px',
        height: '20px',
        borderBottom: `2px solid ${colors.primary}40`,
        borderRight: `2px solid ${colors.primary}40`
      }} />

      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '1.618rem',
        borderBottom: '1px solid rgba(212, 175, 55, 0.1)',
        paddingBottom: '1rem'
      }}>
        {/* Symbol */}
        <div style={{
          fontSize: '2.5rem',
          color: '#D4AF37',
          marginBottom: '0.618rem',
          fontWeight: 300,
          letterSpacing: '0.2em'
        }}>
          {info.symbol}
        </div>

        {/* Name */}
        <div style={{
          fontFamily: 'Cinzel, serif',
          fontSize: '1.125rem',
          fontWeight: 600,
          letterSpacing: '0.2em',
          color: '#D4AF37',
          textTransform: 'uppercase',
          marginBottom: '0.382rem'
        }}>
          {info.name}
        </div>

        {/* Latin Title */}
        <div style={{
          fontFamily: 'Playfair Display, serif',
          fontStyle: 'italic',
          fontSize: '0.875rem',
          color: '#C0C0C0',
          letterSpacing: '0.05em'
        }}>
          {info.title}
        </div>
      </div>

      {/* Opinion Section */}
      {opinion && (
        <div style={{ marginBottom: '1.618rem' }}>
          {/* Decision */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <div style={{
              padding: '0.618rem 1.618rem',
              border: `1px solid ${colors.primary}`,
              background: `${colors.primary}10`,
              fontFamily: 'Cinzel, serif',
              fontSize: '0.875rem',
              fontWeight: 600,
              letterSpacing: '0.2em',
              color: colors.secondary,
              textTransform: 'uppercase'
            }}>
              {opinion.decision}
            </div>
          </div>

          {/* Reasoning */}
          <div style={{
            fontFamily: 'Playfair Display, serif',
            fontStyle: 'italic',
            fontSize: '0.875rem',
            lineHeight: '1.8',
            color: '#E8E8E8',
            textAlign: 'center',
            padding: '0 1rem',
            marginBottom: '1rem',
            minHeight: '60px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            "{opinion.reasoning}"
          </div>

          {/* Metrics Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '0.618rem',
            marginTop: '1rem'
          }}>
            {/* Confidence */}
            <div style={{
              background: 'rgba(16, 16, 16, 0.6)',
              padding: '0.618rem',
              textAlign: 'center',
              border: '1px solid rgba(212, 175, 55, 0.1)'
            }}>
              <div style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '0.625rem',
                color: '#808080',
                letterSpacing: '0.1em',
                marginBottom: '0.25rem',
                textTransform: 'uppercase'
              }}>
                Fiducia
              </div>
              <div style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: '#D4AF37'
              }}>
                {opinion.confidence}%
              </div>
            </div>

            {/* Risk Level */}
            <div style={{
              background: 'rgba(16, 16, 16, 0.6)',
              padding: '0.618rem',
              textAlign: 'center',
              border: '1px solid rgba(212, 175, 55, 0.1)'
            }}>
              <div style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '0.625rem',
                color: '#808080',
                letterSpacing: '0.1em',
                marginBottom: '0.25rem',
                textTransform: 'uppercase'
              }}>
                Periculum
              </div>
              <div style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: colors.secondary
              }}>
                {opinion.riskLevel}/X
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Description */}
      <div style={{
        borderTop: '1px solid rgba(212, 175, 55, 0.1)',
        paddingTop: '1rem'
      }}>
        <div style={{
          fontFamily: 'Playfair Display, serif',
          fontSize: '0.75rem',
          color: '#A0A0A0',
          textAlign: 'center',
          lineHeight: '1.6',
          fontStyle: 'italic'
        }}>
          {info.description}
        </div>
      </div>

      {/* Reflection overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, transparent 50%, rgba(0, 0, 0, 0.2) 100%)',
        pointerEvents: 'none'
      }} />
    </motion.div>
  );
};

export default CouncilMemberCard;