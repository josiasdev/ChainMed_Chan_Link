"use client"

import { useState, useEffect } from "react"
import { Shield, FileText, Users, Calendar, Hash, Plus, Eye, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { web3AuthService } from "@/lib/web3-auth"
import { useLanguage } from "@/lib/language-context"

export default function DashboardPage() {
  const { t } = useLanguage()
  const [enderecoUsuario, setEnderecoUsuario] = useState("")
  const [historicoDPS, setHistoricoDPS] = useState<any[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    inicializarDashboard()
  }, [])

  const inicializarDashboard = async () => {
    try {
      const endereco = await web3AuthService.conectarCarteira()
      setEnderecoUsuario(endereco)

      const historico = await web3AuthService.obterHistoricoDPS()
      setHistoricoDPS(historico)
    } catch (error) {
      console.error("Erro ao inicializar dashboard:", error)
      // Redirecionar para login se não conseguir conectar
      window.location.href = "/login"
    } finally {
      setCarregando(false)
    }
  }

  if (carregando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">{t.common.loading}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">{t.homepage.subtitle}</span>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
              Sepolia
            </Badge>
            <span className="text-sm text-gray-600">
              {enderecoUsuario.slice(0, 6)}...{enderecoUsuario.slice(-4)}
            </span>
            <Button
              className="bg-black text-white hover:bg-gray-800"
              size="sm"
              onClick={() => web3AuthService.desconectar()}
            >
              {t.common.disconnect}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.dashboard.title}</h1>
          <p className="text-gray-600">{t.dashboard.subtitle}</p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="border-2 border-blue-200 hover:border-blue-300 transition-colors">
            <Link href="/dps/novo">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Plus className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle>{t.dashboard.newDPS}</CardTitle>
                    <CardDescription>{t.dashboard.newDPSDesc}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Link>
          </Card>

          <Card className="border-2 border-purple-200 hover:border-purple-300 transition-colors">
            <Link href="/dps/familiar">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle>{t.dashboard.familyDPS}</CardTitle>
                    <CardDescription>{t.dashboard.familyDPSDesc}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Link>
          </Card>
        </div>

        {/* Histórico de DPS */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {t.dashboard.dpsHistory}
                </CardTitle>
                <CardDescription>{t.dashboard.dpsHistoryDesc}</CardDescription>
              </div>
              <Badge variant="secondary">
                {historicoDPS.length} {t.dashboard.records}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {historicoDPS.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">{t.dashboard.noDPSFound}</h3>
                <p className="text-gray-500 mb-4">{t.dashboard.noDPSFoundDesc}</p>
                <Link href="/dps/novo">
                  <Button className="bg-black text-white hover:bg-gray-800">
                    <Plus className="mr-2 h-4 w-4" />
                    {t.dashboard.fillFirstDPS}
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {historicoDPS.map((dps) => (
                  <div
                    key={dps.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold">DPS #{dps.id}</div>
                        <div className="text-sm text-gray-600 flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(dps.dataPreenchimento).toLocaleDateString("pt-BR")}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {dps.participantes.length} {t.dashboard.participants}
                          </span>
                          {dps.respostasPositivas > 0 && (
                            <span className="flex items-center gap-1 text-orange-600">
                              <AlertCircle className="h-4 w-4" />
                              {dps.respostasPositivas} {t.dashboard.conditions}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Hash className="h-3 w-3" />
                          {dps.hash}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={dps.status === "ativa" ? "default" : "secondary"}
                        className={dps.status === "ativa" ? "bg-green-100 text-green-800" : ""}
                      >
                        {dps.status === "ativa" ? t.dashboard.active : t.dashboard.inactive}
                      </Badge>
                      <Button className="bg-black text-white hover:bg-gray-800" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        {t.common.view}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">{historicoDPS.length}</div>
              <div className="text-sm text-gray-600">{t.dashboard.totalDPS}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">
                {historicoDPS.reduce((acc, dps) => acc + dps.participantes.length, 0)}
              </div>
              <div className="text-sm text-gray-600">{t.dashboard.totalParticipants}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">
                {historicoDPS.filter((dps) => dps.status === "ativa").length}
              </div>
              <div className="text-sm text-gray-600">{t.dashboard.activeDPS}</div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
