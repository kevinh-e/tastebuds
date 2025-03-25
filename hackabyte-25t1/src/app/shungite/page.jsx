"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PlacesSearch() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSearch = async () => {
    if (!query.trim()) return

    setLoading(true)
    setError("")
    try {
      const response = await fetch("/api/places", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
        textQuery: query,
        pageSize: 10,
      }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch places")
      }

      setResults(data.places || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">Google Places Search</h1>

      <div className="flex gap-2 mb-6">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g., Spicy Vegetarian Food in Sydney, Australia"
          className="flex-1"
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>

      {error && <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">{error}</div>}

      {results.length > 0 ? (
        <div className="grid gap-4">
          {results.map((place, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{place.displayName?.text || "Unnamed Place"}</CardTitle>
                <CardDescription>
                  Price Level: {place.priceLevel ? "💰".repeat(place.priceLevel) : "N/A"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>{place.formattedAddress || "No address available"}</p>
                {console.log(place)}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        !loading &&
        !error && <div className="text-center text-gray-500 py-8">Search for places to see results here</div>
      )}
    </div>
  )
}

