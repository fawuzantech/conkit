"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

// Dummy blog post content
const dummyBlogPost = `
# How to Make Delicious Vegan Desserts at Home

Vegan desserts have come a long way in recent years, with innovative recipes that rival traditional treats in taste and texture. Whether you're a committed vegan or simply looking to reduce your consumption of animal products, these plant-based desserts will satisfy your sweet tooth without compromising on flavor.

## Why Choose Vegan Desserts?

Vegan desserts offer several benefits:

- **Health benefits**: Often lower in saturated fat and cholesterol
- **Environmental impact**: Reduced carbon footprint compared to dairy-based desserts
- **Inclusive options**: Perfect for guests with various dietary restrictions
- **Creative cooking**: Opportunity to experiment with new ingredients and techniques

## Essential Ingredients for Vegan Baking

Before diving into recipes, stock your pantry with these vegan baking essentials:

1. **Plant-based milks**: Almond, oat, soy, or coconut milk
2. **Egg replacers**: Flaxseed meal, applesauce, or commercial egg replacers
3. **Vegan butter**: Plant-based butter alternatives
4. **Natural sweeteners**: Maple syrup, agave nectar, or coconut sugar
5. **Dark chocolate**: Many high-quality dark chocolates are naturally vegan

## Simple Vegan Dessert Recipes to Try

### Chocolate Avocado Mousse

This silky, rich mousse uses avocado as a base for a healthy yet decadent treat.

### Coconut Milk Ice Cream

Creamy and satisfying, coconut milk makes an excellent base for dairy-free ice cream in any flavor.

### Aquafaba Meringues

The liquid from canned chickpeas (aquafaba) whips up just like egg whites for light, crispy meringues.

## Tips for Successful Vegan Baking

- Allow extra time for plant-based milks to curdle when making "buttermilk"
- Don't overmix batters containing gluten-free flours
- Chill coconut cream thoroughly before whipping
- Use a kitchen scale for precise measurements

With these tips and recipes, you'll be creating delicious vegan desserts that everyone will enjoy, regardless of their dietary preferences.
`

export default function BlogPage() {
  const [keyword, setKeyword] = useState("")
  const [blogPost, setBlogPost] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const searchParams = useSearchParams()

  useEffect(() => {
    const keywordParam = searchParams.get("keyword")
    if (keywordParam) {
      setKeyword(keywordParam)
    }
  }, [searchParams])

  const generateBlogPost = () => {
    if (!keyword.trim()) return

    setIsGenerating(true)

    // Simulate API call with timeout
    setTimeout(() => {
      setBlogPost(dummyBlogPost)
      setIsGenerating(false)
    }, 1500)
  }

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/results" className="text-primary hover:underline">
          Back to Results
        </Link>
        <ThemeToggle />
      </div>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Blog Post Generator</h1>

        <div className="space-y-4 mb-8">
          <Textarea
            placeholder="Enter content gap title or keyword"
            className="min-h-[100px]"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Button onClick={generateBlogPost} disabled={isGenerating || !keyword.trim()} className="w-full">
            {isGenerating ? "Generating..." : "Generate Blog Post"}
          </Button>
        </div>

        {blogPost && (
          <div className="mt-8 prose dark:prose-invert max-w-none">
            <div
              dangerouslySetInnerHTML={{
                __html: blogPost
                  .replace(/\n/g, "<br>")
                  .replace(/^## (.*$)/gm, "<h2>$1</h2>")
                  .replace(/^# (.*$)/gm, "<h1>$1</h1>")
                  .replace(/^### (.*$)/gm, "<h3>$1</h3>")
                  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>"),
              }}
            />
          </div>
        )}
      </div>
    </main>
  )
}

