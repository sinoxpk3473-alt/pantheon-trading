# 🏛️ PANTHEON PRO - Multi-Agent AI Trading Council

> **Where Three AI Minds Trade Better Than One**

[![Live Demo](https://img.shields.io/badge/demo-live-green)](https://pantheon-trading-bot.vercel.app/)
[![Contract](https://img.shields.io/badge/contract-verified-blue)](https://amoy.polygonscan.com/address/0x13713f5E8fbfD05E7B7DcA81E231D89D51D2ccB3)
[![Backend](https://img.shields.io/badge/backend-deployed-success)](https://pantheon-backend-hll6.onrender.com)
[![License](https://img.shields.io/badge/license-MIT-orange)](LICENSE)

![Pantheon Dashboard](./screenshots/dashboard.png)

---

## 🎯 Overview

**Pantheon Pro** revolutionizes algorithmic trading by implementing a **multi-agent AI consensus system**. Three AI personalities with distinct risk profiles debate every market decision before reaching consensus. Every debate is permanently recorded on the Polygon blockchain for complete transparency.

### 🔑 Key Innovation

Unlike traditional single-model AI trading systems, Pantheon Pro uses **adversarial AI deliberation**:
- **The Analyst**: Conservative, data-driven technical analysis (Risk: 3/10)
- **The Skeptic**: Defensive risk manager, questions bullish narratives (Risk: 2/10)  
- **The Degen**: Aggressive momentum trader, high conviction plays (Risk: 9/10)

Decisions require **majority consensus**, preventing single-point-of-failure risks inherent in solo AI trading.

---

## ✨ Features

### 🤖 **Three Distinct AI Agents**
Each agent analyzes market data independently using Google Gemini 2.5 Flash with unique prompting:
- Different confidence thresholds
- Opposing risk tolerances
- Diverse trading philosophies

### ⚖️ **Democratic Consensus Mechanism**
- **Unanimous**: All 3 agents agree (highest confidence)
- **Majority**: 2 out of 3 agents align
- **Split**: No consensus (default to HOLD)

### ⛓️ **Blockchain Verification**
Every debate is recorded on Polygon Amoy testnet:
- Immutable decision history
- Transparent reasoning logs
- Public audit trail
- Gas-efficient storage

### 🎨 **Premium Circuit Board Aesthetic**
- 3-layer PCB trace background
- 3D metallic gold card frames
- Baroque ornamental elements
- Swiss bank meets Ancient Rome design language

### 🔄 **Real-Time Auto-Updates**
- Backend debates run every 10 seconds
- Frontend auto-refreshes from blockchain
- Live market data integration (CoinGecko API)

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│  React + Vite + Tailwind CSS (Vercel Deployed)              │
│  - Circuit Board UI Layer                                    │
│  - Real-time Blockchain Reader                               │
│  - Auto-refresh every 10s                                    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ ethers.js (Read Contract)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    SMART CONTRACT                            │
│  Solidity 0.8.20 (Polygon Amoy Testnet)                     │
│  Address: 0x13713f5E8fbfD05E7B7DcA81E231D89D51D2ccB3        │
│  - recordDebate(symbol, views, consensus, confidence)        │
│  - getLatestDebate() → DebateRecord                          │
│  - getTotalDebates() → uint256                               │
└────────────────────▲────────────────────────────────────────┘
                     │
                     │ ethers.js (Write Transactions)
                     │
┌─────────────────────────────────────────────────────────────┐
│                         BACKEND                              │
│  Node.js + Express (Render Deployed)                        │
│  https://pantheon-backend-hll6.onrender.com                 │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ DEBATE ORCHESTRATOR (10s interval)                   │   │
│  │  1. Fetch market data (CoinGecko)                    │   │
│  │  2. Consult 3 AI agents (Gemini 2.5 Flash)          │   │
│  │  3. Calculate consensus                               │   │
│  │  4. Record on blockchain                              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
│  Agent System:                                               │
│  ├─ Analyst: Technical analysis focus                       │
│  ├─ Skeptic: Risk management focus                          │
│  └─ Degen: Momentum trading focus                           │
└─────────────────────────────────────────────────────────────┘
                     │
                     │ API Calls
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    GOOGLE GEMINI AI                          │
│  Model: gemini-2.5-flash                                     │
│  - 3 independent inference calls per debate                  │
│  - Structured output parsing (DECISION|CONFIDENCE|REASON)    │
│  - Rate limit handling with exponential backoff              │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **ethers.js v6** - Blockchain interaction
- **Custom CSS** - Circuit board styling
- **Vercel** - Deployment

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **Google Gemini 2.5 Flash** - AI agents
- **ethers.js v6** - Blockchain writes
- **Render** - Deployment

### Blockchain
- **Solidity 0.8.20** - Smart contracts
- **Hardhat** - Development environment
- **OpenZeppelin** - Contract libraries
- **Polygon Amoy** - Testnet deployment

### External APIs
- **CoinGecko** - Market data (free tier)
- **Google Gemini** - AI inference
- **Polygon RPC** - Blockchain access

---

## 📦 Installation & Setup

### Prerequisites
```bash
node >= 18.0.0
npm >= 9.0.0
```

### 1. Clone Repository
```bash
git clone https://github.com/sinoxpk3473-alt/pantheon-trading
cd pantheon-trading
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..

# Install backend dependencies
cd backend && npm install && cd ..
```

### 3. Environment Variables

Create `.env` in root directory:
```env
# Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Blockchain
PRIVATE_KEY=your_wallet_private_key
CONTRACT_ADDRESS=0x13713f5E8fbfD05E7B7DcA81E231D89D51D2ccB3
RPC_URL=https://rpc-amoy.polygon.technology

# Frontend (create frontend/.env)
VITE_CONTRACT_ADDRESS=0x13713f5E8fbfD05E7B7DcA81E231D89D51D2ccB3
VITE_RPC_URL=https://rpc-amoy.polygon.technology
```

### 4. Deploy Smart Contract (Optional)
```bash
# Compile contracts
npx hardhat compile

# Deploy to Polygon Amoy
npx hardhat run scripts/deploy.js --network amoy

# Update CONTRACT_ADDRESS in .env with deployed address
```

### 5. Run Backend
```bash
cd backend
node server.js
# Backend runs on http://localhost:3001
# Debates execute every 10 seconds
```

### 6. Run Frontend
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

---

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd frontend
vercel --prod
```

### Backend (Render)
1. Create new Web Service on Render
2. Connect GitHub repository
3. Build command: `cd backend && npm install`
4. Start command: `node server.js`
5. Add environment variables

### Smart Contract (Polygon Amoy)
```bash
npx hardhat run scripts/deploy.js --network amoy
```

---

## 📊 Smart Contract Interface

### Main Functions

```solidity
// Record a new debate (backend only)
function recordDebate(
    string memory symbol,
    string memory analystView,
    string memory skepticView,
    string memory degenView,
    string memory consensus,
    uint256 finalConfidence
) external

// Get latest debate (public read)
function getLatestDebate() external view returns (
    DebateRecord memory
)

// Get total number of debates
function getTotalDebates() external view returns (uint256)
```

### Debate Record Structure
```solidity
struct DebateRecord {
    uint256 id;
    uint256 timestamp;
    string symbol;
    string analystView;    // "BUY|75|Strong uptrend confirmed"
    string skepticView;    // "HOLD|60|Risk of correction"
    string degenView;      // "BUY|90|Moon mission activated"
    string consensus;      // "BUY|MAJORITY|75"
    uint256 finalConfidence;
    address recorder;
}
```

---

## 🎨 Design System

### Color Palette
- **Gold**: `#D4AF37` - Primary accent, borders, text highlights
- **Darker Gold**: `#C39A4A` - Secondary accents
- **Bright Gold**: `#FFD700` - Glows, emphasis
- **Black**: `#000000` - Main background
- **Dark Gray**: `rgba(10,10,10,0.98)` - Card backgrounds
- **Silver**: `#C0C0C0` - Secondary text
- **Gray**: `#808080` - Tertiary text

### Typography
- **Display**: Cinzel (serif, 900 weight)
- **Body Serif**: Playfair Display (italic)
- **Monospace**: Space Mono, Courier New

### Layout Principles
- Circuit board grid background (3 layers)
- 3D metallic card frames with inset shadows
- Baroque corner ornaments
- Golden ratio spacing (1.618)
- Swiss precision meets Roman grandeur

---

## 🔐 Security

### Implemented
- ✅ Private keys in environment variables
- ✅ Rate limiting on AI API calls
- ✅ Input validation on smart contract
- ✅ Error handling with try-catch
- ✅ No user fund custody

### Recommendations for Production
- [ ] Implement multi-sig wallet for contract writes
- [ ] Add emergency pause mechanism
- [ ] Comprehensive unit test coverage
- [ ] Professional smart contract audit
- [ ] API key rotation strategy
- [ ] DDoS protection on backend

---

## 📈 Performance

### Current Metrics
- **Debate Frequency**: Every 10 seconds
- **Frontend Load Time**: < 2s
- **Blockchain Confirmation**: ~5-10 seconds
- **AI Inference Time**: ~2-3 seconds per agent
- **Total Debates Recorded**: 39+ (and counting)

### Gas Costs (Polygon Amoy)
- Deploy Contract: ~0.002 MATIC
- Record Debate: ~0.0001 MATIC
- Read Operations: Free

---

## 🎥 Demo Video

**Watch the full demo**: [YouTube Link](https://youtu.be/9yp6bhUJJSc)

**Live Application**: https://pantheon-trading-xyz.vercel.app

**Smart Contract**: https://amoy.polygonscan.com/address/0x13713f5E8fbfD05E7B7DcA81E231D89D51D2ccB3

---

## 🗺️ Roadmap

### Phase 1: MVP ✅ (Complete)
- [x] Three AI agent system
- [x] Consensus mechanism
- [x] Smart contract deployment
- [x] Frontend with circuit board design
- [x] Backend auto-debate system
- [x] Blockchain verification

### Phase 2: Analytics 🚧 (In Progress)
- [ ] Performance tracking dashboard
- [ ] Agent win rate statistics
- [ ] Historical debate archive
- [ ] Confidence trend charts

### Phase 3: Production 📋 (Planned)
- [ ] Mainnet deployment
- [ ] Real trading integration
- [ ] Portfolio management
- [ ] Mobile app
- [ ] Multi-token support

---

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file.

---

## 🙏 Acknowledgments

- **Google** - Gemini AI API
- **Polygon** - Scalable blockchain infrastructure
- **OpenZeppelin** - Secure smart contract libraries
- **CoinGecko** - Free crypto market data API

---

## 📞 Contact

**Developer**: Ali Sinan 

**Email**: sinanzx3473@gmail.com  

**Project Link**: https://github.com/sinoxpk3473-alt/pantheon-trading 

**Live Demo**: https://pantheon-trading-bot.vercel.app

---

## ⚠️ Disclaimer

**This is experimental software for educational and demonstration purposes only.**

- Not financial advice
- Not audited for production use
- Testnet deployment only
- Use at your own risk
- No warranty or guarantees

**DO NOT use with real funds without:**
- Professional smart contract audit
- Comprehensive testing
- Legal compliance review
- Risk management strategy

---

**Built with ❤️ for the hackathon community**

*"In consilium fortitudo" - In deliberation, strength*