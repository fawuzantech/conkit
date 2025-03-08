import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { topic } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 })
    }

    const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY

    if (!TOGETHER_API_KEY) {
      return NextResponse.json({ error: "Together API key is not configured" }, { status: 500 })
    }

    console.log("Generating blog post for topic:", topic)
    console.log("Using Together API key:", TOGETHER_API_KEY.substring(0, 5) + "...")

    const response = await fetch("https://api.together.xyz/v1/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOGETHER_API_KEY}`,
      },
      body: JSON.stringify({
        model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
        prompt: `Write a comprehensive Neil Patel-style blog post about "${topic}". 
        Include an introduction, why it matters, key strategies, common mistakes, and a conclusion. 
        Format the post in Markdown with headers and bullet points where appropriate.`,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Together AI API error:", errorText)
      return NextResponse.json(
        { error: "Failed to generate blog post", details: errorText },
        { status: response.status },
      )
    }

    const data = await response.json()
    console.log("Blog post generated successfully")

    // Check the structure of the response
    if (!data.choices || !data.choices[0] || !data.choices[0].text) {
      console.error("Unexpected API response structure:", JSON.stringify(data))
      return NextResponse.json(
        {
          error: "Unexpected API response structure",
          details: JSON.stringify(data),
        },
        { status: 500 },
      )
    }

    return NextResponse.json({ content: data.choices[0].text })
  } catch (error) {
    console.error("Error generating blog post:", error)
    return NextResponse.json(
      {
        error: "Failed to generate blog post",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

