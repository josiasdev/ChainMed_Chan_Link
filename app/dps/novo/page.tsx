"use client"

import { useState } from "react"
import { ArrowLeft, ArrowRight, Save, Users, Plus, Trash2, AlertTriangle, User } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { web3AuthService, type ParticipanteDPS } from "@/lib/web3-auth"
import { useLanguage } from "@/lib/language-context"

interface DPSFormData {
  // Dados pessoais do responsável
  nome: string
  cpf: string
  email: string
  telefone: string
  dataNascimento: string

  // Participantes adicionais
  participantes: ParticipanteDPS[]

  // Respostas do questionário (por participante)
  respostas: Record<string, Record<number, { resposta: string; detalhes?: string }>>
}

export default function NovaDPSPage() {
  const { t } = useLanguage()

  // Usar as perguntas traduzidas
  const perguntasDPS = t.dpsQuestions.questions.map((pergunta, index) => ({
    id: index + 1,
    pergunta,
    tipo: "radio" as const,
    opcoes: [t.common.yes, t.common.no, ...(index === 1 || index === 19 ? [t.common.notApplicable] : [])],
    temDetalhes: true,
    detalheLabel: t.dpsQuestions.detailsLabel[index],
  }))

  const [etapaAtual, setEtapaAtual] = useState(0)
  const [formData, setFormData] = useState<DPSFormData>({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    dataNascimento: "",
    participantes: [],
    respostas: {},
  })

  // Controle de qual DPS está sendo preenchida
  const [participanteAtual, setParticipanteAtual] = useState<number | null>(null)
  const [perguntaAtual, setPerguntaAtual] = useState(0)
  const [processandoParticipantes, setProcessandoParticipantes] = useState(false)
  const [participantesProcessados, setParticipantesProcessados] = useState<ParticipanteDPS[]>([])

  // Calcular etapas: dados + seleção de DPS + questionários (20 perguntas por pessoa) + confirmação
  const totalParticipantes = 1 + formData.participantes.length // responsável + participantes
  const totalEtapas =
    formData.participantes.length > 0
      ? 1 + 1 + totalParticipantes * perguntasDPS.length + 1 // dados + seleção + questionários + confirmação
      : 1 + perguntasDPS.length + 1 // dados + questionários + confirmação

  const progresso = ((etapaAtual + 1) / totalEtapas) * 100

  const adicionarParticipante = () => {
    setFormData((prev) => ({
      ...prev,
      participantes: [...prev.participantes, { nome: "", cpf: "", dataNascimento: "", jaExistia: false }],
    }))
  }

  const removerParticipante = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      participantes: prev.participantes.filter((_, i) => i !== index),
    }))
  }

  const atualizarParticipante = (index: number, campo: keyof ParticipanteDPS, valor: string) => {
    setFormData((prev) => ({
      ...prev,
      participantes: prev.participantes.map((p, i) => (i === index ? { ...p, [campo]: valor } : p)),
    }))
  }

  const processarParticipantes = async () => {
    if (formData.participantes.length === 0) {
      // Se não há participantes, ir direto para questionário do responsável
      setParticipanteAtual(0)
      setPerguntaAtual(0)
      setEtapaAtual(1) // Pular seleção e ir direto para questionário
      return
    }

    setProcessandoParticipantes(true)
    try {
      const processados = await web3AuthService.processarParticipantesDPS(formData.participantes)
      setParticipantesProcessados(processados)

      // Enviar hashes dos novos usuários por email
      const novosUsuarios = processados.filter((p) => !p.jaExistia)
      if (novosUsuarios.length > 0) {
        try {
          await web3AuthService.enviarHashPorEmail(
            formData.email,
            novosUsuarios.map((u) => ({ nome: u.nome, hash: u.hash! })),
          )
        } catch (emailError) {
          console.warn("Erro ao enviar email:", emailError)
        }
      }

      setEtapaAtual(1) // Ir para seleção de DPS
    } catch (error) {
      console.error("Erro ao processar participantes:", error)
      alert(t.dps.processParticipantsError)
      setEtapaAtual(1)
    } finally {
      setProcessandoParticipantes(false)
    }
  }

  const selecionarDPS = (participanteIndex: number) => {
    setParticipanteAtual(participanteIndex)
    setPerguntaAtual(0)
    setEtapaAtual(formData.participantes.length > 0 ? 2 : 1) // Ajustar etapa baseado se há participantes
  }

  const handleResposta = (perguntaId: number, resposta: string, detalhes?: string) => {
    if (participanteAtual === null) return

    const chaveParticipante = participanteAtual === 0 ? "responsavel" : `participante_${participanteAtual - 1}`

    setFormData((prev) => ({
      ...prev,
      respostas: {
        ...prev.respostas,
        [chaveParticipante]: {
          ...prev.respostas[chaveParticipante],
          [perguntaId]: { resposta, detalhes },
        },
      },
    }))
  }

  const proximaPergunta = () => {
    if (perguntaAtual < perguntasDPS.length - 1) {
      setPerguntaAtual(perguntaAtual + 1)
      setEtapaAtual(etapaAtual + 1)
    } else {
      // Terminou as perguntas deste participante
      const proximoParticipante = obterProximoParticipantePendente()
      if (proximoParticipante !== null) {
        // Há mais participantes para responder
        setParticipanteAtual(proximoParticipante)
        setPerguntaAtual(0)
        setEtapaAtual(etapaAtual + 1)
      } else {
        // Todos responderam, ir para confirmação
        setEtapaAtual(totalEtapas - 1)
      }
    }
  }

  const perguntaAnterior = () => {
    if (perguntaAtual > 0) {
      setPerguntaAtual(perguntaAtual - 1)
      setEtapaAtual(etapaAtual - 1)
    } else {
      // Primeira pergunta do participante atual
      if (formData.participantes.length > 0) {
        // Voltar para seleção de DPS
        setParticipanteAtual(null)
        setEtapaAtual(1)
      } else {
        // Voltar para dados pessoais
        setParticipanteAtual(null)
        setEtapaAtual(0)
      }
    }
  }

  const obterProximoParticipantePendente = (): number | null => {
    // Verificar quais participantes ainda não responderam
    for (let i = 0; i < totalParticipantes; i++) {
      const chaveParticipante = i === 0 ? "responsavel" : `participante_${i - 1}`
      const respostasParticipante = formData.respostas[chaveParticipante]

      if (!respostasParticipante || Object.keys(respostasParticipante).length < perguntasDPS.length) {
        return i
      }
    }
    return null
  }

  const obterNomeParticipante = (index: number) => {
    if (index === 0) return formData.nome || t.dps.responsible
    return formData.participantes[index - 1]?.nome || `${t.dps.participant} ${index}`
  }

  const obterParticipantesComStatus = () => {
    const participantes = []

    // Responsável
    const respostasResponsavel = formData.respostas["responsavel"]
    participantes.push({
      index: 0,
      nome: formData.nome || t.dps.responsible,
      respondido: respostasResponsavel && Object.keys(respostasResponsavel).length === perguntasDPS.length,
    })

    // Participantes
    formData.participantes.forEach((p, i) => {
      const chaveParticipante = `participante_${i}`
      const respostasParticipante = formData.respostas[chaveParticipante]
      participantes.push({
        index: i + 1,
        nome: p.nome,
        respondido: respostasParticipante && Object.keys(respostasParticipante).length === perguntasDPS.length,
      })
    })

    return participantes
  }

  const finalizarDPS = async () => {
    console.log("Finalizando DPS:", formData)
    alert(t.dps.successMessage)
  }

  const validarDadosObrigatorios = () => {
    return formData.nome && formData.cpf && formData.email && formData.dataNascimento
  }

  const validarParticipantes = () => {
    return formData.participantes.every((p) => p.nome && p.cpf && p.dataNascimento)
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
          <h1 className="text-xl font-bold text-gray-900">{t.dps.newStatement}</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">{t.common.progress}</span>
            <span className="text-sm text-gray-600">
              {etapaAtual + 1}/{totalEtapas}
            </span>
          </div>
          <Progress value={progresso} className="h-2" />
          <p className="text-sm text-gray-600 mt-2">
            {Math.round(progresso)}% {t.common.completed}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {etapaAtual === 0 && t.dashboard.participants}
              {etapaAtual === 1 && formData.participantes.length > 0 && t.dps.selectDpsToFill}
              {etapaAtual >= (formData.participantes.length > 0 ? 2 : 1) &&
                etapaAtual < totalEtapas - 1 &&
                `${t.dps.questionnaire} - ${obterNomeParticipante(participanteAtual!)}`}
              {etapaAtual === totalEtapas - 1 && t.common.confirmation}
            </CardTitle>
            <CardDescription>
              {etapaAtual === 0 && t.dps.informYourData}
              {etapaAtual === 1 && formData.participantes.length > 0 && t.dps.choosePersonToFillDps}
              {etapaAtual >= (formData.participantes.length > 0 ? 2 : 1) &&
                etapaAtual < totalEtapas - 1 &&
                t.dps.answerHealthQuestionnaire}
              {etapaAtual === totalEtapas - 1 && t.dps.reviewAllInformation}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Etapa 0: Dados do Responsável + Participantes */}
            {etapaAtual === 0 && (
              <div className="space-y-8">
                {/* Dados do Responsável */}
                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {t.dps.responsibleData}
                  </h3>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nome">{t.common.fullName} *</Label>
                        <Input
                          id="nome"
                          value={formData.nome}
                          onChange={(e) => setFormData((prev) => ({ ...prev, nome: e.target.value }))}
                          placeholder={t.dps.yourFullName}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cpf">CPF *</Label>
                        <Input
                          id="cpf"
                          value={formData.cpf}
                          onChange={(e) => setFormData((prev) => ({ ...prev, cpf: e.target.value }))}
                          placeholder="000.000.000-00"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">E-mail *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                          placeholder="seu@email.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="telefone">{t.common.phone}</Label>
                        <Input
                          id="telefone"
                          value={formData.telefone}
                          onChange={(e) => setFormData((prev) => ({ ...prev, telefone: e.target.value }))}
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="dataNascimento">{t.common.birthDate} *</Label>
                      <Input
                        id="dataNascimento"
                        type="date"
                        value={formData.dataNascimento}
                        onChange={(e) => setFormData((prev) => ({ ...prev, dataNascimento: e.target.value }))}
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Participantes */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      {t.dps.additionalParticipants}
                    </h3>
                    <Button variant="outline" onClick={adicionarParticipante}>
                      <Plus className="mr-2 h-4 w-4" />
                      {t.common.addParticipant}
                    </Button>
                  </div>

                  {formData.participantes.length === 0 ? (
                    <div className="bg-gray-50 p-6 rounded-lg text-center">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 mb-2">{t.dps.noParticipantsAdded}</p>
                      <p className="text-sm text-gray-500">{t.dps.addFamilyMembers}</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.participantes.map((participante, index) => (
                        <div key={index} className="p-4 border rounded-lg space-y-4">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{`${t.dps.participant} ${index + 1}`}</h4>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removerParticipante(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="grid md:grid-cols-3 gap-4">
                            <div>
                              <Label htmlFor={`nome-${index}`}>{t.common.fullName} *</Label>
                              <Input
                                id={`nome-${index}`}
                                value={participante.nome}
                                onChange={(e) => atualizarParticipante(index, "nome", e.target.value)}
                                placeholder={t.common.fullName}
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
                              <Label htmlFor={`data-${index}`}>{t.common.birthDate} *</Label>
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

                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                          <div className="text-sm text-yellow-800">
                            <p className="font-medium mb-1">{t.common.attention}:</p>
                            <ul className="list-disc list-inside space-y-1 text-xs">
                              <li>{t.dps.youWillAnswer}</li>
                              <li>{t.dps.allWillBeRegistered}</li>
                              <li>{t.dps.newUsersWillReceive}</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Etapa 1: Seleção de DPS (apenas se há participantes) */}
            {etapaAtual === 1 && formData.participantes.length > 0 && (
              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>{t.dps.selectPersonToFillDpsFirst}.</strong>
                    <br />
                    {t.dps.youNeedToAnswer}
                  </p>
                </div>

                <div className="grid gap-4">
                  {obterParticipantesComStatus().map((participante) => (
                    <div
                      key={participante.index}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        participante.respondido ? "bg-green-50 border-green-200" : "hover:bg-gray-50 border-gray-200"
                      }`}
                      onClick={() => !participante.respondido && selecionarDPS(participante.index)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-lg ${participante.index === 0 ? "bg-blue-100" : "bg-purple-100"}`}
                          >
                            <User
                              className={`h-5 w-5 ${participante.index === 0 ? "text-blue-600" : "text-purple-600"}`}
                            />
                          </div>
                          <div>
                            <h4 className="font-medium">{participante.nome}</h4>
                            <p className="text-sm text-gray-600">
                              {participante.index === 0
                                ? t.dps.responsible
                                : `${t.dps.participant} ${participante.index}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {participante.respondido ? (
                            <Badge className="bg-green-100 text-green-800">✓ {t.common.answered}</Badge>
                          ) : (
                            <Badge variant="outline">{t.common.pending}</Badge>
                          )}
                          {!participante.respondido && <ArrowRight className="h-4 w-4 text-gray-400" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Etapas de Questionário */}
            {etapaAtual >= (formData.participantes.length > 0 ? 2 : 1) &&
              etapaAtual < totalEtapas - 1 &&
              participanteAtual !== null && (
                <div className="space-y-6">
                  {/* Indicador do participante e pergunta atual */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">
                          {t.dps.answeringFor}: {obterNomeParticipante(participanteAtual)}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {participanteAtual === 0 ? t.dps.responsible : `${t.dps.participant} ${participanteAtual}`}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {t.dps.question} {perguntaAtual + 1} {t.common.of} {perguntasDPS.length}
                      </Badge>
                    </div>
                  </div>

                  {/* Pergunta atual */}
                  {(() => {
                    const pergunta = perguntasDPS[perguntaAtual]
                    const chaveParticipante =
                      participanteAtual === 0 ? "responsavel" : `participante_${participanteAtual - 1}`
                    const respostaAtual = formData.respostas[chaveParticipante]?.[pergunta.id]

                    return (
                      <div className="space-y-4 p-4 border rounded-lg">
                        <div className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                            {pergunta.id}
                          </span>
                          <div className="flex-1">
                            <Label className="text-base font-medium leading-relaxed">{pergunta.pergunta}</Label>

                            <RadioGroup
                              value={respostaAtual?.resposta || ""}
                              onValueChange={(value) => handleResposta(pergunta.id, value, respostaAtual?.detalhes)}
                              className="mt-3"
                            >
                              {pergunta.opcoes.map((opcao) => (
                                <div key={opcao} className="flex items-center space-x-2">
                                  <RadioGroupItem value={opcao} id={`${pergunta.id}-${opcao}`} />
                                  <Label htmlFor={`${pergunta.id}-${opcao}`}>{opcao}</Label>
                                </div>
                              ))}
                            </RadioGroup>

                            {pergunta.temDetalhes && respostaAtual?.resposta === t.common.yes && (
                              <div className="mt-4">
                                <Label htmlFor={`${pergunta.id}-detalhes`} className="text-sm text-gray-600">
                                  {pergunta.detalheLabel || t.dps.additionalDetails}
                                </Label>
                                <Textarea
                                  id={`${pergunta.id}-detalhes`}
                                  value={respostaAtual?.detalhes || ""}
                                  onChange={(e) =>
                                    handleResposta(pergunta.id, respostaAtual?.resposta || "", e.target.value)
                                  }
                                  placeholder={t.dps.provideAdditionalDetails}
                                  className="mt-1"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              )}

            {/* Etapa Final: Confirmação */}
            {etapaAtual === totalEtapas - 1 && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium">{t.dps.dpsSummary}</h3>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">{t.dps.responsible}</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>
                      <strong>{t.common.name}:</strong> {formData.nome}
                    </p>
                    <p>
                      <strong>CPF:</strong> {formData.cpf}
                    </p>
                    <p>
                      <strong>E-mail:</strong> {formData.email}
                    </p>
                  </div>
                </div>

                {formData.participantes.length > 0 && (
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">
                      {t.dps.participants} ({formData.participantes.length})
                    </h4>
                    <div className="space-y-2">
                      {formData.participantes.map((p, i) => (
                        <div key={i} className="text-sm text-purple-800">
                          <strong>{p.nome}</strong> - CPF: {p.cpf}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">{t.dps.questionnairesAnswered}</h4>
                  <p className="text-sm text-green-800">
                    {totalParticipantes} {t.dps.completeQuestionnaire}(s) {t.common.with} {perguntasDPS.length}{" "}
                    {t.dps.questionsEach}.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={
              etapaAtual >= (formData.participantes.length > 0 ? 2 : 1) && etapaAtual < totalEtapas - 1
                ? perguntaAnterior
                : () => setEtapaAtual(etapaAtual - 1)
            }
            disabled={etapaAtual === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t.common.previous}
          </Button>

          {etapaAtual === 0 ? (
            <Button
              onClick={processarParticipantes}
              disabled={
                !validarDadosObrigatorios() ||
                (formData.participantes.length > 0 && !validarParticipantes()) ||
                processandoParticipantes
              }
            >
              {processandoParticipantes ? t.common.processing : t.common.continue}
            </Button>
          ) : etapaAtual === 1 && formData.participantes.length > 0 ? (
            <div className="text-sm text-gray-600">{t.dps.selectDpsToContinue}</div>
          ) : etapaAtual < totalEtapas - 1 ? (
            <Button onClick={proximaPergunta}>
              {t.common.next}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={finalizarDPS} className="bg-green-600 hover:bg-green-700">
              <Save className="mr-2 h-4 w-4" />
              {t.dps.finalizeDps}
            </Button>
          )}
        </div>
      </main>
    </div>
  )
}
