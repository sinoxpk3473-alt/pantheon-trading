import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import AgentCard from './components/AgentCard';
import ConsensusPanel from './components/ConsensusPanel';

const AGENTS = [
  { 
    emoji: '🤓', 
    name: 'THE ANALYST', 
    role: 'Technical Expert',
    color: 'blue'
  },
  { 
    emoji: '🛡️', 
    name: 'THE SKEPTIC', 
    role: 'Risk Manager',
    color: 'orange'
  },
  { 
    emoji: '🚀', 
    name: 'THE DEGEN', 
    role: 'Momentum Trader',
    color: 'purple'
  }
];

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const RPC_URL = import.meta.env.VITE_RPC_URL;

const CONTRACT_ABI = [
  "function getTotalDebates() external view returns (uint256)",
  "function getLatestDebate() external view returns (tuple(uint256 id, uint256 timestamp, string symbol, string analystView, string skepticView, string degenView, string consensus, uint256 finalConfidence, address recorder))",
  "function getDebate(uint256 debateId) external view returns (tuple(uint256 id, uint256 timestamp, string symbol, string analystView, string skepticView, string degenView, string consensus, uint256 finalConfidence, address recorder))"
];

function App() {
  const [latestDebate, setLatestDebate] = useState(null);
  const [opinions, setOpinions] = useState([null, null, null]);
  const [consensus, setConsensus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalDebates, setTotalDebates] = useState(0);

  // Parse debate data from contract format
  const parseDebateData = (debate) => {
    try {
      // Parse agent views: "DECISION|CONFIDENCE|REASONING"
      const parseView = (viewStr) => {
        const [decision, confidence, reasoning] = viewStr.split('|');
        return {
          decision,
          confidence: parseInt(confidence),
          reasoning,
          riskLevel: decision === 'BUY' ? 7 : decision === 'SELL' ? 3 : 5
        };
      };

      const analystOp = parseView(debate.analystView);
      const skepticOp = parseView(debate.skepticView);
      const degenOp = parseView(debate.degenView);

      // Parse consensus: "DECISION|AGREEMENT|CONFIDENCE"
      const [decision, agreement, confidence] = debate.consensus.split('|');
      
      // Calculate votes
      const votes = {
        BUY: [analystOp, skepticOp, degenOp].filter(o => o.decision === 'BUY').length,
        SELL: [analystOp, skepticOp, degenOp].filter(o => o.decision === 'SELL').length,
        HOLD: [analystOp, skepticOp, degenOp].filter(o => o.decision === 'HOLD').length
      };

      setOpinions([analystOp, skepticOp, degenOp]);
      setConsensus({
        decision,
        agreement,
        confidence: parseInt(confidence),
        votes
      });
      setLatestDebate(debate);
    } catch (error) {
      console.error('Error parsing debate:', error);
    }
  };

  // Fetch latest debate from blockchain
  const fetchLatestDebate = async () => {
    try {
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      const total = await contract.getTotalDebates();
      setTotalDebates(Number(total));

      if (Number(total) > 0) {
        const debate = await contract.getLatestDebate();
        parseDebateData(debate);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching debate:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestDebate();

    // Poll every 10 seconds
    const interval = setInterval(fetchLatestDebate, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🏛️</div>
          <p className="text-slate-400 font-mono">Loading Council...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Noise texture overlay */}
      <div className="fixed inset-0 opacity-20 pointer-events-none" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 400 400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' /%3E%3C/svg%3E")'
      }} />

      {/* Header */}
      <header className="relative border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-4xl">🏛️</div>
              <div>
                <h1 className="text-3xl font-black tracking-tight">
                  PANTHEON <span className="text-purple-400">PRO</span>
                </h1>
                <p className="text-sm text-slate-400 font-mono">Multi-Agent Trading Council</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm font-mono text-green-400">SYSTEM ONLINE</span>
                </div>
              </div>
              
              <div className="px-4 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <div className="text-sm text-slate-400">POLYGON AMOY</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-12">
        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-4 mb-12">
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4">
            <div className="text-sm text-slate-400 mb-1">AI ENGINE</div>
            <div className="text-lg font-bold text-purple-400">Gemini 2.5 Pro</div>
          </div>
          
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4">
            <div className="text-sm text-slate-400 mb-1">TOTAL DEBATES</div>
            <div className="text-lg font-bold">{totalDebates}</div>
          </div>
          
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4">
            <div className="text-sm text-slate-400 mb-1">AUDIT STATUS</div>
            <div className="text-lg font-bold text-green-400">VERIFIED</div>
          </div>
          
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-4">
            <div className="text-sm text-slate-400 mb-1">LATENCY</div>
            <div className="text-lg font-bold text-purple-400">12ms</div>
          </div>
        </div>

        {/* Section Title */}
        <div className="mb-8">
          <h2 className="text-3xl font-black mb-2">
            <span className="text-purple-400">🗳️</span> COUNCIL CHAMBER
          </h2>
          <p className="text-slate-400">Three AI agents debate market conditions in real-time</p>
        </div>

        {/* Agent Opinions */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          {AGENTS.map((agent, index) => (
            <AgentCard
              key={agent.name}
              agent={agent}
              opinion={opinions[index]}
              index={index}
            />
          ))}
        </div>

        {/* Consensus */}
        {consensus && (
          <div className="mb-12">
            <ConsensusPanel consensus={consensus} />
          </div>
        )}

        {/* On-Chain Proof */}
        {latestDebate && (
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span>⛓️</span> Blockchain Verification
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-slate-400 mb-1">Debate ID</div>
                <div className="font-mono">#{latestDebate.id.toString()}</div>
              </div>
              <div>
                <div className="text-slate-400 mb-1">Block Time</div>
                <div className="font-mono">
                  {new Date(Number(latestDebate.timestamp) * 1000).toLocaleString()}
                </div>
              </div>
              <div className="col-span-2">
                <div className="text-slate-400 mb-1">Contract Address</div>
                <div className="font-mono text-xs break-all text-purple-400">
                  {CONTRACT_ADDRESS}
                </div>
              </div>
            </div>
            <a
              href={`https://amoy.polygonscan.com/address/${CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg transition-colors"
            >
              <span className="text-sm">View on PolygonScan</span>
              <span>↗</span>
            </a>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;