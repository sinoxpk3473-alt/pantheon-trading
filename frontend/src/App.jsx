import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// ⚠️ KEEP YOUR LOGIC ⚠️
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "0x2ad63F61313aa0Df129EB222381042cf64cBCd7C";
const RPC_URL = import.meta.env.VITE_RPC_URL || "https://rpc-amoy.polygon.technology/";

const CONTRACT_ABI = [
  "function getTotalDebates() external view returns (uint256)",
  "function getLatestDebate() external view returns (tuple(uint256 id, uint256 timestamp, string symbol, string analystView, string skepticView, string degenView, string consensus, uint256 finalConfidence, address recorder))"
];

function App() {
  const [debate, setDebate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeAgent, setActiveAgent] = useState(null);
  const [totalDebates, setTotalDebates] = useState(0);

  // --- LOGIC SECTION (UNCHANGED) ---
  const parseAgent = (viewStr, initial, name) => {
    const [decision, confidence, reasoning] = viewStr.split('|');
    return { initial, name, decision, confidence: parseInt(confidence), reasoning };
  };

  const fetchDebate = async () => {
    try {
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      const total = await contract.getTotalDebates();
      setTotalDebates(Number(total));

      if (Number(total) > 0) {
        const data = await contract.getLatestDebate();
        const [decision, agreement, confidence] = data.consensus.split('|');
        
        setDebate({
          id: Number(data.id),
          symbol: data.symbol,
          timestamp: new Date(Number(data.timestamp) * 1000),
          consensus: { decision, agreement, confidence: parseInt(confidence) },
          agents: [
            parseAgent(data.analystView, 'A', 'Analyst'),
            parseAgent(data.skepticView, 'S', 'Skeptic'),
            parseAgent(data.degenView, 'D', 'Degen')
          ]
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching debate:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDebate();
    const interval = setInterval(fetchDebate, 10000);
    return () => clearInterval(interval);
  }, []);

  // --- THE NEW "LUXURY" DESIGN SYSTEM ---

  // Helper to determine color based on decision
  const getStatusColor = (decision) => {
    if (decision === 'BUY') return 'text-copper border-copper/30';
    if (decision === 'SELL') return 'text-alabaster border-alabaster/30';
    return 'text-gold border-gold/30';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-vantablack flex items-center justify-center">
        <div className="animate-pulse-slow text-gold font-monument tracking-[0.3em] text-xl">
          INITIALIZING LEDGER...
        </div>
      </div>
    );
  }

  if (!debate) {
    return (
      <div className="min-h-screen bg-vantablack flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-gold font-monument text-4xl mb-4 tracking-widest">PANTHEON</h1>
        <p className="text-alabaster font-editorial italic text-lg opacity-60 mb-8">The Council is silent.</p>
        <div className="p-6 border border-gold/20 bg-obsidian max-w-md">
          <p className="font-technical text-xs text-gold/60 mb-4">AWAITING GENESIS INPUT</p>
          <code className="bg-black p-3 block text-left text-xs text-copper font-mono">
            node backend/agent.js
          </code>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vantablack text-alabaster selection:bg-gold/20 selection:text-gold overflow-x-hidden">
      
      {/* 1. HEADER: The Digital Antiquity Vibe */}
      <header className="text-center pt-20 pb-16 border-b border-gold/10 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-transparent to-gold/30" />
        <h1 className="font-monument text-5xl md:text-7xl font-black tracking-[0.2em] text-gold mb-4 drop-shadow-lg">
          PANTHEON
        </h1>
        <p className="font-editorial italic text-xl text-alabaster/60 tracking-widest">
          The Obsidian Ledger
        </p>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-16">
        
        {/* 2. THE OCULUS (Replaces the "Clock") */}
        <section className="mb-32 flex flex-col items-center">
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Rotating Rings */}
            <div className="absolute inset-0 border border-gold/10 rounded-full animate-[spin_10s_linear_infinite]" />
            <div className="absolute inset-4 border border-copper/20 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
            <div className="absolute inset-12 border border-gold/30 rounded-full" />
            
            {/* Center Data */}
            <div className="text-center z-10 backdrop-blur-sm p-4">
              <div className="font-monument text-3xl text-alabaster tracking-tighter">
                {debate.symbol}
              </div>
              <div className={`font-technical text-xs tracking-widest mt-2 ${getStatusColor(debate.consensus.decision).split(' ')[0]}`}>
                {debate.consensus.decision} DETECTED
              </div>
            </div>
          </div>
        </section>

        {/* 3. CONSILIUM (The Council Cards) */}
        <section className="mb-32">
          <div className="flex items-center justify-center gap-4 mb-16">
            <div className="h-px w-12 bg-gold/30" />
            <h2 className="font-monument text-gold text-lg tracking-[0.3em]">CONSILIUM</h2>
            <div className="h-px w-12 bg-gold/30" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {debate.agents.map((agent, i) => (
              <div 
                key={i}
                onClick={() => setActiveAgent(activeAgent === i ? null : i)}
                className={`group relative p-8 border transition-all duration-700 cursor-pointer bg-obsidian
                  ${activeAgent === i ? 'border-gold/40 bg-obsidian/80' : 'border-white/5 hover:border-gold/20'}
                `}
              >
                {/* Minimalist Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="font-editorial italic text-2xl text-alabaster">
                    {agent.name}
                  </div>
                  <div className={`font-technical text-xs px-2 py-1 border ${getStatusColor(agent.decision)}`}>
                    {agent.decision}
                  </div>
                </div>

                {/* Technical Stats */}
                <div className="mb-6 space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="font-technical text-[10px] text-alabaster/40 uppercase">Confidence</span>
                    <span className="font-technical text-xl text-gold">{agent.confidence}%</span>
                  </div>
                  <div className="w-full h-px bg-white/10">
                    <div 
                      className="h-full bg-gold transition-all duration-1000" 
                      style={{ width: `${agent.confidence}%` }} 
                    />
                  </div>
                </div>

                {/* Reasoning (Collapsible) */}
                <div className={`overflow-hidden transition-all duration-500 ${activeAgent === i ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="font-editorial text-sm leading-relaxed text-alabaster/80 border-t border-white/5 pt-4">
                    "{agent.reasoning}"
                  </p>
                </div>

                {/* Hover Reveal Indicator */}
                {activeAgent !== i && (
                  <div className="text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="font-technical text-[10px] text-gold/50">+ READ ANALYSIS</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* 4. THE LEDGER (Verification) */}
        <section className="border-t border-gold/10 pt-16">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <h3 className="font-monument text-sm text-gold tracking-widest mb-2">IMMUTABLE RECORD</h3>
              <p className="font-technical text-xs text-alabaster/40">
                BLOCKCHAIN ID: #{debate.id} • POLYGON AMOY
              </p>
            </div>
            <a 
              href={`https://amoy.polygonscan.com/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noreferrer"
              className="font-technical text-xs text-gold/60 hover:text-gold border-b border-transparent hover:border-gold transition-all pb-1"
            >
              VIEW ON BLOCK EXPLORER ↗
            </a>
          </div>
        </section>

      </main>
    </div>
  );
}

export default App;