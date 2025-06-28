export async function gerarHashSHA256(dados: any): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(JSON.stringify(dados))
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export function gerarHashUsuario(cpf: string, email: string): Promise<string> {
  return gerarHashSHA256({ cpf, email, timestamp: Date.now() })
}

export function gerarHashDPS(dadosUsuario: any, respostas: any): Promise<string> {
  return gerarHashSHA256({
    usuario: dadosUsuario,
    respostas,
    timestamp: new Date().toISOString(),
  })
}
