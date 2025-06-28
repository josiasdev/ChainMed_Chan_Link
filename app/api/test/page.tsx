"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function APITestPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const testAPI = async (type: "hash" | "cpf", value: string) => {
    setLoading(true)
    setError("")
    setResult(null)

    try {
      const params = new URLSearchParams()
      params.append(type, value)

      const response = await fetch(`/api/consulta?${params}`, {
        headers: {
          "x-api-key": "sk_test_1234567890abcdef",
        },
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
      } else {
        setError(data.error || "API Error")
      }
    } catch (err) {
      setError("Network error: " + (err instanceof Error ? err.message : "Unknown"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">API Test Page</h1>

      <div className="grid gap-4 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Test by Hash</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => testAPI("hash", "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456")}
              disabled={loading}
            >
              Test João Silva Santos
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test by CPF</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => testAPI("cpf", "12345678901")} disabled={loading}>
              Test CPF 12345678901
            </Button>
          </CardContent>
        </Card>
      </div>

      {loading && (
        <Card>
          <CardContent className="p-4">
            <p>Loading...</p>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="border-red-200">
          <CardContent className="p-4">
            <Badge variant="destructive">Error</Badge>
            <p className="mt-2 text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>API Response</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">{JSON.stringify(result, null, 2)}</pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
