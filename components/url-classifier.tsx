"use client"

import type React from "react"

import { useState } from "react"
import { Shield, ShieldAlert, ShieldCheck, ShieldX, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type ClassificationType = "Malware" | "Phishing" | "Defacement" | "Benign" | null

interface ClassificationResult {
  type: ClassificationType
  confidence: number
  description: string
}

export function UrlClassifier() {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ClassificationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url) {
      setError("Please enter a URL")
      return
    }

    try {
      setError(null)
      setResult(null)
      setIsLoading(true)

      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || "Failed to analyze URL")
      }

      const data = await response.json()

      setResult({
        type: data.type,
        confidence: data.confidence,
        description: data.description,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while analyzing the URL. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const getResultColor = (type: ClassificationType) => {
    switch (type) {
      case "Malware":
        return "bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300"
      case "Phishing":
        return "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
      case "Defacement":
        return "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300"
      case "Benign":
        return "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300"
      default:
        return "bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
    }
  }

  const getBadgeColor = (type: ClassificationType) => {
    switch (type) {
      case "Malware":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "Phishing":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
      case "Defacement":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "Benign":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return ""
    }
  }

  const getResultIcon = (type: ClassificationType) => {
    switch (type) {
      case "Malware":
        return <ShieldX className="h-12 w-12 text-red-500" />
      case "Phishing":
        return <ShieldAlert className="h-12 w-12 text-amber-500" />
      case "Defacement":
        return <ShieldAlert className="h-12 w-12 text-orange-500" />
      case "Benign":
        return <ShieldCheck className="h-12 w-12 text-green-500" />
      default:
        return <Shield className="h-12 w-12 text-slate-500" />
    }
  }

  return (
    <div className="space-y-8">
      <Card className="border-slate-200 shadow-lg dark:border-slate-800">
        <CardHeader>
          <CardTitle>URL Analysis</CardTitle>
          <CardDescription>Enter a URL to check if it's malicious or safe</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Input
                type="text"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="h-12"
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
            <Button type="submit" className="w-full h-12" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing URL...
                </>
              ) : (
                "Analyze URL"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="relative h-24 w-24">
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield className="h-16 w-16 text-slate-300 dark:text-slate-700" />
            </div>
            <div className="absolute inset-0">
              <svg className="h-24 w-24 animate-spin" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  className="text-slate-200 dark:text-slate-800"
                />
                <path
                  d="M 50 5 A 45 45 0 0 1 95 50"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  className="text-slate-500"
                />
              </svg>
            </div>
          </div>
          <p className="mt-4 text-lg font-medium text-slate-700 dark:text-slate-300">Analyzing URL security...</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Checking for malware, phishing, and other threats
          </p>
        </div>
      )}

      {result && !isLoading && (
        <Card
          className={cn(
            "border-2 shadow-lg transition-all duration-300",
            result.type === "Benign" ? "border-green-200 dark:border-green-800" : "border-red-200 dark:border-red-800",
          )}
        >
          <CardHeader className={cn("rounded-t-lg", getResultColor(result.type))}>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl">Analysis Result</CardTitle>
              <Badge className={getBadgeColor(result.type)}>{result.type}</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              {getResultIcon(result.type)}
              <div>
                <h3 className="text-xl font-semibold">
                  {result.type === "Benign" ? "Safe URL Detected" : "Threat Detected"}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">{result.description}</p>
              </div>
            </div>
            <div className="mt-6">
              <div className="mb-2 flex justify-between text-sm">
                <span>Confidence Score</span>
                <span className="font-medium">{(result.confidence * 100).toFixed(1)}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className={cn("h-full rounded-full", result.type === "Benign" ? "bg-green-500" : "bg-red-500")}
                  style={{ width: `${result.confidence * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t bg-slate-50 dark:bg-slate-900">
            <div className="w-full text-center text-sm text-slate-500 dark:text-slate-400">
              URL analyzed: <span className="font-mono">{url}</span>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
