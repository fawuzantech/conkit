"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { useRouter } from "next/navigation"
import { ArrowRight, Search, Sparkles } from "lucide-react"

export default function Home() {
  const [keyword, setKeyword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!keyword.trim()) return

    setIsLoading(true)
    router.push(`/results?q=${encodeURIComponent(keyword)}`)
  }

  return (
    <main className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-4 flex justify-end">
        <ThemeToggle />
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 md:py-32">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
          <div className="absolute top-2/3 left-2/3 w-48 h-48 bg-accent/10 rounded-full blur-3xl"></div>
        </div>

        <div className="container relative mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-muted px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Powered by Brave Search & Together AI</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Content Creator Tool
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Discover content gaps and generate professional blog posts with AI
          </p>

          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Enter keyword to search..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>
              <Button type="submit" className="h-12 px-6 text-lg" disabled={isLoading || !keyword.trim()}>
                {isLoading ? "Searching..." : "Search"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </form>

          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-card p-6 rounded-lg shadow-sm border border-border/50">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">Smart Search</h3>
              <p className="text-muted-foreground">Find relevant content with Brave Search's powerful API</p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-sm border border-border/50">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                  <path d="M4 22h16"></path>
                  <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                  <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                  <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Gap Analysis</h3>
              <p className="text-muted-foreground">Identify content opportunities with our gap analysis tool</p>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-sm border border-border/50">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-primary"
                >
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <path d="M10 13v-1h1v1"></path>
                  <path d="M14 13h-3"></path>
                  <path d="M10 17v-1h1v1"></path>
                  <path d="M14 17h-3"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">AI Content</h3>
              <p className="text-muted-foreground">Generate professional blog posts with Together AI's Mixtral model</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

