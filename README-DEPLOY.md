# 🚀 Deploy do ChainMed DPS na Rede Sepolia

Este guia explica como fazer o deploy do smart contract ChainMedDPS na rede de teste Sepolia.

## 📋 Pré-requisitos

1. **Node.js** (versão 16 ou superior)
2. **MetaMask** instalado no navegador
3. **ETH de teste** na rede Sepolia
4. **Conta Infura** ou **Alchemy** para RPC
5. **API Key do Etherscan** (opcional, para verificação)

## 🔧 Configuração Inicial

### 1. Instalar Dependências

```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install @openzeppelin/contracts ethers dotenv
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e preencha:

```env
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/SEU_PROJECT_ID
PRIVATE_KEY=sua_chave_privada_aqui
ETHERSCAN_API_KEY=sua_api_key_etherscan
```

⚠️ **IMPORTANTE**: Nunca compartilhe sua chave privada!

### 3. Obter ETH de Teste

Visite um dos faucets da Sepolia:
- [Sepolia Faucet](https://sepoliafaucet.com/)
- [Alchemy Sepolia Faucet](https://sepoliafaucet.com/)
- [Infura Sepolia Faucet](https://www.infura.io/faucet)

Você precisará de pelo menos **0.05 ETH** para o deploy.

## 🚀 Deploy do Contrato

### 1. Compilar o Contrato

```bash
npx hardhat compile
```

### 2. Fazer o Deploy

```bash
npx hardhat run scripts/deploy-sepolia.js --network sepolia
```

### 3. Verificar no Etherscan (Opcional)

```bash
npx hardhat verify --network sepolia ENDERECO_DO_CONTRATO
```

## 📝 Após o Deploy

### 1. Salvar Informações

Após o deploy bem-sucedido, você receberá:
- **Endereço do contrato**
- **Hash da transação**
- **Link do Etherscan**

### 2. Configurar Frontend

Atualize o arquivo `.env` com o endereço do contrato:

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_RPC_URL=https://sepolia.infura.io/v3/SEU_PROJECT_ID
```

### 3. Autorizar Seguradoras

Use a função `autorizarSeguradora()` para autorizar seguradoras:

```javascript
await contract.autorizarSeguradora(
  "0x...", // endereço da seguradora
  "Nome da Seguradora",
  "12345678000195" // CNPJ
);
```

## 🧪 Testando o Contrato

### 1. Cadastrar Usuário de Teste

```javascript
await contract.cadastrarUsuario(
  "João Silva",
  "hash_usuario_teste_123"
);
```

### 2. Registrar DPS de Teste

```javascript
await contract.registrarDPS(
  "hash_dps_teste_456",
  "dados_criptografados_teste",
  [] // sem familiares
);
```

### 3. Consultar DPS

```javascript
const dpsIds = await contract.consultarDPSPorHash("hash_usuario_teste_123");
console.log("DPS encontradas:", dpsIds);
```

## 🔍 Verificação e Monitoramento

### 1. Etherscan

Acesse: `https://sepolia.etherscan.io/address/SEU_ENDERECO_CONTRATO`

### 2. Eventos do Contrato

Monitore os eventos:
- `UsuarioCadastrado`
- `DPSRegistrada`
- `ConsultaRealizada`

### 3. Estatísticas

```javascript
const stats = await contract.obterEstatisticas();
console.log("Total DPS:", stats.totalDPS.toString());
console.log("Total Usuários:", stats.totalUsuarios.toString());
```

## 🛠️ Comandos Úteis

```bash
# Compilar contratos
npx hardhat compile

# Executar testes
npx hardhat test

# Deploy local
npx hardhat run scripts/deploy-sepolia.js --network localhost

# Deploy Sepolia
npx hardhat run scripts/deploy-sepolia.js --network sepolia

# Verificar contrato
npx hardhat verify --network sepolia ENDERECO_CONTRATO

# Console interativo
npx hardhat console --network sepolia
```

## 🚨 Troubleshooting

### Erro: "insufficient funds"
- Verifique se tem ETH suficiente na carteira
- Obtenha mais ETH de teste nos faucets

### Erro: "nonce too high"
- Reset da conta no MetaMask: Settings > Advanced > Reset Account

### Erro: "network not supported"
- Verifique se a rede Sepolia está configurada corretamente
- Confirme o Chain ID (11155111)

### Erro: "contract not verified"
- Execute o comando de verificação no Etherscan
- Aguarde alguns minutos após o deploy

## 📚 Recursos Adicionais

- [Documentação Hardhat](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [Ethers.js Documentation](https://docs.ethers.io/)
- [Sepolia Testnet Info](https://sepolia.dev/)

## 🔐 Segurança

- ✅ Use sempre redes de teste primeiro
- ✅ Mantenha chaves privadas seguras
- ✅ Faça auditoria do código antes do mainnet
- ✅ Use multisig para contratos de produção
- ✅ Implemente rate limiting nas APIs

## 📞 Suporte

Em caso de problemas:
1. Verifique os logs do Hardhat
2. Consulte a documentação oficial
3. Verifique o status da rede Sepolia
4. Entre em contato com o suporte técnico

Pronto! Agora você tem:

## ✅ **Implementações Completas**

### 🆕 **Página de Cadastro**
- Formulário completo para usuários e seguradoras
- Validação de senhas e termos de uso
- Geração automática de hash único e API keys
- Interface responsiva e intuitiva

### 🔗 **Smart Contract Sepolia**
- Contrato completo com todas as funcionalidades DPS
- Otimizado para rede Sepolia (testnet)
- Eventos para monitoramento
- Funções de segurança e autorização

### 🛠️ **Infraestrutura de Deploy**
- Scripts automatizados de deploy
- Configuração Hardhat para Sepolia
- Integração Web3 no frontend
- Documentação completa de deploy

### 🔐 **Recursos de Segurança**
- Controle de acesso por roles
- Validação de dados on-chain
- Proteção contra reentrancy
- Auditoria de transações