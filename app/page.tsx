"use client"

import { Shield, Users, FileText, Lock } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function HomePage() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">{t.homepage.subtitle}</span>
          </div>
          <nav className="flex items-center space-x-4">
            <LanguageSwitcher />
            <Link href="/login">
              <Button className="bg-black text-white hover:bg-gray-800">{t.nav.login}</Button>
            </Link>
            <Link href="/cadastro">
              <Button className="bg-black text-white hover:bg-gray-800">{t.nav.register}</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          {t.homepage.title.split(" ").slice(0, -1).join(" ")}{" "}
          <span className="text-blue-600">{t.homepage.title.split(" ").slice(-1)}</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">{t.homepage.description}</p>
        <div className="flex justify-center space-x-4">
          <Link href="/dps/novo">
            <Button size="lg" className="bg-black text-white hover:bg-gray-800">
              <FileText className="mr-2 h-5 w-5" />
              {t.homepage.fillDPS}
            </Button>
          </Link>
          <Link href="/seguradora">
            <Button size="lg" className="bg-black text-white hover:bg-gray-800">
              <Users className="mr-2 h-5 w-5" />
              {t.homepage.insuranceAccess}
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Shield className="h-12 w-12 text-blue-600 mb-4" />
              <CardTitle>{t.homepage.blockchainSecurity}</CardTitle>
              <CardDescription>{t.homepage.blockchainSecurityDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{t.homepage.blockchainSecurityText}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Lock className="h-12 w-12 text-green-600 mb-4" />
              <CardTitle>{t.homepage.antiFraud}</CardTitle>
              <CardDescription>{t.homepage.antiFraudDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{t.homepage.antiFraudText}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Users className="h-12 w-12 text-purple-600 mb-4" />
              <CardTitle>{t.homepage.familyManagement}</CardTitle>
              <CardDescription>{t.homepage.familyManagementDesc}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{t.homepage.familyManagementText}</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Shield className="h-6 w-6" />
            <span className="text-xl font-bold">{t.homepage.subtitle}</span>
          </div>
          <p className="text-gray-400">{t.homepage.footer}</p>
        </div>
      </footer>
    </div>
  )
}
