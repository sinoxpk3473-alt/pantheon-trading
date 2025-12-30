import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { motion } from "framer-motion";
import { Activity, ShieldCheck, Zap, Terminal, ExternalLink, TrendingUp, TrendingDown, Cpu } from "lucide-react";
import PantheonABI from "./PantheonCouncil.json";

// ⚠️ VERIFY THIS MATCHES YOUR .ENV EXACTLY
const CONTRACT_ADDRESS = "0x2ad63F61313aa0Df129EB222381042cf64cBCd7C"; 
const AMOY_RPC = "https://rpc-amoy.polygon.technology/";

const App = () => {
  const [trades, setTrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const provider = new ethers.JsonRpcProvider(AMOY_RPC);
        const contract = new ethers.Contract(CONTRACT_ADDRESS, PantheonABI.abi, provider);

        const totalTrades = await contract.getTotalTrades();
        const tradeCount = Number(totalTrades);
        
        let loadedTrades = [];
        // Fetch last 10 trades
        for (let i = tradeCount - 1; i >= Math.max(0, tradeCount - 10); i--) {
          const trade = await contract.getTrade(i);
          loadedTrades.push({
            id: Number(trade.id),
            symbol: trade.symbol,
            side: trade.side,
            entry: Number(trade.entryPrice),
            confidence: Number(trade.confidence),
            verdict: trade.verdict,
            timestamp: Number(trade.timestamp),
          });
        }
        setTrades(loadedTrades);
      } catch (error) {
        console.error("Error fetching trades:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrades();
    const interval = setInterval(fetchTrades, 5000); // Live Refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-pantheon-bg text-pantheon-text font-sans">
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full glass-panel z-50 px-8 py-5 flex justify-between items-center border-b-0 border-pantheon-accent/20">
        <div className="flex items-center gap-3">
          <div className="bg-pantheon-accent/10 p-2 rounded-lg border border-pantheon-accent/20">
            <Terminal className="text-pantheon-accent" size={20} />
          </div>
          <h1 className="text-xl font-bold tracking-tight font-mono text-white">PANTHEON <span className="text-pantheon-accent">PRO</span></h1>
        </div>
        <div className="flex items-center gap-6 text-sm font-mono text-gray-400">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-pantheon-green/10 border border-pantheon-green/20">
             <div className="w-1.5 h-1.5 rounded-full bg-pantheon-green status-dot animate-pulse"></div>
             <span className="text-pantheon-green">SYSTEM ONLINE</span>
          </div>
          <span>POLYGON AMOY</span>
        </div>
      </nav>

      <main className="pt-32 px-6 max-w-7xl mx-auto pb-20">
        {/* HEADER STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <StatCard icon={<Cpu size={24} />} title="AI ENGINE" value="Gemini 2.5 Pro" color="text-pantheon-gold" />
          <StatCard icon={<Activity size={24} />} title="TOTAL SIGNALS" value={trades.length.toString()} color="text-pantheon-accent" />
          <StatCard icon={<ShieldCheck size={24} />} title="AUDIT STATUS" value="VERIFIED" color="text-pantheon-green" />
          <StatCard icon={<Zap size={24} />} title="LATENCY" value="12ms" color="text-purple-400" />
        </div>

        {/* FEED HEADER */}
        <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-3 font-mono tracking-tight text-white">
              <Activity className="text-pantheon-accent" /> SIGNAL FEED
            </h2>
            <div className="text-xs text-gray-500 font-mono">LIVE CONNECTION ESTABLISHED</div>
        </div>

        {/* TRADES LIST */}
        {loading ? (
          <div className="glass-panel p-20 text-center rounded-2xl flex flex-col items-center justify-center gap-4">
             <div className="w-12 h-12 border-4 border-pantheon-accent border-t-transparent rounded-full animate-spin"></div>
             <div className="text-pantheon-accent animate-pulse font-mono">ESTABLISHING NEURAL LINK...</div>
          </div>
        ) : (
          <div className="space-y-4">
            {trades.map((trade, idx) => (
              <motion.div
                key={trade.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-panel p-6 rounded-xl flex flex-col md:flex-row items-center justify-between group relative overflow-hidden"
              >
                {/* DECORATIVE BACKGROUND ACCENT */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${trade.side === 'BUY' ? 'bg-pantheon-green' : 'bg-pantheon-red'}`}></div>

                <div className="flex items-center gap-6 w-full md:w-auto">
                  <div className={`p-4 rounded-xl ${trade.side === 'BUY' ? 'bg-pantheon-green/10 text-pantheon-green' : 'bg-pantheon-red/10 text-pantheon-red'}`}>
                    {trade.side === 'BUY' ? <TrendingUp size={28} /> : <TrendingDown size={28} />}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-2xl font-bold font-mono tracking-tight text-white">{trade.symbol}</h3>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded border ${trade.side === 'BUY' ? 'border-pantheon-green text-pantheon-green' : 'border-pantheon-red text-pantheon-red'}`}>
                        {trade.side}
                      </span>
                    </div>
                    <p className="text-gray-500 text-xs font-mono">{new Date(trade.timestamp * 1000).toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex-1 px-8 my-4 md:my-0 border-l border-white/5 ml-8 h-full flex flex-col justify-center">
                  <p className="text-gray-300 text-lg leading-relaxed font-light">"{trade.verdict}"</p>
                </div>

                <div className="w-full md:w-auto flex flex-col items-end gap-3 min-w-[150px]">
                  <div className="text-right">
                    <div className="text-xs text-gray-500 font-mono mb-1">AI CONFIDENCE</div>
                    <div className="text-xl font-bold text-pantheon-accent">{trade.confidence}%</div>
                  </div>
                  <a 
                    href={`https://amoy.polygonscan.com/tx/${CONTRACT_ADDRESS}`}
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-2 text-xs text-gray-500 hover:text-pantheon-accent transition-colors"
                  >
                    VERIFY ONCHAIN <ExternalLink size={12} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="glass-panel p-6 rounded-xl relative overflow-hidden"
  >
    <div className={`absolute top-4 right-4 opacity-20 ${color}`}>{icon}</div>
    <div className="text-gray-500 text-xs font-mono mb-2 tracking-wider">{title}</div>
    <div className={`text-2xl font-bold ${color}`}>{value}</div>
  </motion.div>
);

export default App;