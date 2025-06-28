"use client"

import type React from "react"

import { useState } from "react"
import { Shield, Mail, Lock, User, Phone, Calendar, FileText } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { gerarHashUsuario } from "@/lib/crypto"
import { useLanguage } from "@/lib/language-context"

export default function CadastroPage() {
  const { t } = useLanguage()
  const [dadosUsuario, setDadosUsuario] = useState({
    nome: "",
    cpf: "",
    email: "",
    telefone: "",
    dataNascimento: "",
    senha: "",
    confirmarSenha: "",
  })

  const [dadosSeguradora, setDadosSeguradora] = useState({
    nomeEmpresa: "",
    cnpj: "",
    email: "",
    telefone: "",
    responsavel: "",
    senha: "",
    confirmarSenha: "",
  })

  const [aceitouTermos, setAceitouTermos] = useState(false)
  const [carregando, setCarregando] = useState(false)

  const handleCadastroUsuario = async (e: React.FormEvent) => {
    e.preventDefault()

    if (dadosUsuario.senha !== dadosUsuario.confirmarSenha) {
      alert(t.errors.passwordMismatch)
      return
    }

    if (!aceitouTermos) {
      alert(t.errors.acceptTerms)
      return
    }

    setCarregando(true)

    try {
      // Gerar hash único do usuário
      const hashUsuario = await gerarHashUsuario(dadosUsuario.cpf, dadosUsuario.email)

      console.log("Cadastrando usuário:", {
        ...dadosUsuario,
        hashUsuario,
        senha: "[OCULTA]",
        confirmarSenha: "[OCULTA]",
      })

      // Simular cadastro no banco
      await new Promise((resolve) => setTimeout(resolve, 2000))

      alert(`${t.register.createAccount}!\nHash: ${hashUsuario.substring(0, 16)}...`)

      // Redirecionar para login
      window.location.href = "/login"
    } catch (error) {
      console.error("Erro no cadastro:", error)
      alert(t.errors.unknownError)
    } finally {
      setCarregando(false)
    }
  }

  const handleCadastroSeguradora = async (e: React.FormEvent) => {
    e.preventDefault()

    if (dadosSeguradora.senha !== dadosSeguradora.confirmarSenha) {
      alert(t.errors.passwordMismatch)
      return
    }

    if (!aceitouTermos) {
      alert(t.errors.acceptTerms)
      return
    }

    setCarregando(true)

    try {
      // Gerar API Key única
      const apiKey = `sk_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`

      console.log("Cadastrando seguradora:", {
        ...dadosSeguradora,
        apiKey,
        senha: "[OCULTA]",
        confirmarSenha: "[OCULTA]",
      })

      // Simular cadastro no banco
      await new Promise((resolve) => setTimeout(resolve, 2000))

      alert(`${t.register.registerInsurance}!\nAPI Key: ${apiKey}\n\n⚠️ Guarde esta chave com segurança!`)

      // Redirecionar para login
      window.location.href = "/login"
    } catch (error) {
      console.error("Erro no cadastro:", error)
      alert(t.errors.unknownError)
    } finally {
      setCarregando(false)
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
          <p className="text-gray-600 mt-2">{t.register.title}</p>
        </div>

        <Tabs defaultValue="usuario" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="usuario">{t.nav.register}</TabsTrigger>
            <TabsTrigger value="seguradora">{t.register.insuranceRegister}</TabsTrigger>
          </TabsList>

          <TabsContent value="usuario">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5" />
                  {t.register.userRegister}
                </CardTitle>
                <CardDescription>{t.register.createAccount}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCadastroUsuario} className="space-y-4">
                  <div>
                    <Label htmlFor="nome">{t.register.fullName}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="nome"
                        value={dadosUsuario.nome}
                        onChange={(e) => setDadosUsuario((prev) => ({ ...prev, nome: e.target.value }))}
                        placeholder={t.register.fullName}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cpf">{t.register.cpf}</Label>
                      <Input
                        id="cpf"
                        value={dadosUsuario.cpf}
                        onChange={(e) => setDadosUsuario((prev) => ({ ...prev, cpf: e.target.value }))}
                        placeholder="000.000.000-00"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="dataNascimento">{t.register.birthDate}</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="dataNascimento"
                          type="date"
                          value={dadosUsuario.dataNascimento}
                          onChange={(e) => setDadosUsuario((prev) => ({ ...prev, dataNascimento: e.target.value }))}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">{t.register.email}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={dadosUsuario.email}
                        onChange={(e) => setDadosUsuario((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder={t.register.email}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="telefone">{t.register.phone}</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="telefone"
                        value={dadosUsuario.telefone}
                        onChange={(e) => setDadosUsuario((prev) => ({ ...prev, telefone: e.target.value }))}
                        placeholder="(11) 99999-9999"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="senha">{t.register.password}</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="senha"
                          type="password"
                          value={dadosUsuario.senha}
                          onChange={(e) => setDadosUsuario((prev) => ({ ...prev, senha: e.target.value }))}
                          placeholder={t.register.password}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="confirmarSenha">{t.register.confirmPassword}</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="confirmarSenha"
                          type="password"
                          value={dadosUsuario.confirmarSenha}
                          onChange={(e) => setDadosUsuario((prev) => ({ ...prev, confirmarSenha: e.target.value }))}
                          placeholder={t.register.confirmPassword}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="termos" checked={aceitouTermos} onCheckedChange={setAceitouTermos} />
                    <Label htmlFor="termos" className="text-sm">
                      {t.register.acceptTerms}{" "}
                      <Link href="/termos" className="text-blue-600 hover:underline">
                        {t.register.termsOfUse}
                      </Link>{" "}
                      e{" "}
                      <Link href="/privacidade" className="text-blue-600 hover:underline">
                        {t.register.privacyPolicy}
                      </Link>
                    </Label>
                  </div>

                  <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800" disabled={carregando}>
                    {carregando ? t.register.creating : t.register.createAccount}
                  </Button>
                </form>

                <div className="mt-4 text-center">
                  <Link href="/login" className="text-sm text-blue-600 hover:underline">
                    {t.register.alreadyHaveAccount}
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="seguradora">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  {t.register.insuranceRegister}
                </CardTitle>
                <CardDescription>{t.register.insuranceRegister}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCadastroSeguradora} className="space-y-4">
                  <div>
                    <Label htmlFor="nomeEmpresa">{t.register.companyName}</Label>
                    <Input
                      id="nomeEmpresa"
                      value={dadosSeguradora.nomeEmpresa}
                      onChange={(e) => setDadosSeguradora((prev) => ({ ...prev, nomeEmpresa: e.target.value }))}
                      placeholder={t.register.companyName}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="cnpj">{t.register.cnpj}</Label>
                    <Input
                      id="cnpj"
                      value={dadosSeguradora.cnpj}
                      onChange={(e) => setDadosSeguradora((prev) => ({ ...prev, cnpj: e.target.value }))}
                      placeholder="00.000.000/0000-00"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="responsavel">{t.register.technicalResponsible}</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="responsavel"
                        value={dadosSeguradora.responsavel}
                        onChange={(e) => setDadosSeguradora((prev) => ({ ...prev, responsavel: e.target.value }))}
                        placeholder={t.register.technicalResponsible}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="emailSeguradora">{t.register.corporateEmail}</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="emailSeguradora"
                        type="email"
                        value={dadosSeguradora.email}
                        onChange={(e) => setDadosSeguradora((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="contato@seguradora.com.br"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="telefoneSeguradora">{t.register.phone}</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="telefoneSeguradora"
                        value={dadosSeguradora.telefone}
                        onChange={(e) => setDadosSeguradora((prev) => ({ ...prev, telefone: e.target.value }))}
                        placeholder="(11) 3333-4444"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="senhaSeguradora">{t.register.password}</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="senhaSeguradora"
                          type="password"
                          value={dadosSeguradora.senha}
                          onChange={(e) => setDadosSeguradora((prev) => ({ ...prev, senha: e.target.value }))}
                          placeholder={t.register.password}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="confirmarSenhaSeguradora">{t.register.confirmPassword}</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="confirmarSenhaSeguradora"
                          type="password"
                          value={dadosSeguradora.confirmarSenha}
                          onChange={(e) => setDadosSeguradora((prev) => ({ ...prev, confirmarSenha: e.target.value }))}
                          placeholder={t.register.confirmPassword}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="termosSeguradora" checked={aceitouTermos} onCheckedChange={setAceitouTermos} />
                    <Label htmlFor="termosSeguradora" className="text-sm">
                      {t.register.acceptTerms}{" "}
                      <Link href="/termos" className="text-blue-600 hover:underline">
                        {t.register.termsOfUse}
                      </Link>{" "}
                      e{" "}
                      <Link href="/privacidade" className="text-blue-600 hover:underline">
                        {t.register.privacyPolicy}
                      </Link>
                    </Label>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium mb-1">{t.register.afterRegistration}</p>
                        <ul className="list-disc list-inside space-y-1 text-xs">
                          {t.register.afterRegistrationList.map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800" disabled={carregando}>
                    {carregando ? t.register.registering : t.register.registerInsurance}
                  </Button>
                </form>

                <div className="mt-4 text-center">
                  <Link href="/login" className="text-sm text-blue-600 hover:underline">
                    {t.register.alreadyHaveAccount}
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
