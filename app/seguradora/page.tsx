"use client"

import { useState } from "react"
import { Shield, Search, FileText, User, Calendar, Hash, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useLanguage } from "@/lib/language-context"

export default function SeguradoraPage() {
  const { t } = useLanguage()
  const [searchValue, setSearchValue] = useState("")
  const [searchType, setSearchType] = useState<"hash" | "cpf">("hash")
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const searchUser = async () => {
    if (!searchValue.trim()) {
      setError(t.errors.fillRequired)
      return
    }

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const params = new URLSearchParams()
      params.append(searchType, searchValue.trim())

      console.log("Making API call:", `/api/consulta?${params}`)

      const response = await fetch(`/api/consulta?${params}`, {
        headers: {
          "x-api-key": "sk_test_1234567890abcdef",
          "Content-Type": "application/json",
        },
      })

      console.log("Response status:", response.status)

      const data = await response.json()
      console.log("Response data:", data)

      if (response.ok && data.success) {
        setResult(data)
      } else {
        setError(data.error || `HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (err) {
      console.error("Search error:", err)
      setError(t.errors.networkError + ": " + (err instanceof Error ? err.message : t.errors.unknownError))
    } finally {
      setLoading(false)
    }
  }

  const examples = {
    hash: [
      {
        name: "João Silva Santos",
        value: "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
      },
      {
        name: "Maria Silva Santos",
        value: "b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567a",
      },
    ],
    cpf: [
      {
        name: "João Silva Santos",
        value: "12345678901",
      },
      {
        name: "Maria Silva Santos",
        value: "98765432100",
      },
    ],
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">{t.homepage.subtitle}</span>
          </Link>
          <Badge variant="secondary">{t.insurance.insurancePanel}</Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.insurance.title}</h1>
          <p className="text-gray-600">{t.insurance.subtitle}</p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="mr-2 h-5 w-5" />
              {t.insurance.searchDPS}
            </CardTitle>
            <CardDescription>{t.insurance.searchDesc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="searchType">{t.insurance.searchType}</Label>
                <select
                  id="searchType"
                  value={searchType}
                  onChange={(e) => {
                    setSearchType(e.target.value as "hash" | "cpf")
                    setSearchValue("")
                    setResult(null)
                    setError("")
                  }}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="hash">{t.insurance.userHash}</option>
                  <option value="cpf">CPF</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="searchValue">
                  {searchType === "hash" ? t.insurance.userHash : t.insurance.cpfNumbers}
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="searchValue"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder={searchType === "hash" ? "a1b2c3d4e5f6..." : "12345678901"}
                    className={searchType === "hash" ? "font-mono text-sm" : ""}
                  />
                  <Button
                    onClick={searchUser}
                    disabled={!searchValue.trim() || loading}
                    className="bg-black text-white hover:bg-gray-800"
                  >
                    {loading ? t.insurance.searching : t.insurance.search}
                  </Button>
                </div>
              </div>
            </div>

            {/* Examples */}
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 mb-2">
                <strong>{t.insurance.examples}</strong>
              </p>
              <div className="space-y-2">
                {examples[searchType].map((example, index) => (
                  <div key={index}>
                    <p className="text-xs text-blue-700 font-medium">{example.name}</p>
                    <code
                      className="text-xs bg-white px-2 py-1 rounded border cursor-pointer hover:bg-gray-50 block"
                      onClick={() => setSearchValue(example.value)}
                    >
                      {example.value}
                    </code>
                  </div>
                ))}
              </div>
              <p className="text-xs text-blue-600 mt-2">💡 {t.insurance.clickToFill}</p>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">❌ {error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results */}
        {result?.data && (
          <div className="space-y-6">
            {/* Fraud Alert */}
            {result.data.alertas?.possibleFraude && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-red-800">
                      <p className="font-medium">🚨 {t.insurance.fraudAlert}</p>
                      <p className="mt-1">{result.data.alertas.motivo}</p>
                      <p className="mt-1">
                        <strong>
                          {t.insurance.risk} {result.data.alertas.risco}
                        </strong>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* User Info */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {t.insurance.clientInfo}
                  </CardTitle>
                  <Badge className="bg-green-100 text-green-800">✓ {t.insurance.verified}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm text-gray-600">{t.insurance.name}</Label>
                    <p className="font-semibold">{result.data.usuario.nome}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">CPF</Label>
                    <p className="font-semibold font-mono">{result.data.usuario.cpf}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">E-mail</Label>
                    <p className="font-semibold">{result.data.usuario.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-600">{t.insurance.birthDate}</Label>
                    <p className="font-semibold">
                      {new Date(result.data.usuario.dataNascimento).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>

                {/* Statistics */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">📊 {t.insurance.statistics}</h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">{t.insurance.totalDPS}</p>
                      <p className="font-semibold text-lg">{result.data.estatisticas.totalDPS}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">{t.insurance.conditions}</p>
                      <p className="font-semibold text-lg">{result.data.estatisticas.totalRespostasPositivas}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">{t.insurance.risk}</p>
                      <Badge variant={result.data.alertas.risco === "BAIXO" ? "default" : "destructive"}>
                        {result.data.alertas.risco}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* DPS History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  {t.insurance.dpsHistory} ({result.data.dps.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {result.data.dps.map((dps: any) => (
                    <div key={dps.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">DPS #{dps.id}</Badge>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="mr-1 h-4 w-4" />
                            {new Date(dps.dataPreenchimento).toLocaleDateString("pt-BR")}
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Hash className="mr-1 h-4 w-4" />
                          {dps.hash}
                        </div>
                      </div>

                      <Separator className="mb-3" />

                      <div>
                        <h4 className="font-medium mb-2">
                          {t.insurance.declaredConditions} ({dps.respostasPositivas?.length || 0})
                        </h4>
                        {dps.respostasPositivas && dps.respostasPositivas.length > 0 ? (
                          <div className="space-y-2">
                            {dps.respostasPositivas.map((resposta: any, idx: number) => (
                              <div key={idx} className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                                <p className="font-medium text-sm">{resposta.pergunta}</p>
                                <p className="text-sm text-gray-600 mt-1">
                                  <strong>{t.insurance.answer}</strong> {resposta.resposta}
                                </p>
                                {resposta.detalhes && (
                                  <p className="text-sm text-gray-600 mt-1">
                                    <strong>{t.insurance.details}</strong> {resposta.detalhes}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-green-600 text-sm">✅ {t.insurance.noConditions}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* No Results */}
        {searchValue && !result && !loading && !error && (
          <Card>
            <CardContent className="text-center py-8">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">{t.insurance.userNotFound}</h3>
              <p className="text-gray-600">
                {t.insurance.userNotFoundDesc} {searchType === "hash" ? "hash" : "CPF"}: {searchValue}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
