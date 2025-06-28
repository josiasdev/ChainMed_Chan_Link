"use client"

import { useState } from "react"
import { Shield, Code, Key, Database, ArrowLeft, Copy, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function APIDocumentationPage() {
  const [apiKey, setApiKey] = useState("sk_test_1234567890abcdef")
  const [hashConsulta, setHashConsulta] = useState("a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456")
  const [responseData, setResponseData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState("")

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    setTimeout(() => setCopied(""), 2000)
  }

  const testarAPI = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/consulta?hash=${hashConsulta}`, {
        headers: {
          "x-api-key": apiKey,
        },
      })
      const data = await response.json()
      setResponseData({ status: response.status, data })
    } catch (error) {
      setResponseData({ status: 500, error: "Erro na requisição" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/">
            <Button className="bg-black text-white hover:bg-gray-800" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">ChainMed API</h1>
          </div>
          <Badge variant="secondary">v1.0</Badge>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Introdução */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Documentação da API ChainMed</h1>
          <p className="text-lg text-gray-600 mb-6">
            API REST para consulta de Declarações Pessoais de Saúde (DPS) registradas na blockchain Sepolia.
          </p>

          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Database className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="font-semibold">Base URL</div>
                <div className="text-sm text-gray-600">https://chainmed.vercel.app</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Key className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="font-semibold">Autenticação</div>
                <div className="text-sm text-gray-600">API Key via Header</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Code className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="font-semibold">Formato</div>
                <div className="text-sm text-gray-600">JSON</div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs defaultValue="endpoints" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="authentication">Autenticação</TabsTrigger>
            <TabsTrigger value="testing">Teste da API</TabsTrigger>
            <TabsTrigger value="examples">Exemplos</TabsTrigger>
          </TabsList>

          {/* Endpoints */}
          <TabsContent value="endpoints" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge className="bg-green-100 text-green-800">GET</Badge>
                  <span>/api/consulta</span>
                </CardTitle>
                <CardDescription>Consultar DPS de um usuário pelo hash único</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Parâmetros de Query</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">hash</Badge>
                        <span className="text-sm">string (obrigatório)</span>
                      </div>
                      <p className="text-sm text-gray-600">Hash único do usuário (64 caracteres)</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Headers</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">x-api-key</Badge>
                        <span className="text-sm">string (obrigatório)</span>
                      </div>
                      <p className="text-sm text-gray-600">Chave de API da seguradora autorizada</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Exemplo de Requisição</h4>
                  <div className="bg-gray-900 text-gray-100 p-4 rounded-lg relative">
                    <Button
                      className="absolute top-2 right-2 bg-gray-700 text-gray-300 hover:bg-gray-600"
                      size="sm"
                      onClick={() =>
                        copyToClipboard(
                          `curl -X GET "https://chainmed.vercel.app/api/consulta?hash=a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456" \\
  -H "x-api-key: sk_test_1234567890abcdef"`,
                          "curl",
                        )
                      }
                    >
                      {copied === "curl" ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <pre className="text-sm">
                      {`curl -X GET "https://chainmed.vercel.app/api/consulta?hash=a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456" \\
  -H "x-api-key: sk_test_1234567890abcdef"`}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Teste da API */}
          <TabsContent value="testing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Teste Interativo da API</CardTitle>
                <CardDescription>Teste a API diretamente nesta página</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="apiKey">API Key</Label>
                    <Input
                      id="apiKey"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      placeholder="sk_test_..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="hash">Hash do Usuário</Label>
                    <Input
                      id="hash"
                      value={hashConsulta}
                      onChange={(e) => setHashConsulta(e.target.value)}
                      placeholder="Hash de 64 caracteres"
                    />
                  </div>
                </div>

                <Button onClick={testarAPI} disabled={loading} className="w-full bg-black text-white hover:bg-gray-800">
                  {loading ? "Testando..." : "Testar API"}
                </Button>

                {responseData && (
                  <div>
                    <Label>Resposta da API</Label>
                    <div className="bg-gray-900 text-gray-100 p-4 rounded-lg mt-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge
                          variant={responseData.status === 200 ? "default" : "destructive"}
                          className={responseData.status === 200 ? "bg-green-600" : ""}
                        >
                          {responseData.status}
                        </Badge>
                        <span className="text-sm text-gray-400">
                          {responseData.status === 200 ? "Success" : "Error"}
                        </span>
                      </div>
                      <pre className="text-sm overflow-x-auto">
                        {JSON.stringify(responseData.data || responseData.error, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Outros tabs continuam com botões padronizados... */}
        </Tabs>
      </main>
    </div>
  )
}
