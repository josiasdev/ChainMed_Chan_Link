# 🏥 ChainMed - Portal DPS Blockchain

Sistema anti-fraude para Declarações Pessoais de Saúde (DPS) usando blockchain Ethereum Sepolia.

## 🌟 Características

- ✅ **Sistema Anti-Fraude** - Previne declarações duplicadas e omissões
- ✅ **Blockchain Sepolia** - Dados imutáveis e verificáveis
- ✅ **Multilíngue** - Português e Inglês
- ✅ **MetaMask Integration** - Autenticação via carteira
- ✅ **API REST** - Consultas para seguradoras
- ✅ **Gestão Familiar** - DPS para múltiplos participantes

## 🚀 Tecnologias

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Blockchain**: Solidity, Hardhat, Ethers.js
- **Database**: PostgreSQL
- **Authentication**: MetaMask Web3
- **Deployment**: Vercel, Sepolia Testnet

## 📋 Pré-requisitos

1. **Node.js** (versão 18 ou superior)
2. **MetaMask** instalado no navegador
3. **PostgreSQL** (local ou cloud)
4. **ETH de teste** na rede Sepolia
5. **Conta Infura** ou **Alchemy** para RPC

## 🔧 Instalação

### 1. Clone o Repositório

```bash
git clone https://github.com/josiasdev/ChainMed_Chan_Link
cd ChainMed_Chan_Link
```

### 2. Instale as Dependências

```bash
npm install
```

### 3. Configure as Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Preencha as variáveis:

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

### 4. Configure o Banco de Dados

Execute os scripts SQL na ordem:

```bash
# 1. Criar tabelas
psql -d chainmed -f scripts/01-create-tables.sql

# 2. Inserir dados de teste
psql -d chainmed -f scripts/02-seed-data.sql
```

### 5. Compile e Deploy o Smart Contract

```bash
# Compilar contratos
npx hardhat compile

# Deploy na rede Sepolia
npx hardhat run scripts/deploy-sepolia.js --network sepolia

# Verificar no Etherscan (opcional)
npx hardhat verify --network sepolia ENDERECO_DO_CONTRATO
```

### 6. Execute a Aplicação

```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

## 📁 Estrutura de Scripts

### Scripts SQL (2 arquivos)
- `scripts/01-create-tables.sql` - Criação das tabelas e índices
- `scripts/02-seed-data.sql` - Dados de teste e exemplos

### Smart Contract (1 arquivo)
- `contracts/ChainMedDPS.sol` - Contrato principal otimizado

### Scripts de Deploy
- `scripts/deploy-sepolia.js` - Deploy automatizado na Sepolia
- `hardhat.config.js` - Configuração do Hardhat

## 🌐 Configuração da Rede Sepolia

### 1. Obter ETH de Teste

Visite um dos faucets:
- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Alchemy Faucet](https://sepoliafaucet.com/)
- [Infura Faucet](https://www.infura.io/faucet)

### 2. Configurar MetaMask

Adicione a rede Sepolia no MetaMask:

- **Nome da Rede**: Sepolia Test Network
- **RPC URL**: https://sepolia.infura.io/v3/SEU_PROJECT_ID
- **Chain ID**: 11155111
- **Símbolo**: SEP
- **Block Explorer**: https://sepolia.etherscan.io/

## 📚 Estrutura do Projeto

```
ChainMed_Chan_Link/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── cadastro/          # Página de cadastro
│   ├── dashboard/         # Dashboard do usuário
│   ├── dps/              # Páginas de DPS
│   ├── login/            # Página de login
│   └── seguradora/       # Dashboard da seguradora
├── components/            # Componentes React
│   ├── ui/               # Componentes shadcn/ui
│   └── language-switcher.tsx
├── contracts/            # Smart Contract (1 arquivo)
│   └── ChainMedDPS.sol   # Contrato principal
├── lib/                  # Utilitários
│   ├── crypto.ts         # Funções de hash
│   ├── i18n.ts          # Internacionalização
│   ├── language-context.tsx
│   └── web3.ts          # Integração Web3
├── scripts/              # Scripts SQL e Deploy (3 arquivos)
│   ├── 01-create-tables.sql  # Schema do banco
│   ├── 02-seed-data.sql      # Dados de teste
│   └── deploy-sepolia.js     # Deploy do contrato
└── hardhat.config.js     # Configuração Hardhat
```

## 🧪 Dados de Teste

**Usuários de Exemplo:**
- **João Silva Santos**
  - Hash: `a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456`
  - CPF: `12345678901`

- **Maria Silva Santos**
  - Hash: `b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567a`
  - CPF: `98765432109`

**API Keys de Teste:**
- `sk_test_1234567890abcdef`
- `sk_test_abcdef1234567890`
- `sk_test_fedcba0987654321`

## 🌍 Internacionalização

O sistema suporta português e inglês. Para trocar idioma:

```typescript
const { setLanguage } = useLanguage()
setLanguage('en') // Inglês
setLanguage('pt') // Português
```

## 🚀 Deploy em Produção

### 1. Vercel (Frontend)

```bash
npx vercel --prod
```

### 2. Mainnet Ethereum

⚠️ **Atenção**: Deploy na mainnet requer ETH real e auditoria de segurança.

```bash
# Deploy na mainnet (CUIDADO!)
npx hardhat run scripts/deploy-sepolia.js --network mainnet
```

## 🔧 Troubleshooting

### Problemas Comuns

**1. Erro "insufficient funds"**
```bash
# Verifique saldo ETH na Sepolia
```

**2. Erro "nonce too high"**
```bash
# Reset da conta no MetaMask
# Settings > Advanced > Reset Account
```

**3. Erro de conexão RPC**
```bash
# Verifique se a URL do Infura está correta
curl -X POST -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
  https://sepolia.infura.io/v3/SEU_PROJECT_ID
```

## 📞 Suporte

- **Issues**: [GitHub Issues](https://github.com/josiasdev/ChainMed_Chan_Link/issues)


**ChainMed** - Revolucionando a saúde com blockchain 🏥⛓️
