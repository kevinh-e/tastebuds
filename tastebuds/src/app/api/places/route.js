import { NextResponse } from "next/server"

export async function POST(request) {
  try {
    const body = await request.json()

    // Get API key from environment variable
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Google Maps API key is not configured" }, { status: 500 })
    }

    const apiUrl = "https://places.googleapis.com/v1/places:searchText"

    console.log("Making request to Google Places API:", apiUrl)
    console.log("Request body:", body)

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "*",
      },
      body: JSON.stringify(body),
    })

    // Log response status for debugging
    console.log("Google API response status:", response.status, response.statusText)

    // Check content type to handle non-JSON responses
    const contentType = response.headers.get("content-type")
    console.log("Response content type:", contentType)

    if (!response.ok) {
      // Handle non-JSON error responses
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text()
        console.error("Non-JSON error response:", textResponse)
        return NextResponse.json(
          {
            error: "Google Places API returned a non-JSON response",
            status: response.status,
            statusText: response.statusText,
            contentType,
            responsePreview: textResponse.substring(0, 500), // First 500 chars for debugging
          },
          { status: 500 },
        )
      }

      // Handle JSON error responses
      const errorData = await response.json()
      return NextResponse.json({ error: "Google Places API error", details: errorData }, { status: response.status })
    }

    // Parse successful JSON response
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json()
      return NextResponse.json(data)
    } else {
      const textResponse = await response.text()
      console.error("Unexpected non-JSON response on success:", textResponse)
      return NextResponse.json(
        { error: "Received non-JSON response from Google API", responsePreview: textResponse.substring(0, 500) },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in places API route:", error)
    return NextResponse.json(
      { error: "Internal server error", message: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}

