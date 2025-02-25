# BTC Portfolio Manager

A comprehensive portfolio management solution for Bitcoin assets across multiple chains, including Stacks, Rootstock, and BOB. This project enables users to track, manage, and optimize their BTC investments through various DeFi protocols and strategies.

## 🌟 Features

- **Multi-Chain Portfolio Tracking**
  - Track BTC assets across Stacks (sBTC), Rootstock, and BOB
  - Real-time portfolio valuation and performance metrics
  - Transaction history and analytics

- **AI-Powered Trading Assistant**
  - Natural language interaction for trading and portfolio management
  - Automated strategy suggestions and execution
  - Risk assessment and portfolio optimization

- **DeFi Protocol Integration**
  - Velar Protocol integration for Stacks trading
  - BOB strategies for yield generation
  - Cross-chain token swaps via Wormhole

- **Smart Contract Features**
  - ERC-7621 Basket Token Standard implementation
  - Transparent upgradeable proxy contracts
  - Factory contracts for basket token deployment

## 🏗️ Architecture

```mermaid
graph TB
    subgraph Frontend
        UI[Next.js UI]
        Context[React Context]
        Components[UI Components]
    end

    subgraph Agent
        AI[AI Assistant]
        Plugins[Plugin System]
        subgraph Plugins
            VelarPlugin[Velar Plugin]
            BOBPlugin[BOB Plugin]
            WormholePlugin[Wormhole Plugin]
        end
        Evaluators[Action Evaluators]
    end

    subgraph Smart Contracts
        BasketToken[Basket Token Standard]
        Factory[Token Factory]
        Proxy[Upgradeable Proxy]
        Vault[Domain Vault]
    end

    subgraph Protocols
        Velar[Velar Protocol]
        BOB[BOB Protocol]
        Wormhole[Wormhole Bridge]
    end

    UI --> Context
    Context --> Components
    UI --> Agent
    Agent --> Plugins
    Plugins --> Protocols
    Smart Contracts --> Protocols
    UI --> Smart Contracts
```

## 🔧 Technical Stack

- **Frontend**
  - Next.js 14
  - TailwindCSS
  - shadcn/ui components
  - TypeScript

- **Agent**
  - Node.js
  - ElizaOS Core
  - Custom plugins for protocol integration
  - Natural language processing

- **Smart Contracts**
  - Solidity
  - ERC-7621 standard
  - OpenZeppelin contracts
  - Hardhat development environment

## 🚀 Getting Started

### Prerequisites
- Node.js >= 22
- pnpm or npm
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/btc-portfolio-manager.git
cd btc-portfolio-manager
```

2. Install frontend dependencies:
```bash
cd frontend
npm install
```

3. Install agent dependencies:
```bash
cd ../agent
pnpm install
```

4. Set up environment variables:
```bash
cp frontend/.env.example frontend/.env
cp agent/.env.example agent/.env
```

5. Start the development servers:

Frontend:
```bash
cd frontend
npm run dev
```

Agent:
```bash
cd agent
pnpm start
```

## 🔐 Smart Contract Addresses

### Testnet Deployments

**Rootstock Testnet:**
- BasketTokenStandard: `0x1602cF4Ffa1da92d1708d74e5A9985593176171A`
- BasketTokenStandardPair: `0x9dc50A13c06Bc9b46430581180158108A59308f2`
- Factory: `0x54F686d1a8D3600f9f9Ead9ba3F31903438e0E2e`

## 🛠️ Development

### Project Structure
```
btc-portfolio-manager/
├── frontend/           # Next.js frontend application
├── agent/             # AI assistant and plugins
├── bob/              # BOB protocol integration
└── runes-basket-contracts/ # Smart contracts
```

### Key Components

1. **Frontend**
   - Portfolio dashboard
   - Transaction management
   - Strategy visualization
   - Wallet integration

2. **Agent**
   - Natural language processing
   - Protocol-specific plugins
   - Action recognition and execution
   - State management

3. **Smart Contracts**
   - Basket token implementation
   - Factory contracts
   - Proxy contracts
   - Domain vault

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🔗 Links

- [Wormhole Explorer](https://wormholescan.io/)
- [Rootstock Explorer](https://rootstock-testnet.blockscout.com/)
- [Documentation](docs/)


