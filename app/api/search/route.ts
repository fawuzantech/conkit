import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
  }

  try {
    const BRAVE_API_KEY = process.env.BRAVE_API_KEY

    if (!BRAVE_API_KEY) {
      return NextResponse.json({ error: "Brave API key is not configured" }, { status: 500 })
    }

    const response = await fetch(`https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(query)}`, {
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip",
        "X-Subscription-Token": BRAVE_API_KEY,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Brave Search API error:", errorText)
      return NextResponse.json({ error: "Failed to fetch search results from Brave" }, { status: response.status })
    }

    const data = await response.json()

    // Transform Brave API response to match our expected format
    const results =
      data.web?.results?.map((result: any, index: number) => ({
        id: index.toString(),
        title: result.title,
        url: result.url,
        description: result.description,
      })) || []

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Error fetching search results:", error)
    return NextResponse.json({ error: "Failed to fetch search results" }, { status: 500 })
  }
}

