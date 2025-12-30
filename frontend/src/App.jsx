import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
const RPC_URL = import.meta.env.VITE_RPC_URL;

const CONTRACT_ABI = [
  "function getTotalDebates() external view returns (uint256)",
  "function getLatestDebate() external view returns (tuple(uint256 id, uint256 timestamp, string symbol, string analystView, string skepticView, string degenView, string consensus, uint256 finalConfidence, address recorder))"
];

function App() {
  const [debate, setDebate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeAgent, setActiveAgent] = useState(null);
  const [time, setTime] = useState(new Date());
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [totalDebates, setTotalDebates] = useState(0);

  // Clock timer
  useEffect(() => {
    setIsVisible(true);
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mouse movement handler
  const handleMouseMove = (e) => {
    setMousePos({ 
      x: (e.clientX / window.innerWidth) * 100,
      y: (e.clientY / window.innerHeight) * 100
    });
  };

  // Parse agent view from blockchain format
  const parseAgent = (viewStr, initial, name, gradient) => {
    const [decision, confidence, reasoning] = viewStr.split('|');
    return {
      initial,
      name,
      decision,
      confidence: parseInt(confidence),
      reasoning,
      gradient
    };
  };

  // Fetch debate data from blockchain
  const fetchDebate = async () => {
    try {
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      const total = await contract.getTotalDebates();
      setTotalDebates(Number(total));

      if (Number(total) > 0) {
        const data = await contract.getLatestDebate();
        
        // Parse consensus
        const [decision, agreement, confidence] = data.consensus.split('|');
        
        setDebate({
          id: Number(data.id),
          symbol: data.symbol,
          price: 3847.23, // TODO: Fetch real price from API
          change: 2.34,   // TODO: Calculate from price history
          timestamp: new Date(Number(data.timestamp) * 1000),
          consensus: {
            decision,
            agreement,
            confidence: parseInt(confidence)
          },
          agents: [
            parseAgent(data.analystView, 'A', 'Analyst', 'from-cyan-500/20 to-blue-500/20'),
            parseAgent(data.skepticView, 'S', 'Skeptic', 'from-orange-500/20 to-red-500/20'),
            parseAgent(data.degenView, 'D', 'Degen', 'from-purple-500/20 to-pink-500/20')
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
    // Poll every 10 seconds for new debates
    const interval = setInterval(fetchDebate, 10000);
    return () => clearInterval(interval);
  }, []);

  const decisionColor = debate ? {
    BUY: '#10b981',
    SELL: '#ef4444',
    HOLD: '#f59e0b'
  }[debate.consensus.decision] : '#f59e0b';

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">🏛</div>
          <p className="text-zinc-500 font-light">Loading council data...</p>
        </div>
      </div>
    );
  }

  if (!debate) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🏛</div>
          <h2 className="text-2xl font-light mb-2 text-white">No Debates Yet</h2>
          <p className="text-zinc-500 text-sm mb-6">
            The council hasn't convened yet. Run the backend agent to record the first debate.
          </p>
          <code className="text-xs bg-zinc-900 px-4 py-2 rounded text-zinc-400 inline-block">
            node backend/agent.js
          </code>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen bg-black text-white font-light overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Animated mesh gradient background */}
      <div className="fixed inset-0 opacity-30">
        <div 
          className="absolute inset-0 transition-all duration-1000 ease-out"
          style={{
            background: `
              radial-gradient(circle at ${mousePos.x}% ${mousePos.y}%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
              radial-gradient(circle at ${100 - mousePos.x}% ${100 - mousePos.y}%, rgba(236, 72, 153, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)
            `
          }}
        />
      </div>

      {/* Grain texture */}
      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`
        }}
      />

      {/* Floating header with glassmorphism */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrollY > 50 ? 'bg-black/60 backdrop-blur-2xl border-b border-white/10' : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-8 py-6 flex items-center justify-between">
          <div 
            className="flex items-center gap-4 transition-all duration-700"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(-20px)'
            }}
          >
            <div className="text-3xl relative">
              <div className="absolute inset-0 blur-xl opacity-50">🏛</div>
              <div className="relative">🏛</div>
            </div>
            <div>
              <h1 className="text-xl font-light tracking-tight">Pantheon</h1>
              <div className="text-xs text-zinc-500 mt-0.5">Multi-Agent Council</div>
            </div>
          </div>
          
          <div className="flex items-center gap-8 text-sm">
            <div className="text-zinc-500 font-mono tabular-nums">
              {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 rounded-full border border-emerald-500/20">
              <div className="relative">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <span className="text-emerald-400 text-xs">Live</span>
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-6xl mx-auto px-8 pt-32 pb-20">
        {/* Asset info with stagger animation */}
        <div 
          className="mb-24 transition-all duration-700 delay-100"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)'
          }}
        >
          <div className="flex items-baseline gap-6 mb-4">
            <h2 className="text-8xl font-extralight tracking-tighter bg-gradient-to-br from-white to-zinc-400 bg-clip-text text-transparent">
              {debate.symbol}
            </h2>
            <div className="text-4xl font-light text-zinc-400 tabular-nums">
              ${debate.price.toLocaleString()}
            </div>
            <div className="relative">
              <div className="absolute inset-0 blur-xl bg-emerald-500/30" />
              <div className="relative text-2xl text-emerald-400 font-light">
                +{debate.change}%
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-zinc-500">
            <span>Debate #{debate.id}</span>
            <span className="w-1 h-1 rounded-full bg-zinc-700" />
            <span>{debate.timestamp.toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit' 
            })}</span>
            <span className="w-1 h-1 rounded-full bg-zinc-700" />
            <span>Polygon Amoy</span>
          </div>
        </div>

        {/* Consensus - hero section with modern card */}
        <div 
          className="mb-40 transition-all duration-700 delay-200"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)'
          }}
        >
          {/* Glassmorphic card */}
          <div className="relative group">
            {/* Animated border gradient */}
            <div 
              className="absolute -inset-px rounded-3xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"
              style={{
                background: `linear-gradient(135deg, ${decisionColor}30, transparent, ${decisionColor}30)`,
                filter: 'blur(20px)'
              }}
            />
            
            <div className="relative bg-zinc-950/50 backdrop-blur-2xl border border-white/5 rounded-3xl p-16 overflow-hidden">
              {/* Subtle glow that follows mouse */}
              <div 
                className="absolute w-96 h-96 rounded-full blur-3xl opacity-20 transition-all duration-700 ease-out pointer-events-none"
                style={{ 
                  backgroundColor: decisionColor,
                  left: `${mousePos.x}%`,
                  top: `${mousePos.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
              />
              
              <div className="relative text-center space-y-12">
                {/* Label with animated underline */}
                <div className="inline-block">
                  <div className="text-xs uppercase tracking-widest text-zinc-500 mb-2">
                    Council Verdict
                  </div>
                  <div 
                    className="h-px w-full transition-all duration-1000 delay-500"
                    style={{ 
                      background: `linear-gradient(90deg, transparent, ${decisionColor}, transparent)`,
                      opacity: isVisible ? 1 : 0
                    }}
                  />
                </div>

                {/* Main decision with text glow */}
                <div className="relative">
                  <div 
                    className="absolute inset-0 blur-2xl opacity-30"
                    style={{ color: decisionColor }}
                  >
                    {debate.consensus.decision}
                  </div>
                  <div 
                    className="relative text-9xl font-extralight tracking-tighter transition-all duration-1000"
                    style={{ color: decisionColor }}
                  >
                    {debate.consensus.decision}
                  </div>
                </div>

                {/* Confidence with circular progress */}
                <div className="flex flex-col items-center gap-6">
                  <div className="relative w-48 h-48">
                    {/* Background circle */}
                    <svg className="w-full h-full -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        fill="none"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="2"
                      />
                      {/* Animated progress circle */}
                      <circle
                        cx="96"
                        cy="96"
                        r="88"
                        fill="none"
                        stroke={decisionColor}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 88}`}
                        strokeDashoffset={`${2 * Math.PI * 88 * (1 - debate.consensus.confidence / 100)}`}
                        className="transition-all duration-1000 ease-out"
                        style={{
                          filter: `drop-shadow(0 0 8px ${decisionColor}40)`
                        }}
                      />
                    </svg>
                    
                    {/* Center text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-6xl font-extralight tabular-nums" style={{ color: decisionColor }}>
                        {debate.consensus.confidence}
                      </div>
                      <div className="text-xs uppercase tracking-widest text-zinc-600 mt-2">
                        Confidence
                      </div>
                    </div>
                  </div>

                  {/* Agreement badge with pulse */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/5 rounded-full blur-md animate-pulse" />
                    <div className="relative px-6 py-2 bg-white/5 backdrop-blur-xl rounded-full border border-white/10">
                      <span className="text-xs uppercase tracking-widest text-zinc-500">
                        {debate.consensus.agreement}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Agent cards with modern hover effects */}
        <div 
          className="mb-32 transition-all duration-700 delay-300"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)'
          }}
        >
          <div className="text-xs uppercase tracking-widest text-zinc-600 mb-8 flex items-center gap-3">
            <span>Agent Positions</span>
            <div className="flex-1 h-px bg-gradient-to-r from-zinc-800 to-transparent" />
          </div>
          
          <div className="grid grid-cols-3 gap-6">
            {debate.agents.map((agent, i) => (
              <button
                key={i}
                onClick={() => setActiveAgent(activeAgent === i ? null : i)}
                className="relative group text-left"
                style={{
                  transitionDelay: `${i * 100}ms`
                }}
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${agent.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl blur-xl`} />
                
                {/* Card */}
                <div className="relative bg-zinc-950/50 backdrop-blur-xl border border-white/5 rounded-2xl p-8 group-hover:border-white/10 transition-all duration-500">
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      {/* Agent avatar with gradient border */}
                      <div className="relative mb-4">
                        <div className={`absolute inset-0 bg-gradient-to-br ${agent.gradient} rounded-full blur-md opacity-50`} />
                        <div className="relative w-14 h-14 rounded-full bg-zinc-900 flex items-center justify-center text-xl font-light border border-white/10 group-hover:border-white/20 transition-colors">
                          {agent.initial}
                        </div>
                      </div>
                      <div className="text-sm text-zinc-400">{agent.name}</div>
                    </div>
                    
                    {/* Decision badge with glow */}
                    <div className="relative">
                      <div 
                        className="absolute inset-0 rounded-full blur-md opacity-50"
                        style={{ backgroundColor: decisionColor }}
                      />
                      <div 
                        className="relative px-3 py-1 rounded-full text-xs font-light border"
                        style={{ 
                          borderColor: `${decisionColor}40`,
                          backgroundColor: `${decisionColor}10`,
                          color: decisionColor
                        }}
                      >
                        {agent.decision}
                      </div>
                    </div>
                  </div>
                  
                  {/* Confidence with animated bar */}
                  <div className="mb-6">
                    <div className="text-5xl font-extralight text-zinc-400 mb-3 tabular-nums">
                      {agent.confidence}
                    </div>
                    <div className="h-px w-full bg-zinc-900 relative overflow-hidden">
                      <div 
                        className="absolute h-px transition-all duration-1000 delay-500"
                        style={{ 
                          width: `${agent.confidence}%`,
                          backgroundColor: decisionColor,
                          boxShadow: `0 0 10px ${decisionColor}`
                        }}
                      />
                    </div>
                  </div>
                  
                  {/* Reasoning with smooth expand */}
                  <div 
                    className="overflow-hidden transition-all duration-500 ease-out"
                    style={{
                      maxHeight: activeAgent === i ? '200px' : '0',
                      opacity: activeAgent === i ? 1 : 0
                    }}
                  >
                    <div className="pt-4 border-t border-white/5">
                      <p className="text-xs leading-relaxed text-zinc-500">
                        {agent.reasoning}
                      </p>
                    </div>
                  </div>
                  
                  {/* Expand indicator */}
                  <div className="flex justify-center mt-4">
                    <div 
                      className="w-8 h-1 rounded-full bg-zinc-800 transition-all duration-300"
                      style={{
                        backgroundColor: activeAgent === i ? decisionColor : 'rgb(39, 39, 42)'
                      }}
                    />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Blockchain verification with modern layout */}
        <div 
          className="transition-all duration-700 delay-400"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)'
          }}
        >
          <div className="relative group">
            <div className="absolute -inset-px bg-gradient-to-r from-purple-500/20 via-transparent to-blue-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
            
            <div className="relative bg-zinc-950/50 backdrop-blur-xl border border-white/5 rounded-2xl p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-4">
                  <div className="text-xs uppercase tracking-widest text-zinc-600">
                    On-Chain Verification
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div>
                      <div className="text-zinc-500 text-xs mb-1">Debate ID</div>
                      <div className="font-mono text-zinc-400">#{debate.id}</div>
                    </div>
                    <div className="w-px h-8 bg-zinc-800" />
                    <div>
                      <div className="text-zinc-500 text-xs mb-1">Total Debates</div>
                      <div className="font-mono text-zinc-400">{totalDebates}</div>
                    </div>
                    <div className="w-px h-8 bg-zinc-800" />
                    <div>
                      <div className="text-zinc-500 text-xs mb-1">Network</div>
                      <div className="text-zinc-400">Polygon Amoy</div>
                    </div>
                  </div>
                </div>
                
                <a 
                  href={`https://amoy.polygonscan.com/address/${CONTRACT_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all duration-300"
                >
                  <span className="text-xs text-zinc-400 group-hover/link:text-white transition-colors">
                    View Explorer
                  </span>
                  <span className="text-zinc-600 group-hover/link:text-white group-hover/link:translate-x-1 transition-all">
                    →
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Minimal footer */}
      <footer className="relative border-t border-white/5 mt-32">
        <div className="max-w-6xl mx-auto px-8 py-12">
          <div className="flex items-center justify-between text-xs text-zinc-600">
            <div className="flex items-center gap-6">
              <span>Powered by Gemini AI</span>
              <span className="w-1 h-1 rounded-full bg-zinc-800" />
              <span>© 2025 Pantheon</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-zinc-700">Total Debates: {totalDebates}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;