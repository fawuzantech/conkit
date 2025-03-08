"use client"

import { Suspense } from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { BarChart } from "@/components/ui/chart"
import Link from "next/link"
import SearchResults from "@/components/search-results"
import { SearchResultsSkeleton } from "@/components/search-results-skeleton"

// Types
interface SearchResult {
  id: string
  title: string
  url: string
  description: string
}

interface ContentGap {
  gap: string
  score: number
}

export default function ResultsPage({
  searchParams,
}: {
  searchParams: { q: string }
}) {
  const query = searchParams.q || ""

  const [isGapSheetOpen, setIsGapSheetOpen] = useState(false)
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false)
  const [gapIdea, setGapIdea] = useState("")
  const [blogPost, setBlogPost] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  // Generate dynamic content gaps based on the search query
  const generateContentGaps = (query: string): ContentGap[] => {
    // Base keywords that can be combined with the query
    const baseKeywords = [
      "beginners guide to",
      "advanced strategies for",
      "affordable",
      "premium",
      "sustainable",
      "quick",
      "comprehensive",
      "ultimate",
      "budget-friendly",
      "professional",
    ]

    // Content types
    const contentTypes = [
      "guide",
      "tutorial",
      "tips",
      "strategies",
      "examples",
      "case studies",
      "tools",
      "resources",
      "checklist",
      "templates",
    ]

    // Generate a seed from the query for consistent but different results per query
    const querySeed = query.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)

    // Function to get a pseudo-random number between min and max based on seed and index
    const getRandomNumber = (min: number, max: number, index: number) => {
      const seed = querySeed + index
      return min + (seed % (max - min + 1))
    }

    // Generate 5 unique content gaps
    const gaps: ContentGap[] = []

    for (let i = 0; i < 5; i++) {
      const keywordIndex = getRandomNumber(0, baseKeywords.length - 1, i)
      const contentTypeIndex = getRandomNumber(0, contentTypes.length - 1, i + 10)

      // Create a gap title by combining elements
      let gapTitle = ""

      // Different formats based on index for variety
      if (i % 3 === 0) {
        gapTitle = `${baseKeywords[keywordIndex]} ${query} ${contentTypes[contentTypeIndex]}`
      } else if (i % 3 === 1) {
        gapTitle = `${query} ${contentTypes[contentTypeIndex]} for ${baseKeywords[keywordIndex].replace(" for", "")}`
      } else {
        gapTitle = `${contentTypes[contentTypeIndex]} about ${baseKeywords[keywordIndex]} ${query}`
      }

      // Generate a score between 5 and 9
      const score = getRandomNumber(5, 9, i + 20)

      gaps.push({
        gap: gapTitle,
        score,
      })
    }

    // Sort by score descending
    return gaps.sort((a, b) => b.score - a.score)
  }

  const contentGaps = generateContentGaps(query)

  const handleGenerateBlogPost = async () => {
    if (!gapIdea.trim()) return

    setIsGenerating(true)
    try {
      const response = await fetch("/api/generate-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: gapIdea }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate blog post")
      }

      const data = await response.json()
      setBlogPost(data.content)
    } catch (error) {
      console.error("Error generating blog post:", error)
      setBlogPost("Sorry, there was an error generating the blog post. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-primary hover:underline">
          Back to Search
        </Link>
        <ThemeToggle />
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Results for "{query}"</h1>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={() => setIsGapSheetOpen(true)} variant="outline">
              Find Gaps
            </Button>
            <Button onClick={() => setIsBlogModalOpen(true)}>Write Blog Post</Button>
          </div>
        </div>

        <Suspense fallback={<SearchResultsSkeleton />}>
          <SearchResults query={query} />
        </Suspense>

        {/* Content Gaps Sheet */}
        <Sheet open={isGapSheetOpen} onOpenChange={setIsGapSheetOpen}>
          <SheetContent className="sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Content Gap Analysis</SheetTitle>
              <SheetDescription>Discover potential content gaps related to your search.</SheetDescription>
            </SheetHeader>
            <div className="py-6">
              <div className="h-80">
                <BarChart
                  data={contentGaps.map((gap) => ({
                    name: gap.gap,
                    value: gap.score,
                  }))}
                  index="name"
                  categories={["value"]}
                  colors={["blue"]}
                  valueFormatter={(value) => `${value}/10`}
                  yAxisWidth={48}
                />
              </div>
              <div className="mt-6 space-y-4">
                <h3 className="font-medium">Gap Opportunities</h3>
                <ul className="space-y-2">
                  {contentGaps.map((gap, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <span>{gap.gap}</span>
                      <span className="font-medium">{gap.score}/10</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Blog Post Generation Modal */}
        <Dialog open={isBlogModalOpen} onOpenChange={setIsBlogModalOpen}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Generate Blog Post</DialogTitle>
              <DialogDescription>Enter a content gap idea to generate a Neil Patel-style blog post.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="gap-idea">Enter your gap idea</Label>
                <Input
                  id="gap-idea"
                  value={gapIdea}
                  onChange={(e) => setGapIdea(e.target.value)}
                  placeholder="e.g., eco-travel for seniors"
                />
              </div>
              {blogPost && (
                <div className="grid gap-2 mt-4">
                  <Label htmlFor="blog-post">Generated Blog Post</Label>
                  <Textarea id="blog-post" value={blogPost} readOnly className="h-[400px] font-mono text-sm" />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={handleGenerateBlogPost} disabled={isGenerating || !gapIdea.trim()}>
                {isGenerating ? "Generating..." : "Generate"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </main>
  )
}

