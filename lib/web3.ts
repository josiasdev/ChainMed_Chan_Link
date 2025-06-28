import { ethers } from "ethers"

// ABI do contrato ChainMedDPS (versão simplificada)
export const CHAINMED_ABI = [
  "function cadastrarUsuario(string memory _nome, string memory _hashUsuario) external",
  "function registrarDPS(string memory _hashDPS, string memory _dadosCriptografados, address[] memory _familiares) external",
  "function consultarDPSPorHash(string memory _hashUsuario) external returns (uint256[] memory)",
  "function obterDPS(uint256 _dpsId) external view returns (uint256, address, string, string, string, uint256, bool, address[])",
  "function obterUsuario(address _endereco) external view returns (string, string, bool, uint256, uint256[])",
  "function usuarioExiste(string memory _hashUsuario) external view returns (bool)",
  "function totalDPSUsuario(string memory _hashUsuario) external view returns (uint256)",
  "event DPSRegistrada(uint256 indexed dpsId, address indexed usuario, string hashUsuario, string hashDPS, uint256 timestamp)",
  "event UsuarioCadastrado(address indexed usuario, string hashUsuario, string nome, uint256 timestamp)",
]

// Configurações da rede Sepolia
export const SEPOLIA_CONFIG = {
  chainId: 11155111,
  chainName: "Sepolia Test Network",
  nativeCurrency: {
    name: "Sepolia ETH",
    symbol: "SEP",
    decimals: 18,
  },
  rpcUrls: ["https://sepolia.infura.io/v3/"],
  blockExplorerUrls: ["https://sepolia.etherscan.io/"],
}

// Endereço do contrato (será preenchido após o deploy)
export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || ""

export class Web3Service {
  private provider: ethers.providers.Web3Provider | null = null
  private signer: ethers.Signer | null = null
  private contract: ethers.Contract | null = null

  constructor() {
    if (typeof window !== "undefined" && window.ethereum) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum)
    }
  }

  async conectarCarteira(): Promise<string> {
    if (!this.provider) {
      throw new Error("MetaMask não encontrado!")
    }

    try {
      // Solicitar conexão
      await window.ethereum.request({ method: "eth_requestAccounts" })

      // Verificar se está na rede Sepolia
      const network = await this.provider.getNetwork()
      if (network.chainId !== SEPOLIA_CONFIG.chainId) {
        await this.trocarParaSepolia()
      }

      this.signer = this.provider.getSigner()
      const endereco = await this.signer.getAddress()

      // Inicializar contrato
      this.contract = new ethers.Contract(CONTRACT_ADDRESS, CHAINMED_ABI, this.signer)

      return endereco
    } catch (error) {
      console.error("Erro ao conectar carteira:", error)
      throw error
    }
  }

  async trocarParaSepolia(): Promise<void> {
    if (!window.ethereum) return

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${SEPOLIA_CONFIG.chainId.toString(16)}` }],
      })
    } catch (switchError: any) {
      // Se a rede não existe, adicionar
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: `0x${SEPOLIA_CONFIG.chainId.toString(16)}`,
              chainName: SEPOLIA_CONFIG.chainName,
              nativeCurrency: SEPOLIA_CONFIG.nativeCurrency,
              rpcUrls: SEPOLIA_CONFIG.rpcUrls,
              blockExplorerUrls: SEPOLIA_CONFIG.blockExplorerUrls,
            },
          ],
        })
      } else {
        throw switchError
      }
    }
  }

  async cadastrarUsuario(nome: string, hashUsuario: string): Promise<string> {
    if (!this.contract) {
      throw new Error("Contrato não inicializado")
    }

    try {
      const tx = await this.contract.cadastrarUsuario(nome, hashUsuario)
      await tx.wait()
      return tx.hash
    } catch (error) {
      console.error("Erro ao cadastrar usuário:", error)
      throw error
    }
  }

  async registrarDPS(hashDPS: string, dadosCriptografados: string, familiares: string[] = []): Promise<string> {
    if (!this.contract) {
      throw new Error("Contrato não inicializado")
    }

    try {
      const tx = await this.contract.registrarDPS(hashDPS, dadosCriptografados, familiares)
      await tx.wait()
      return tx.hash
    } catch (error) {
      console.error("Erro ao registrar DPS:", error)
      throw error
    }
  }

  async consultarDPSPorHash(hashUsuario: string): Promise<number[]> {
    if (!this.contract) {
      throw new Error("Contrato não inicializado")
    }

    try {
      const dpsIds = await this.contract.consultarDPSPorHash(hashUsuario)
      return dpsIds.map((id: ethers.BigNumber) => id.toNumber())
    } catch (error) {
      console.error("Erro ao consultar DPS:", error)
      throw error
    }
  }

  async obterDPS(dpsId: number) {
    if (!this.contract) {
      throw new Error("Contrato não inicializado")
    }

    try {
      const resultado = await this.contract.obterDPS(dpsId)
      return {
        id: resultado[0].toNumber(),
        usuario: resultado[1],
        hashUsuario: resultado[2],
        hashDPS: resultado[3],
        dadosCriptografados: resultado[4],
        timestamp: resultado[5].toNumber(),
        ativa: resultado[6],
        familiares: resultado[7],
      }
    } catch (error) {
      console.error("Erro ao obter DPS:", error)
      throw error
    }
  }

  async usuarioExiste(hashUsuario: string): Promise<boolean> {
    if (!this.contract) {
      throw new Error("Contrato não inicializado")
    }

    try {
      return await this.contract.usuarioExiste(hashUsuario)
    } catch (error) {
      console.error("Erro ao verificar usuário:", error)
      throw error
    }
  }

  async obterEndereco(): Promise<string> {
    if (!this.signer) {
      throw new Error("Carteira não conectada")
    }
    return await this.signer.getAddress()
  }

  async obterSaldo(): Promise<string> {
    if (!this.provider || !this.signer) {
      throw new Error("Carteira não conectada")
    }

    const endereco = await this.signer.getAddress()
    const saldo = await this.provider.getBalance(endereco)
    return ethers.utils.formatEther(saldo)
  }
}

// Instância global do serviço Web3
export const web3Service = new Web3Service()
