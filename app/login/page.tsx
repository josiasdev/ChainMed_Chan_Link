"use client"

import { useState, useEffect } from "react"
import { Shield, Wallet, Building2, AlertCircle, CheckCircle } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { web3AuthService } from "@/lib/web3-auth"
import { useLanguage } from "@/lib/language-context"

export default function LoginPage() {
  const { t } = useLanguage()
  const [enderecoCarteira, setEnderecoCarteira] = useState("")
  const [conectando, setConectando] = useState(false)
  const [tipoUsuario, setTipoUsuario] = useState<"usuario" | "seguradora">("usuario")
  const [redeSepolia, setRedeSepolia] = useState(false)

  useEffect(() => {
    verificarConexaoExistente()
  }, [])

  const verificarConexaoExistente = async () => {
    try {
      if (typeof window !== "undefined" && window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        if (accounts.length > 0) {
          const provider = new (await import("ethers")).ethers.providers.Web3Provider(window.ethereum)
          const network = await provider.getNetwork()

          if (network.chainId === 11155111) {
            setEnderecoCarteira(accounts[0])
            setRedeSepolia(true)
          }
        }
      }
    } catch (error) {
      console.error("Erro ao verificar conexão:", error)
    }
  }

  const conectarCarteira = async () => {
    setConectando(true)
    try {
      const endereco = await web3AuthService.conectarCarteira()
      setEnderecoCarteira(endereco)
      setRedeSepolia(true)

      // Redirecionar baseado no tipo de usuário
      if (tipoUsuario === "usuario") {
        window.location.href = "/dashboard"
      } else {
        window.location.href = "/seguradora/dashboard"
      }
    } catch (error: any) {
      console.error("Erro ao conectar:", error)
      alert(error.message || t.errors.connectionError)
    } finally {
      setConectando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">{t.homepage.subtitle}</span>
          </Link>
          <p className="text-gray-600 mt-2">{t.login.title}</p>
        </div>

        <Tabs
          value={tipoUsuario}
          onValueChange={(value) => setTipoUsuario(value as "usuario" | "seguradora")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="usuario">{t.login.userLogin}</TabsTrigger>
            <TabsTrigger value="seguradora">{t.login.insuranceLogin}</TabsTrigger>
          </TabsList>

          <TabsContent value="usuario">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Wallet className="mr-2 h-5 w-5" />
                  {t.login.userLogin}
                </CardTitle>
                <CardDescription>{t.login.title}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Status da Conexão */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">MetaMask</span>
                    {typeof window !== "undefined" && window.ethereum ? (
                      <Badge className="bg-green-100 text-green-800">{t.login.metamaskInstalled}</Badge>
                    ) : (
                      <Badge variant="destructive">{t.login.metamaskNotInstalled}</Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Sepolia</span>
                    {redeSepolia ? (
                      <Badge className="bg-green-100 text-green-800">{t.login.sepoliaConnected}</Badge>
                    ) : (
                      <Badge variant="secondary">{t.login.sepoliaDisconnected}</Badge>
                    )}
                  </div>

                  {enderecoCarteira && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">{t.login.walletConnected}</span>
                      </div>
                      <p className="text-xs font-mono text-green-700">
                        {enderecoCarteira.slice(0, 6)}...{enderecoCarteira.slice(-4)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Botão de Conexão */}
                {!enderecoCarteira ? (
                  <Button
                    onClick={conectarCarteira}
                    className="w-full bg-black text-white hover:bg-gray-800"
                    disabled={conectando}
                    size="lg"
                  >
                    {conectando ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        {t.login.connecting}
                      </>
                    ) : (
                      <>
                        <Wallet className="mr-2 h-4 w-4" />
                        {t.login.connectMetaMask}
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={() => (window.location.href = "/dashboard")}
                    className="w-full bg-black text-white hover:bg-gray-800"
                    size="lg"
                  >
                    {t.login.accessDashboard}
                  </Button>
                )}

                {/* Instruções */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">{t.login.requirements}</p>
                      <ul className="list-disc list-inside space-y-1 text-xs">
                        {t.login.requirementsList.map((req, index) => (
                          <li key={index}>{req}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Links Úteis */}
                <div className="text-center space-y-2">
                  <Link href="/cadastro" className="text-sm text-blue-600 hover:underline block">
                    {t.login.noAccount}
                  </Link>
                  <a
                    href="https://sepoliafaucet.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-gray-600 hover:underline block"
                  >
                    {t.login.getTestETH}
                  </a>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seguradora">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="mr-2 h-5 w-5" />
                  {t.login.insuranceLogin}
                </CardTitle>
                <CardDescription>{t.login.corporateAccess}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Status da Conexão */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">MetaMask</span>
                    {typeof window !== "undefined" && window.ethereum ? (
                      <Badge className="bg-green-100 text-green-800">{t.login.metamaskInstalled}</Badge>
                    ) : (
                      <Badge variant="destructive">{t.login.metamaskNotInstalled}</Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm font-medium">Sepolia</span>
                    {redeSepolia ? (
                      <Badge className="bg-green-100 text-green-800">{t.login.sepoliaConnected}</Badge>
                    ) : (
                      <Badge variant="secondary">{t.login.sepoliaDisconnected}</Badge>
                    )}
                  </div>

                  {enderecoCarteira && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm font-medium text-green-800">{t.login.walletConnected}</span>
                      </div>
                      <p className="text-xs font-mono text-green-700">
                        {enderecoCarteira.slice(0, 6)}...{enderecoCarteira.slice(-4)}
                      </p>
                    </div>
                  )}
                </div>

                {/* Botão de Conexão */}
                {!enderecoCarteira ? (
                  <Button
                    onClick={conectarCarteira}
                    className="w-full bg-black text-white hover:bg-gray-800"
                    disabled={conectando}
                    size="lg"
                  >
                    {conectando ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        {t.login.connecting}
                      </>
                    ) : (
                      <>
                        <Wallet className="mr-2 h-4 w-4" />
                        {t.login.connectMetaMask}
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={() => (window.location.href = "/seguradora/dashboard")}
                    className="w-full bg-black text-white hover:bg-gray-800"
                    size="lg"
                  >
                    {t.login.accessDashboard}
                  </Button>
                )}

                {/* Aviso Corporativo */}
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-orange-800">
                      <p className="font-medium mb-1">{t.login.corporateAccess}</p>
                      <p className="text-xs">{t.login.corporateAccessDesc}</p>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <Link href="/cadastro" className="text-sm text-blue-600 hover:underline">
                    {t.login.registerInsurance}
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
