# 🚀 Deploying ChainMed DPS on the Sepolia Network

This guide explains how to deploy the ChainMedDPS smart contract on the Sepolia test network.

## 📋 Prerequisites

1. **Node.js** (version 16 or higher)
2. **MetaMask** installed in the browser
3. **Test ETH** on the Sepolia network
4. **Infura account** or **Alchemy** for RPC
5. **Etherscan API Key** (optional, for verification)

## 🔧 Initial Configuration

### 1. Install Dependencies

```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install @openzeppelin/contracts ethers dotenv
```

### 2. Configure Environment Variables

Copy the `.env.example` file to `.env` and fill in:

```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID
PRIVATE_KEY=your_private_key_here
ETHERSCAN_API_KEY=your_etherscan_api_key
```

⚠️ **IMPORTANT**: Never share your private key!

### 3. Get Test ETH

Visit one of Sepolia's faucets:
- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
- [Infura Sepolia Faucet](https://www.infura.io/faucet)

You will need at least **0.05 ETH** for deployment.

## 🚀 Contract Deployment

### 1. Compile the Contract

```bash
npx hardhat compile
```

### 2. Deploy

```bash
npx hardhat run scripts/deploy-sepolia.js --network sepolia
```

### 3. Verify on Etherscan (Optional)

```bash
npx hardhat verify --network sepolia CONTRACT_ADDRESS
```

## 📝 After Deployment

### 1. Save Information

After successful deployment, you will receive:
- **Contract Address**
- **Transaction Hash**
- **Etherscan Link**

### 2. Configure Frontend

Update the `.env` file with the address of the contract:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/SEU_PROJECT_ID
```

### 3. Authorize Insurance Companies

Use the `autorizarSeguradora()` function to authorize insurance companies:

```javascript
await contract.autorizarSeguradora(
"0x...", // insurance company address
"Insurance Company Name",
"12345678000195" // CNPJ
); ```

## 🧪 Testing the Contract

### 1. Register Test User

```javascript
await contract.registerUser(
"João Silva",
"hash_usuario_teste_123"
);
```

### 2. Register Test DPS

```javascript
await contract.registerDPS(
"hash_dps_teste_456",
"data_encrypted_test",
[] // without relatives
);
```

### 3. Query DPS

```javascript
const dpsIds = await contract.consultarDPSPorHash("hash_usuario_teste_123");
console.log("DPS found:", dpsIds); ```

## 🔍 Verification and Monitoring

### 1. Etherscan

Access: `https://sepolia.etherscan.io/address/YOUR_CONTRACT_ENDEREC`

### 2. Contract Events

Monitor the events:
- `RegisteredUser`
- `RegisteredDPS`
- `RequestPerformed`

### 3. Statistics

```javascript
const stats = await contract.obterEstatisticas();
console.log("Total DPS:", stats.totalDPS.toString());
console.log("Total Users:", stats.totalUsuarios.toString()); ```

## 🛠️ Useful Commands

```bash
# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy local
npx hardhat run scripts/deploy-sepolia.js --network localhost

# Deploy Sepolia
npx hardhat run scripts/deploy-sepolia.js --network sepolia

# Verify contract
npx hardhat verify --network sepolia CONTRACT_ENDERECO

# Interactive console
npx hardhat console --network sepolia
```

## 🚨 Troubleshooting

### Error: "insufficient funds"
- Check if you have enough ETH in your wallet
- Get more test ETH from faucets

### Error: "nonce too high"
- Reset your MetaMask account: Settings > Advanced > Reset Account

### Error: "network not supported"
- Check if the Sepolia network is configured correctly
- Confirm the Chain ID (11155111)

### Error: "contract not verified"
- Run the verification command on Etherscan
- Wait a few minutes after deploying

## 📚 Additional Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [Ethers.js Documentation](https://docs.ethers.io/)
- [Sepolia Testnet Info](https://sepolia.dev/)

## 🔐 Security

- ✅ Always use testnets first
- ✅ Keep private keys safe
- ✅ Audit code before mainnet
- ✅ Use multisig for production contracts
- ✅ Implement rate limiting in APIs

## 📞 Support

In case of problems:
1. Check the Hardhat logs
2. Consult the official documentation
3. Check the status of the Sepolia network
4. Contact technical support

That's it! Now you have:

## ✅ **Complete Implementations**

### 🆕 **Registration Page**
- Complete form for users and insurers
- Password validation and terms of use
- Automatic generation of unique hash and API keys
- Responsive and intuitive interface

### 🔗 **Smart Contract Sepolia**
- Complete contract with all DPS functionalities
- Optimized for Sepolia network (testnet)
- Events for monitoring
- Security and authorization functions

### 🛠️ **Deployment Infrastructure**
- Automated deployment scripts
- Hardhat configuration for Sepolia
- Web3 integration on the frontend
- Complete deployment documentation

### 🔐 **Security Features**
- Role-based access control
- On-chain data validation
- Reentrancy protection
- Transaction auditing