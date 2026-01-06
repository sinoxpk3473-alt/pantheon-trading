import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './styles/circuit-board.css';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import DebateHistory from './components/DebateHistory';

const CONTRACT_ADDRESS = '0x13713f5E8fbfD05E7B7DcA81E231D89D51D2ccB3';
const RPC_URL = 'https://rpc-amoy.polygon.technology';

const CONTRACT_ABI = [
  "function getTotalDebates() external view returns (uint256)",
  "function getLatestDebate() external view returns (tuple(uint256 id, uint256 timestamp, string symbol, string analystView, string skepticView, string degenView, string consensus, uint256 finalConfidence, address recorder))"
];

function App() {
  const [currentTime, setCurrentTime] = useState(null);
  const [latestDebate, setLatestDebate] = useState(null);
  const [councilMembers, setCouncilMembers] = useState([]);
  const [totalDebates, setTotalDebates] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setCurrentTime(new Date());
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchLatestDebate();
    const interval = setInterval(fetchLatestDebate, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchLatestDebate = async () => {
    try {
      const provider = new ethers.JsonRpcProvider(RPC_URL);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      const total = await contract.getTotalDebates();
      setTotalDebates(Number(total));

      if (Number(total) > 0) {
        const debate = await contract.getLatestDebate();
        parseDebate(debate);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const parseDebate = (debate) => {
    const parseView = (viewStr) => {
      const [decision, confidence, reasoning] = viewStr.split('|');
      return { decision, confidence: parseInt(confidence), reasoning };
    };

    const analyst = parseView(debate.analystView);
    const skeptic = parseView(debate.skepticView);
    const degen = parseView(debate.degenView);

    setCouncilMembers([
      { name: 'ANALYST', latin: 'Magister Rationis', symbol: '◈', ...analyst },
      { name: 'SKEPTIC', latin: 'Custos Prudentiae', symbol: '◆', ...skeptic },
      { name: 'DEGEN', latin: 'Dux Fortunae', symbol: '◇', ...degen }
    ]);

    setLatestDebate(debate);
  };

  if (loading) {
    return <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D4AF37', fontFamily: "'Cinzel', serif", fontSize: '1.5rem', letterSpacing: '0.3em' }}>LOADING...</div>;
  }

  return (
    <div className="pantheon-container">
      {/* Circuit Board Background */}
      <div className="circuit-bg-layer-1" />
      <div className="circuit-bg-layer-2" />
      <div className="circuit-bg-layer-3" />

      <div className="content-wrapper">
        {/* Ornate Header */}
        <header className="baroque-header">
          <div className="header-left">
            <h1 className="title-main">PANTHEON</h1>
            <p className="title-sub">The Obsidian Ledger</p>
          </div>
          
          {/* Ornate ETH Coin */}
          <div className="eth-medallion">
            <div className="medallion-outer-ring">
              <div className="baroque-flourish baroque-flourish-left" />
              <div className="baroque-flourish baroque-flourish-right" />
            </div>
            <div className="medallion-inner">
              <svg viewBox="0 0 256 417" className="eth-logo">
                <path fill="#D4AF37" d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z"/>
                <path fill="#C39A4A" d="M127.962 0L0 212.32l127.962 75.639V154.158z"/>
                <path fill="#D4AF37" d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z"/>
                <path fill="#C39A4A" d="M127.962 416.905v-104.72L0 236.585z"/>
              </svg>
            </div>
          </div>

          <div className="header-right">
            <div className="time-display">{currentTime?.toLocaleTimeString('en-US', { hour12: false })}</div>
            <div className="network-badge">POLYGON • AMOY</div>
          </div>
        </header>

        {/* ETH Banner with Circuit Frame */}
        <div className="eth-banner">
          <div className="circuit-connector circuit-left" />
          <div className="banner-content">
            <div className="banner-section">
              <span className="banner-label">INSTRUMENTUM</span>
              <span className="banner-value">ETH</span>
              <span className="banner-sublabel">Detected</span>
            </div>
            <div className="eth-coin-center">
              <div className="coin-3d">
                <svg viewBox="0 0 256 417" className="eth-icon">
                  <path fill="#D4AF37" d="M127.961 0l-2.795 9.5v275.668l2.795 2.79 127.962-75.638z"/>
                  <path fill="#FFD700" d="M127.962 0L0 212.32l127.962 75.639V154.158z"/>
                  <path fill="#D4AF37" d="M127.961 312.187l-1.575 1.92v98.199l1.575 4.6L256 236.587z"/>
                  <path fill="#FFD700" d="M127.962 416.905v-104.72L0 236.585z"/>
                </svg>
              </div>
            </div>
            <div className="banner-section">
              <span className="banner-label">SENTENTIA</span>
              <span className="banner-value">HOLD</span>
              <span className="banner-sublabel">Consensus Reached</span>
            </div>
          </div>
          <div className="circuit-connector circuit-right" />
        </div>

        {/* CONSILIUM Title */}
        <h2 className="section-title">CONSILIUM</h2>

        {/* Council Cards */}
        <div className="council-grid">
          {councilMembers.map((member, idx) => (
            <div key={idx} className="council-card">
              {/* 3D Frame */}
              <div className="card-frame-outer">
                <div className="card-frame-inner">
                  {/* Corner Circuit Nodes */}
                  <div className="circuit-node" style={{ top: '8px', left: '8px' }} />
                  <div className="circuit-node" style={{ top: '8px', right: '8px' }} />
                  <div className="circuit-node" style={{ bottom: '8px', left: '8px' }} />
                  <div className="circuit-node" style={{ bottom: '8px', right: '8px' }} />

                  {/* Card Content */}
                  <div className="card-content">
                    <div className="agent-symbol">{member.symbol}</div>
                    <div className="agent-name">{member.name}</div>
                    <div className="agent-latin">{member.latin}</div>
                    
                    <div className="decision-badge-container">
                      <div className="decision-badge">{member.decision}</div>
                    </div>

                    <div className="reasoning-text">"{member.reasoning}"</div>

                    <div className="metrics-row">
                      <div className="metric-box">
                        <div className="metric-label">FIDUCIA</div>
                        <div className="metric-value">{member.confidence}%</div>
                      </div>
                      <div className="metric-box">
                        <div className="metric-label">PERICULUM</div>
                        <div className="metric-value">{member.decision === 'BUY' ? '7' : member.decision === 'SELL' ? '3' : '5'}/X</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {!loading && councilMembers.length > 0 && (
          <AnalyticsDashboard 
            totalDebates={totalDebates}
            latestDebate={latestDebate}
            councilMembers={councilMembers}
          />
        )}

       {!loading && totalDebates > 0 && (
         <DebateHistory />
        )}

        {/* Immutable Record - Baroque Panel */}
        <div className="immutable-panel">
          <div className="baroque-corner baroque-tl" />
          <div className="baroque-corner baroque-tr" />
          <div className="baroque-corner baroque-bl" />
          <div className="baroque-corner baroque-br" />

          <h3 className="panel-title">IMMUTABLE RECORD</h3>

          <div className="record-content">
            <div className="record-section">
              <div className="record-plate">
                <span className="plate-text">NAME | ID</span>
              </div>
            </div>

            <div className="record-section">
              <div className="record-label">BLOCKCHAIN ID</div>
              <div className="record-value">#{totalDebates}</div>
            </div>

            <div className="record-section">
              <div className="record-label">NETWORK</div>
              <div className="record-value">POLYGON AMCY</div>
            </div>

            <div className="record-section">
              <div className="record-label">STATUS</div>
              <div className="record-value status-verified">VERIFIED</div>
            </div>

            <div className="record-section">
              <div className="record-plate">
                <span className="plate-text">VERIFIED</span>
              </div>
            </div>

            <div className="verified-seal">
              <div className="seal-ring">
                <div className="seal-center">✓</div>
              </div>
            </div>
          </div>

          <button 
            className="inspect-button"
            onClick={() => window.open(`https://amoy.polygonscan.com/address/${CONTRACT_ADDRESS}`, '_blank')}
          >
            INSPICE LIBRUM
          </button>
        </div>
      </div>

      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital@0;1&family=Cinzel:wght@400;600;900&display=swap" rel="stylesheet" />
    </div>
  );
}

export default App;