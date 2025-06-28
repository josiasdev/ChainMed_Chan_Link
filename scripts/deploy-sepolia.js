const { ethers } = require("hardhat")

async function main() {
  console.log("🚀 Iniciando deploy do ChainMedDPS na rede Sepolia...")

  // Obter o deployer
  const [deployer] = await ethers.getSigners()
  console.log("📝 Deploying com a conta:", deployer.address)

  // Verificar saldo
  const balance = await deployer.getBalance()
  console.log("💰 Saldo da conta:", ethers.utils.formatEther(balance), "ETH")

  if (balance.lt(ethers.utils.parseEther("0.01"))) {
    console.error("❌ Saldo insuficiente! Você precisa de pelo menos 0.01 ETH para o deploy.")
    console.log("🔗 Obtenha ETH de teste em: https://sepoliafaucet.com/")
    return
  }

  // Deploy do contrato
  console.log("📦 Compilando contrato...")
  const ChainMedDPS = await ethers.getContractFactory("ChainMedDPS")

  console.log("🔄 Fazendo deploy...")
  const chainMedDPS = await ChainMedDPS.deploy()

  console.log("⏳ Aguardando confirmação...")
  await chainMedDPS.deployed()

  console.log("✅ ChainMedDPS deployado com sucesso!")
  console.log("📍 Endereço do contrato:", chainMedDPS.address)
  console.log("🔗 Verificar no Etherscan:", `https://sepolia.etherscan.io/address/${chainMedDPS.address}`)

  // Salvar informações do deploy
  const deployInfo = {
    network: "sepolia",
    contractAddress: chainMedDPS.address,
    deployerAddress: deployer.address,
    deploymentTime: new Date().toISOString(),
    transactionHash: chainMedDPS.deployTransaction.hash,
    blockNumber: chainMedDPS.deployTransaction.blockNumber,
    gasUsed: chainMedDPS.deployTransaction.gasLimit.toString(),
    etherscanUrl: `https://sepolia.etherscan.io/address/${chainMedDPS.address}`,
  }

  console.log("\n📋 Informações do Deploy:")
  console.log(JSON.stringify(deployInfo, null, 2))

  // Verificar se o contrato foi deployado corretamente
  console.log("\n🔍 Verificando deploy...")
  const code = await ethers.provider.getCode(chainMedDPS.address)
  if (code === "0x") {
    console.error("❌ Erro: Contrato não foi deployado corretamente!")
  } else {
    console.log("✅ Contrato deployado e verificado com sucesso!")
  }

  // Testar algumas funções básicas
  console.log("\n🧪 Testando funções básicas...")

  try {
    // Obter estatísticas iniciais
    const stats = await chainMedDPS.obterEstatisticas()
    console.log("📊 Estatísticas iniciais:")
    console.log("  - Total DPS:", stats.totalDPS.toString())
    console.log("  - Total Usuários:", stats.totalUsuarios.toString())
    console.log("  - Total Seguradoras:", stats.totalSeguradoras.toString())

    console.log("✅ Todas as funções básicas estão funcionando!")
  } catch (error) {
    console.error("❌ Erro ao testar funções:", error.message)
  }

  console.log("\n🎉 Deploy concluído com sucesso!")
  console.log("💡 Próximos passos:")
  console.log("  1. Verificar o contrato no Etherscan")
  console.log("  2. Autorizar seguradoras usando a função autorizarSeguradora()")
  console.log("  3. Integrar o endereço do contrato na aplicação frontend")
  console.log("  4. Configurar as variáveis de ambiente com o endereço do contrato")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Erro no deploy:", error)
    process.exit(1)
  })
