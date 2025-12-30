import React from 'react';
import { motion } from 'framer-motion';

const ConsensusPanel = ({ consensus }) => {
  if (!consensus) return null;

  const decisionColors = {
    BUY: 'from-green-500 to-emerald-600',
    SELL: 'from-red-500 to-rose-600',
    HOLD: 'from-yellow-500 to-amber-600'
  };

  const agreementIcons = {
    UNANIMOUS: '🎯',
    MAJORITY: '⚖️',
    SPLIT: '🤔'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8 }}
      className="relative bg-slate-900/50 backdrop-blur-xl border-2 border-purple-500/50 rounded-3xl p-8 overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-pink-600/5 to-blue-600/10 animate-pulse" />
      
      {/* Noise texture overlay */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")'
      }} />

      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 border border-purple-500/30 rounded-full mb-3">
            <span className="text-2xl">{agreementIcons[consensus.agreement]}</span>
            <span className="text-sm font-mono text-purple-300">{consensus.agreement} CONSENSUS</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-2">COUNCIL VERDICT</h2>
        </div>

        {/* Main Decision */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1, type: "spring", stiffness: 200 }}
            className={`inline-block px-12 py-6 bg-gradient-to-r ${decisionColors[consensus.decision]} rounded-2xl shadow-2xl`}
          >
            <div className="text-6xl font-black text-white tracking-tight">
              {consensus.decision}
            </div>
          </motion.div>
        </div>

        {/* Vote Breakdown */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {Object.entries(consensus.votes).map(([decision, count]) => (
            <div key={decision} className="text-center">
              <div className="text-2xl font-bold text-white mb-1">{count}</div>
              <div className={`text-xs font-mono ${
                decision === 'BUY' ? 'text-green-400' :
                decision === 'SELL' ? 'text-red-400' :
                'text-yellow-400'
              }`}>
                {decision}
              </div>
            </div>
          ))}
        </div>

        {/* Confidence */}
        <div className="bg-slate-800/50 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">AVERAGE CONFIDENCE</span>
            <span className="text-2xl font-mono font-bold text-white">{consensus.confidence}%</span>
          </div>
          <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${consensus.confidence}%` }}
              transition={{ delay: 1.2, duration: 1, ease: "easeOut" }}
              className={`h-full bg-gradient-to-r ${decisionColors[consensus.decision]}`}
            />
          </div>
        </div>

        {/* Timestamp */}
        <div className="text-center mt-4">
          <p className="text-xs text-slate-500 font-mono">
            Recorded at {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default ConsensusPanel;