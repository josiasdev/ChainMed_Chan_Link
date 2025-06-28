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

export interface Usuario {
  endereco: string
  hash: string
  nome: string
  cpf: string
  email: string
  dataNascimento: string
  ativo: boolean
}

export interface ParticipanteDPS {
  nome: string
  cpf: string
  dataNascimento: string
  hash?: string
  endereco?: string
  jaExistia: boolean
}

export class Web3AuthService {
  private provider: any = null
  private signer: any = null
  private enderecoConectado = ""
  private ethers: any = null

  constructor() {
    // Initialize ethers only on client side
    if (typeof window !== "undefined") {
      this.initializeEthers()
    }
  }

  private async initializeEthers() {
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        // Dynamic import to avoid SSR issues
        const ethersLib = await import("ethers")
        this.ethers = ethersLib.ethers
        this.provider = new this.ethers.providers.Web3Provider(window.ethereum)
      }
    } catch (error) {
      console.warn("Failed to initialize ethers:", error)
    }
  }

  async conectarCarteira(): Promise<string> {
    if (!this.ethers) {
      await this.initializeEthers()
    }

    if (!this.provider) {
      throw new Error("MetaMask não encontrado! Por favor, instale a extensão MetaMask.")
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
      this.enderecoConectado = await this.signer.getAddress()

      return this.enderecoConectado
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

  async verificarUsuarioExiste(cpf: string, dataNascimento: string): Promise<{ existe: boolean; hash?: string }> {
    // Simular verificação na blockchain
    const { gerarHashUsuario } = await import("./crypto")
    const hashGerado = await gerarHashUsuario(cpf, dataNascimento)

    // Dados simulados de usuários existentes
    const usuariosExistentes = [
      {
        cpf: "12345678901",
        dataNascimento: "1985-03-15",
        hash: "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
      },
      {
        cpf: "98765432109",
        dataNascimento: "1990-07-22",
        hash: "b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567a",
      },
    ]

    const usuarioExistente = usuariosExistentes.find((u) => u.cpf === cpf && u.dataNascimento === dataNascimento)

    if (usuarioExistente) {
      return { existe: true, hash: usuarioExistente.hash }
    }

    return { existe: false, hash: hashGerado }
  }

  async cadastrarUsuario(dadosUsuario: {
    nome: string
    cpf: string
    email: string
    dataNascimento: string
  }): Promise<string> {
    if (!this.enderecoConectado) {
      throw new Error("Carteira não conectada")
    }

    // Gerar hash único
    const { gerarHashUsuario } = await import("./crypto")
    const hash = await gerarHashUsuario(dadosUsuario.cpf, dadosUsuario.dataNascimento)

    // Simular cadastro na blockchain
    console.log("Cadastrando usuário na blockchain:", {
      endereco: this.enderecoConectado,
      hash,
      ...dadosUsuario,
    })

    // Simular delay da transação
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return hash
  }

  async processarParticipantesDPS(participantes: ParticipanteDPS[]): Promise<ParticipanteDPS[]> {
    const participantesProcessados: ParticipanteDPS[] = []

    for (const participante of participantes) {
      try {
        const verificacao = await this.verificarUsuarioExiste(participante.cpf, participante.dataNascimento)

        if (verificacao.existe) {
          // Usuário já existe
          participantesProcessados.push({
            ...participante,
            hash: verificacao.hash,
            jaExistia: true,
          })
        } else {
          // Novo usuário - gerar novo hash
          const novoHash = verificacao.hash!

          // Simular cadastro automático na blockchain
          console.log("Cadastrando novo participante:", {
            nome: participante.nome,
            cpf: participante.cpf,
            hash: novoHash,
          })

          participantesProcessados.push({
            ...participante,
            hash: novoHash,
            jaExistia: false,
          })
        }
      } catch (error) {
        console.error("Erro ao processar participante:", participante.nome, error)
        // Continue with a generated hash even if there's an error
        const { gerarHashUsuario } = await import("./crypto")
        const fallbackHash = await gerarHashUsuario(participante.cpf, participante.dataNascimento)

        participantesProcessados.push({
          ...participante,
          hash: fallbackHash,
          jaExistia: false,
        })
      }
    }

    return participantesProcessados
  }

  async obterHistoricoDPS(): Promise<any[]> {
    // Simular busca do histórico na blockchain
    const historico = [
      {
        id: 1,
        hash: "dps_abc123def456",
        dataPreenchimento: "2024-01-15",
        participantes: ["João Silva Santos"],
        respostasPositivas: 2,
        status: "ativa",
      },
      {
        id: 2,
        hash: "dps_def789ghi012",
        dataPreenchimento: "2024-06-20",
        participantes: ["João Silva Santos", "Maria Silva Santos", "Pedro Silva Santos"],
        respostasPositivas: 3,
        status: "ativa",
      },
    ]

    return historico
  }

  async enviarHashPorEmail(email: string, hashes: { nome: string; hash: string }[]): Promise<void> {
    // Simular envio de email
    console.log("Enviando hashes por email para:", email)
    console.log("Hashes:", hashes)

    // Em produção, aqui seria feita a integração com serviço de email
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  getEnderecoConectado(): string {
    return this.enderecoConectado
  }

  async desconectar(): Promise<void> {
    this.signer = null
    this.enderecoConectado = ""
  }
}

export const web3AuthService = new Web3AuthService()
