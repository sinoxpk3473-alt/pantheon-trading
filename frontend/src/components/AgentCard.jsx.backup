import React from 'react';
import { motion } from 'framer-motion';

const AgentCard = ({ agent, opinion, index }) => {
  if (!opinion) return null;

  const decisionColors = {
    BUY: 'from-green-500 to-emerald-600',
    SELL: 'from-red-500 to-rose-600',
    HOLD: 'from-yellow-500 to-amber-600'
  };

  const decisionBg = {
    BUY: 'bg-green-500/10 border-green-500/30',
    SELL: 'bg-red-500/10 border-red-500/30',
    HOLD: 'bg-yellow-500/10 border-yellow-500/30'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
      className="relative bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 overflow-hidden"
    >
      {/* Glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${decisionColors[opinion.decision]} opacity-5`} />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Agent Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{agent.emoji}</div>
            <div>
              <h3 className="text-lg font-bold text-white">{agent.name}</h3>
              <p className="text-xs text-slate-400">{agent.role}</p>
            </div>
          </div>
          
          {/* Decision Badge */}
          <div className={`px-3 py-1 rounded-full border ${decisionBg[opinion.decision]}`}>
            <span className={`text-sm font-bold ${
              opinion.decision === 'BUY' ? 'text-green-400' :
              opinion.decision === 'SELL' ? 'text-red-400' :
              'text-yellow-400'
            }`}>
              {opinion.decision}
            </span>
          </div>
        </div>

        {/* Confidence Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>CONFIDENCE</span>
            <span className="font-mono font-bold text-white">{opinion.confidence}%</span>
          </div>
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${opinion.confidence}%` }}
              transition={{ delay: index * 0.2 + 0.3, duration: 0.8, ease: "easeOut" }}
              className={`h-full bg-gradient-to-r ${decisionColors[opinion.decision]}`}
            />
          </div>
        </div>

        {/* Reasoning */}
        <div className="bg-slate-800/50 rounded-lg p-3 mb-3">
          <p className="text-sm text-slate-300 leading-relaxed">
            "{opinion.reasoning}"
          </p>
        </div>

        {/* Risk Level */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-400">RISK TOLERANCE</span>
          <div className="flex gap-1">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className={`w-2 h-4 rounded-sm ${
                  i < opinion.riskLevel
                    ? 'bg-purple-500'
                    : 'bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AgentCard;