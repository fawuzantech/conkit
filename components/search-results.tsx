"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { BarChart } from "@/components/ui/chart"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Copy, Download, ExternalLink, Loader, Save, ThumbsUp } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

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

export default function SearchResults({ query }: { query: string }) {
  const router = useRouter()
  const [isGapSheetOpen, setIsGapSheetOpen] = useState(false)
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false)
  const [gapIdea, setGapIdea] = useState("")
  const [blogPost, setBlogPost] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [savedGaps, setSavedGaps] = useState<ContentGap[]>([])
  const [activeTab, setActiveTab] = useState("results")
  const [generationError, setGenerationError] = useState<string | null>(null)

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

  const { data: results = [], isError } = useQuery<SearchResult[]>({
    queryKey: ["search", query],
    queryFn: async () => {
      if (!query) {
        router.push("/")
        return []
      }

      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      if (!response.ok) {
        throw new Error("Failed to fetch search results")
      }
      const data = await response.json()
      return data.results || []
    },
  })

  const handleGenerateBlogPost = async () => {
    if (!gapIdea.trim()) return

    setIsGenerating(true)
    setGenerationError(null)
    setBlogPost("")

    try {
      console.log("Sending request to generate blog post for:", gapIdea)

      const response = await fetch("/api/generate-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: gapIdea }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error("Error response:", data)
        throw new Error(data.error || "Failed to generate blog post")
      }

      if (!data.content) {
        throw new Error("No content returned from API")
      }

      console.log("Blog post generated successfully")
      setBlogPost(data.content)
      toast({
        title: "Blog post generated",
        description: "Your blog post has been generated successfully",
      })
    } catch (error) {
      console.error("Error generating blog post:", error)
      setGenerationError(error instanceof Error ? error.message : "Failed to generate blog post")
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate blog post",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleUseGapIdea = (gap: string) => {
    setGapIdea(gap)
    setIsGapSheetOpen(false)
    setIsBlogModalOpen(true)
  }

  const handleSaveGap = (gap: ContentGap) => {
    if (!savedGaps.some((savedGap) => savedGap.gap === gap.gap)) {
      setSavedGaps([...savedGaps, gap])
      toast({
        title: "Gap saved",
        description: "Content gap has been saved to your list",
      })
    } else {
      toast({
        title: "Already saved",
        description: "This content gap is already in your saved list",
        variant: "destructive",
      })
    }
  }

  const handleCopyBlogPost = () => {
    navigator.clipboard.writeText(blogPost)
    toast({
      title: "Copied to clipboard",
      description: "Blog post content has been copied to your clipboard",
    })
  }

  const handleDownloadBlogPost = () => {
    const element = document.createElement("a")
    const file = new Blob([blogPost], { type: "text/markdown" })
    element.href = URL.createObjectURL(file)
    element.download = `${gapIdea.replace(/\s+/g, "-").toLowerCase()}.md`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)

    toast({
      title: "Blog post downloaded",
      description: "Your blog post has been downloaded as a Markdown file",
    })
  }

  if (isError) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Error loading results</h2>
        <p className="text-muted-foreground mb-6">There was a problem fetching search results. Please try again.</p>
        <Button onClick={() => router.push("/")}>Return to Search</Button>
      </div>
    )
  }

  return (
    <>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="results">Search Results</TabsTrigger>
            <TabsTrigger value="gaps">Content Gaps</TabsTrigger>
            {savedGaps.length > 0 && (
              <TabsTrigger value="saved">
                Saved Gaps
                <Badge variant="secondary" className="ml-2">
                  {savedGaps.length}
                </Badge>
              </TabsTrigger>
            )}
          </TabsList>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={() => setIsGapSheetOpen(true)} variant="outline">
              Find Gaps
            </Button>
            <Button onClick={() => setIsBlogModalOpen(true)}>Write Blog Post</Button>
          </div>
        </div>

        <TabsContent value="results" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((result) => (
              <Card key={result.id} className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg">{result.title}</CardTitle>
                  <p className="text-sm text-muted-foreground truncate">{result.url}</p>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm">{result.description}</p>
                </CardContent>
                <CardFooter className="pt-2">
                  <a
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-sm flex items-center hover:underline"
                  >
                    Visit website <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="gaps" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {contentGaps.map((gap, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span className="mr-2">{gap.gap}</span>
                    <Badge>{gap.score}/10</Badge>
                  </CardTitle>
                </CardHeader>
                <CardFooter className="flex justify-between pt-2">
                  <Button variant="outline" size="sm" onClick={() => handleSaveGap(gap)}>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                  <Button size="sm" onClick={() => handleUseGapIdea(gap.gap)}>
                    Write Blog
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {savedGaps.length > 0 && (
          <TabsContent value="saved" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedGaps.map((gap, index) => (
                <Card key={index} className="h-full">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span className="mr-2">{gap.gap}</span>
                      <Badge>{gap.score}/10</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardFooter className="flex justify-end pt-2">
                    <Button size="sm" onClick={() => handleUseGapIdea(gap.gap)}>
                      Write Blog
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        )}
      </Tabs>

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
              <ul className="space-y-4">
                {contentGaps.map((gap, index) => (
                  <li key={index} className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{gap.gap}</span>
                      <Badge>{gap.score}/10</Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="w-full" onClick={() => handleSaveGap(gap)}>
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </Button>
                      <Button size="sm" className="w-full" onClick={() => handleUseGapIdea(gap.gap)}>
                        Write Blog
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Blog Post Generation Modal */}
      <Dialog open={isBlogModalOpen} onOpenChange={setIsBlogModalOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
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

            {!blogPost && !isGenerating && (
              <Button onClick={handleGenerateBlogPost} disabled={isGenerating || !gapIdea.trim()} className="mt-2">
                Generate
              </Button>
            )}

            {isGenerating && (
              <div className="flex items-center justify-center py-8">
                <Loader className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2">Generating your blog post...</p>
              </div>
            )}

            {generationError && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-md">
                <p className="font-medium">Error generating blog post:</p>
                <p>{generationError}</p>
              </div>
            )}

            {blogPost && (
              <div className="grid gap-2 mt-4">
                <div className="flex justify-between items-center">
                  <Label htmlFor="blog-post">Generated Blog Post</Label>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopyBlogPost}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDownloadBlogPost}>
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
                <Textarea id="blog-post" value={blogPost} readOnly className="h-[400px] font-mono text-sm" />
                <div className="flex justify-between items-center mt-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setBlogPost("")
                      setGenerationError(null)
                    }}
                  >
                    Create New
                  </Button>
                  <Button
                    variant="default"
                    onClick={() => {
                      toast({
                        title: "Blog post saved",
                        description: "Your blog post has been saved successfully",
                      })
                    }}
                  >
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    Save Blog Post
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Toaster />
    </>
  )
}

