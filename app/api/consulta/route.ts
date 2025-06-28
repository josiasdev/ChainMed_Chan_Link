import { type NextRequest, NextResponse } from "next/server"

// Simplified test data structure
const testUsers = {
  // Hash lookup
  a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456: {
    nome: "João Silva Santos",
    cpf: "12345678901",
    email: "joao@email.com",
    dataNascimento: "1985-03-15",
    endereco: "0x742d35Cc6634C0532925a3b8D4C9db96590c6C87",
    dps: [
      {
        id: 1,
        hash: "dps_abc123def456",
        dataPreenchimento: "2024-01-15",
        respostasPositivas: [
          {
            pergunta: "Você é portador(a) de hipertensão arterial?",
            resposta: "Sim",
            detalhes: "Hipertensão controlada com medicamento",
          },
        ],
      },
    ],
  },
  b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567a: {
    nome: "Maria Silva Santos",
    cpf: "98765432100",
    email: "maria@email.com",
    dataNascimento: "1990-07-22",
    endereco: "0x8ba1f109551bD432803012645Hac136c30C85Bb1",
    dps: [
      {
        id: 2,
        hash: "dps_def456ghi789",
        dataPreenchimento: "2024-01-15",
        respostasPositivas: [
          {
            pergunta: "Está grávida atualmente ou nos últimos 12 meses?",
            resposta: "Sim",
            detalhes: "Grávida de 6 meses",
          },
        ],
      },
    ],
  },
}

// CPF to Hash mapping
const cpfToHash: Record<string, string> = {
  "12345678901": "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
  "98765432100": "b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567a",
}

// Valid API keys
const validApiKeys = ["sk_test_1234567890abcdef", "sk_test_abcdef1234567890", "sk_test_fedcba0987654321"]

export async function GET(request: NextRequest) {
  try {
    console.log("API called - starting processing")

    // Get parameters
    const { searchParams } = new URL(request.url)
    const hash = searchParams.get("hash")
    const cpf = searchParams.get("cpf")
    const apiKey = request.headers.get("x-api-key")

    console.log("Parameters:", { hash: hash?.substring(0, 10) + "...", cpf, apiKey: apiKey?.substring(0, 10) + "..." })

    // Validate API key
    if (!apiKey) {
      console.log("Missing API key")
      return NextResponse.json({ error: "API Key é obrigatória", code: "MISSING_API_KEY" }, { status: 401 })
    }

    if (!validApiKeys.includes(apiKey)) {
      console.log("Invalid API key:", apiKey)
      return NextResponse.json({ error: "API Key inválida", code: "INVALID_API_KEY" }, { status: 401 })
    }

    // Validate search parameters
    if (!hash && !cpf) {
      console.log("Missing search parameters")
      return NextResponse.json({ error: "Hash ou CPF é obrigatório", code: "MISSING_PARAMETERS" }, { status: 400 })
    }

    // Find user data
    let userData = null
    let searchType = ""
    let searchValue = ""

    if (hash) {
      console.log("Searching by hash:", hash.substring(0, 10) + "...")
      searchType = "hash"
      searchValue = hash
      userData = testUsers[hash as keyof typeof testUsers]
    } else if (cpf) {
      console.log("Searching by CPF:", cpf)
      searchType = "cpf"
      searchValue = cpf
      const userHash = cpfToHash[cpf]
      if (userHash) {
        userData = testUsers[userHash as keyof typeof testUsers]
      }
    }

    if (!userData) {
      console.log("User not found")
      return NextResponse.json(
        {
          error: "Usuário não encontrado",
          code: "USER_NOT_FOUND",
          searchType,
          searchValue,
        },
        { status: 404 },
      )
    }

    console.log("User found:", userData.nome)

    // Prepare safe response (mask sensitive data)
    const safeUser = {
      nome: userData.nome,
      cpf: userData.cpf.replace(/(\d{3})\d{5}(\d{3})/, "$1.***.***-$2"),
      email: userData.email.replace(/(.{2}).*@/, "$1***@"),
      dataNascimento: userData.dataNascimento,
      endereco: userData.endereco,
    }

    // Calculate statistics
    const totalDPS = userData.dps?.length || 0
    const totalRespostasPositivas =
      userData.dps?.reduce((acc, dps) => acc + (dps.respostasPositivas?.length || 0), 0) || 0

    // Fraud detection
    const riskLevel = totalDPS > 5 ? "ALTO" : totalDPS > 3 ? "MÉDIO" : "BAIXO"
    const possibleFraud = totalDPS > 3

    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      searchType,
      searchValue,
      data: {
        usuario: safeUser,
        dps: userData.dps || [],
        estatisticas: {
          totalDPS,
          totalRespostasPositivas,
          primeiraData: userData.dps?.[0]?.dataPreenchimento || null,
          ultimaData: userData.dps?.[userData.dps.length - 1]?.dataPreenchimento || null,
        },
        alertas: {
          possibleFraude: possibleFraud,
          motivo: possibleFraud ? "Múltiplas DPS detectadas" : null,
          risco: riskLevel,
        },
        blockchain: {
          enderecoUsuario: userData.endereco,
          rede: "Sepolia Testnet",
        },
      },
    }

    console.log("Sending successful response")
    return NextResponse.json(response)
  } catch (error) {
    console.error("API Error:", error)

    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        code: "INTERNAL_ERROR",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// Health check endpoint
export async function POST() {
  try {
    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      message: "ChainMed API is running",
    })
  } catch (error) {
    return NextResponse.json({ error: "Health check failed" }, { status: 500 })
  }
}
