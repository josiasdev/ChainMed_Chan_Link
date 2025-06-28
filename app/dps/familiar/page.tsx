"use client"

import { useState } from "react"
import { Shield, ArrowLeft, Users, Plus, Trash2, Mail, AlertTriangle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { web3AuthService, type ParticipanteDPS } from "@/lib/web3-auth"

export default function DPSFamiliarPage() {
  const [participantes, setParticipantes] = useState<ParticipanteDPS[]>([
    { nome: "", cpf: "", dataNascimento: "", jaExistia: false },
  ])
  const [processando, setProcessando] = useState(false)
  const [participantesProcessados, setParticipantesProcessados] = useState<ParticipanteDPS[]>([])
  const [etapa, setEtapa] = useState<"cadastro" | "confirmacao" | "questionario">("cadastro")

  const adicionarParticipante = () => {
    setParticipantes([...participantes, { nome: "", cpf: "", dataNascimento: "", jaExistia: false }])
  }

  const removerParticipante = (index: number) => {
    if (participantes.length > 1) {
      setParticipantes(participantes.filter((_, i) => i !== index))
    }
  }

  const atualizarParticipante = (index: number, campo: keyof ParticipanteDPS, valor: string) => {
    const novosParticipantes = [...participantes]
    novosParticipantes[index] = { ...novosParticipantes[index], [campo]: valor }
    setParticipantes(novosParticipantes)
  }

  const validarParticipantes = (): boolean => {
    return participantes.every((p) => p.nome.trim() && p.cpf.trim() && p.dataNascimento.trim())
  }

  const processarParticipantes = async () => {
    if (!validarParticipantes()) {
      alert("Por favor, preencha todos os campos obrigatórios.")
      return
    }

    setProcessando(true)
    try {
      const processados = await web3AuthService.processarParticipantesDPS(participantes)
      setParticipantesProcessados(processados)
      setEtapa("confirmacao")
    } catch (error) {
      console.error("Erro ao processar participantes:", error)
      alert("Erro ao processar participantes. Tente novamente.")
    } finally {
      setProcessando(false)
    }
  }

  const confirmarEContinuar = async () => {
    // Enviar hashes dos novos usuários por email
    const novosUsuarios = participantesProcessados.filter((p) => !p.jaExistia)

    if (novosUsuarios.length > 0) {
      try {
        const endereco = web3AuthService.getEnderecoConectado()
        await web3AuthService.enviarHashPorEmail(
          "usuario@email.com", // Em produção, pegar do usuário logado
          novosUsuarios.map((u) => ({ nome: u.nome, hash: u.hash! })),
        )
      } catch (error) {
        console.error("Erro ao enviar email:", error)
      }
    }

    setEtapa("questionario")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">DPS Familiar</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Progresso</span>
            <span className="text-sm text-gray-600">
              {etapa === "cadastro" && "1/3"}
              {etapa === "confirmacao" && "2/3"}
              {etapa === "questionario" && "3/3"}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: etapa === "cadastro" ? "33%" : etapa === "confirmacao" ? "66%" : "100%",
              }}
            />
          </div>
        </div>

        {/* Etapa 1: Cadastro de Participantes */}
        {etapa === "cadastro" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Participantes da DPS
              </CardTitle>
              <CardDescription>
                Adicione os familiares que terão suas DPS preenchidas. Todos serão cadastrados automaticamente na
                blockchain.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {participantes.map((participante, index) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Participante {index + 1}</h4>
                    {participantes.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removerParticipante(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor={`nome-${index}`}>Nome Completo *</Label>
                      <Input
                        id={`nome-${index}`}
                        value={participante.nome}
                        onChange={(e) => atualizarParticipante(index, "nome", e.target.value)}
                        placeholder="Nome completo"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`cpf-${index}`}>CPF *</Label>
                      <Input
                        id={`cpf-${index}`}
                        value={participante.cpf}
                        onChange={(e) => atualizarParticipante(index, "cpf", e.target.value)}
                        placeholder="000.000.000-00"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`data-${index}`}>Data de Nascimento *</Label>
                      <Input
                        id={`data-${index}`}
                        type="date"
                        value={participante.dataNascimento}
                        onChange={(e) => atualizarParticipante(index, "dataNascimento", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}

              <Button variant="outline" onClick={adicionarParticipante} className="w-full border-dashed">
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Participante
              </Button>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Importante:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                      <li>Todos os participantes serão cadastrados automaticamente na blockchain</li>
                      <li>Se o usuário já existir (CPF + data nascimento), será usado o hash existente</li>
                      <li>Novos usuários receberão seus hashes por email</li>
                      <li>Você responderá o questionário para cada participante</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={processarParticipantes} disabled={!validarParticipantes() || processando}>
                  {processando ? "Processando..." : "Continuar"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Etapa 2: Confirmação */}
        {etapa === "confirmacao" && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Confirmação dos Participantes
              </CardTitle>
              <CardDescription>
                Verifique os participantes processados antes de continuar para o questionário
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {participantesProcessados.map((participante, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{participante.nome}</h4>
                      <Badge
                        variant={participante.jaExistia ? "secondary" : "default"}
                        className={participante.jaExistia ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}
                      >
                        {participante.jaExistia ? "Usuário Existente" : "Novo Usuário"}
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-gray-600">CPF</Label>
                        <p className="font-mono">{participante.cpf}</p>
                      </div>
                      <div>
                        <Label className="text-gray-600">Data de Nascimento</Label>
                        <p>{new Date(participante.dataNascimento).toLocaleDateString("pt-BR")}</p>
                      </div>
                      <div className="md:col-span-2">
                        <Label className="text-gray-600">Hash Blockchain</Label>
                        <p className="font-mono text-xs bg-gray-100 p-2 rounded">{participante.hash}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Novos usuários criados */}
              {participantesProcessados.some((p) => !p.jaExistia) && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Mail className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-green-800">
                      <p className="font-medium mb-1">Novos usuários cadastrados:</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        {participantesProcessados
                          .filter((p) => !p.jaExistia)
                          .map((p, i) => (
                            <li key={i}>{p.nome} - Hash enviado por email</li>
                          ))}
                      </ul>
                      <p className="text-xs mt-2 font-medium">
                        ⚠️ Importante: Informe aos novos usuários para não perderem seus endereços MetaMask!
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Separator />

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setEtapa("cadastro")}>
                  Voltar
                </Button>
                <Button onClick={confirmarEContinuar}>Continuar para Questionário</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Etapa 3: Questionário */}
        {etapa === "questionario" && (
          <Card>
            <CardHeader>
              <CardTitle>Questionário DPS</CardTitle>
              <CardDescription>Agora você responderá o questionário de saúde para cada participante</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">
                  Questionário para {participantesProcessados.length} participante(s)
                </h3>
                <p className="text-gray-500 mb-6">
                  Você responderá as 20 perguntas da DPS para cada participante cadastrado.
                </p>
                <Link href="/dps/questionario">
                  <Button size="lg">Iniciar Questionário</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
