# 🏥 ChainMed - DPS Blockchain Portal

Anti-fraud system for Personal Health Declarations (DPS) using Ethereum Sepolia blockchain.

## 🌟 Features

- ✅ **Anti-Fraud System** - Prevents duplicate declarations and omissions
- ✅ **Sepolia Blockchain** - Immutable and verifiable data
- ✅ **Multilingual** - Portuguese and English
- ✅ **MetaMask Integration** - Authentication via wallet
- ✅ **REST API** - Queries for insurance companies
- ✅ **Family Management** - DPS for multiple participants

## 🚀 Technologies

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Blockchain**: Solidity, Hardhat, Ethers.js
- **Database**: PostgreSQL
- **Authentication**: MetaMask Web3
- **Deployment**: Vercel, Sepolia Testnet

## 📋 Prerequisites

1. **Node.js** (version 18 or higher)
2. **MetaMask** installed in the browser
3. **PostgreSQL** (local or cloud)
4. **Test ETH** on the Sepolia network
5. **Infura account** or **Alchemy** for RPC

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/josiasdev/ChainMed_Chan_Link
cd ChainMed_Chan_Link
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Copy the `.env.example` file to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in the variables:

```env
# Blockchain Configuration
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/SEU_PROJECT_ID
PRIVATE_KEY=sua_chave_privada_aqui
ETHERSCAN_API_KEY=sua_api_key_etherscan

# Contract Addresses
NEXT_PUBLIC_CONTRACT_ADDRESS=endereco_do_contrato_deployado
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/SEU_PROJECT_ID

# Database
DATABASE_URL=postgresql://usuario:senha@localhost:5432/chainmed

# Application
JWT_SECRET=sua_chave_jwt_secreta
API_SECRET_KEY=sua_chave_api_secreta
```

### 4. Configure the Database

Run the SQL scripts in the order:

```bash
# 1. Create tables
psql -d chainmed -f scripts/01-create-tables.sql

# 2. Insert test data
psql -d chainmed -f scripts/02-seed-data.sql
```

### 5. Compile and Deploy the Smart Contract

```bash
# Compile contracts
npx hardhat compile

# Deploy on the Sepolia network
npx hardhat run scripts/deploy-sepolia.js --network sepolia

# Check on Etherscan (optional)
npx hardhat verify --network sepolia ENDERECO_DO_CONTRATO
```

### 6. Run the Application

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

## 📁 Script Structure

### SQL Scripts (2 files)
- `scripts/01-create-tables.sql` - Creating tables and indexes
- `scripts/02-seed-data.sql` - Test data and examples

### Smart Contract (1 file)
- `contracts/ChainMedDPS.sol` - Optimized main contract

### Deploy Scripts
- `scripts/deploy-sepolia.js` - Automated deployment in Sepolia
- `hardhat.config.js` - Hardhat configuration

## 🌐 Sepolia Network Setup

### 1. Get Test ETH

Visit one of the faucets:
- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Alchemy Faucet](https://www.alchemy.com/faucets)
- [Infura Faucet](https://www.infura.io/faucet)

### 2. Configure MetaMask

Add the Sepolia network to MetaMask:

- **Network Name**: Sepolia Test Network
- **RPC URL**: https://sepolia.infura.io/v3/YOUR_PROJECT_ID
- **Chain ID**: 11155111
- **Token**: SEP
- **Block Explorer**: https://sepolia.etherscan.io/

## 📚 Project Structure

```
ChainMed_Chan_Link/
├── app/ # Next.js App Router
│ ├── api/ # API Routes
│ ├── sign up/ # Sign up page
│ ├── dashboard/ # User Dashboard
│ ├── dps/ # DPS Pages
│ ├── login/ # Login Page
│ └── insurer/ # Insurer Dashboard
├── components/ # React Components
│ ├── ui/ # shadcn/ui Components
│ └── language-switcher.tsx
├── contracts/ # Smart Contract (1 file)
│ └── ChainMedDPS.sol # Main Contract
├── lib/ # Utilities
│ ├── crypto.ts # Hash Functions
│ ├── i18n.ts # Internationalization
│ ├── language-context.tsx
│ └── web3.ts # Integration Web3
├── scripts/ # SQL scripts and Deploy (3 files)
│ ├── 01-create-tables.sql # Database schema
│ ├── 02-seed-data.sql # Test data
│ └── deploy-sepolia.js # Contract deployment
└── hardhat.config.js # Hardhat configuration
```

## 🧪 Test Data

**Example Users:**
- **João Silva Santos**
- Hash: `a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456`
- CPF: `12345678901`

- **Maria Silva Santos**
- Hash: `b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567a`
- CPF: `98765432109`

**Test API Keys:**
- `sk_test_1234567890abcdef`
- `sk_test_abcdef1234567890`
- `sk_test_fedcba0987654321`

## 🌍 Internationalization

The system supports Portuguese and English. To change language:

```typescript
const { setLanguage } = useLanguage()
setLanguage('en') // English
setLanguage('pt') // Portuguese
```

## 🚀 Deploy to Production

### 1. Vercel (Frontend)

```bash
npx vercel --prod
```

### 2. Ethereum Mainnet

⚠️ **Attention**: Deploying to the mainnet requires real ETH and a security audit.

```bash
# Deploy to mainnet (BE CAREFUL!)
npx hardhat run scripts/deploy-sepolia.js --network mainnet
```

## 🔧 Troubleshooting

### Common Issues

**1. "Insufficient funds" error**
```bash
# Check ETH balance on Sepolia
```

**2. "Nonce too high" error**
```bash
# Reset account in MetaMask
# Settings > Advanced > Reset Account
```

**3. RPC connection error**
```bash
# Check if the Infura URL is correct
curl -X POST -H "Content-Type: application/json" \
--data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
https://sepolia.infura.io/v3/YOUR_PROJECT_ID
```

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/josiasdev/ChainMed_Chan_Link/issues)

**ChainMed** - Revolutionizing healthcare with blockchain 🏥⛓️