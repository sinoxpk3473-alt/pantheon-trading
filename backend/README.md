# Pantheon Pro Backend

Multi-agent AI trading system backend with automated debate execution.

## Features
- 🤖 Three AI agents (Analyst, Skeptic, Degen)
- ⛓️ Blockchain integration (Polygon Amoy)
- 🔄 Auto-debate scheduler (every 30 minutes)
- 📡 REST API endpoints

## Environment Variables
GEMINI_API_KEY=your_gemini_key
PRIVATE_KEY=your_wallet_private_key
CONTRACT_ADDRESS=your_contract_address
RPC_URL=https://rpc-amoy.polygon.technology
PORT=3000

## Endpoints

- `GET /` - Health check
- `GET /api/debate/latest` - Get latest debate
- `GET /api/debate/count` - Get total debates
- `POST /api/debate/trigger` - Manually trigger debate

## Running Locally
```bash
npm install
npm start
```

## Deployment

Deployed on Railway: [Your Railway URL will go here]