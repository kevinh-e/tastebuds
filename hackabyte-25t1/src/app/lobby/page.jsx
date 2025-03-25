"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Plus, X, Share2 } from "lucide-react"
import Link from "next/link"
import PreferencesList from "@/components/lobby/preferences-list"
import UsersList from "@/components/lobby/users-list"
import AddPreferenceForm from "@/components/lobby/add-preference-form"
import { trackFallbackParamAccessed } from "next/dist/server/app-render/dynamic-rendering"

// Mock data for demonstration
const mockUsers = [
  {
    id: "1",
    name: "Marques",
    // Price range: $, $$, $$$, $$$$
    price: [false, false, true, true],
    cuisines: ["Italian", "Japanese"],
    locations: ["Kensington", "Kingsford"],
  },
  {
    id: "2",
    name: "Drake",
    price: [true, true, true, false],
    cuisines: ["Mexican", "Thai"],
    locations: ["Randwick"],
  },
  {
    id: "3",
    name: "Lebron",
    price: [true, true, true, true],
    cuisines: ["Chinese"],
    locations: [],
  },
]

export default function LobbyPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userName = searchParams.get("name") || "Guest"
  const groupId = searchParams.get("groupId") || "UNKNOWN"

  const [users, setUsers] = useState(mockUsers)
  const [currentUser, setCurrentUser] = useState({
    id: "current",
    name: userName,
    cuisines: [],
    locations: [],
  })
  const [showCuisineForm, setShowCuisineForm] = useState(false)
  const [showLocationForm, setShowLocationForm] = useState(false)

  // Add current user to the list
  useEffect(() => {
    setUsers([...mockUsers, currentUser])
  }, [currentUser])

  const handleSubmit = async (e) => {
    // Prevent the page from refreshing
    e.preventDefault();

    // Combine the strings of cuisines and locations into a single string
    let searchQuery = "";
    let locationsProvided = false;
    users.forEach((user) => {
      user.cuisines.forEach((cuisine) => {
        searchQuery += cuisine + " ";
      });
      if (user.locations.length > 0) {
        locationsProvided = true;
      }
    })
    if (locationsProvided === true) {
      searchQuery += "located in ";
      users.forEach((user) => {
        user.locations.forEach((location) => {
          searchQuery += location + " ";
        });
      })
    }

    const response = await fetch("/api/places", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ textQuery: searchQuery }),
    })

    const searchApiResponse = await response.json()

    console.log(searchApiResponse);
  }

  const shareGroup = () => {
    if (navigator.share) {
      navigator.share({
        title: "Join my FoodMates group!",
        text: `Join my group with code: ${groupId}`,
        url: window.location.href,
      })
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(`Join my FoodMates group with code: ${groupId}`)
      alert("Group code copied to clipboard!")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="container max-w-md mx-auto px-4 py-8">
      <div className="container max-w-md mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Link href="/" className="flex items-center text-sm">
            <ChevronLeft className="h-4 w-4 mr-1" /> Exit
          </Link>
          <Button variant="outline" size="sm" onClick={shareGroup} className="flex items-center gap-1">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Group Lobby</CardTitle>
            <CardDescription>Group Code: {groupId}</CardDescription>
          </CardHeader>
          <CardContent>
            <UsersList users={users} currentUserId={currentUser.id} />
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Cuisine Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <PreferencesList users={users} preferenceType="cuisines" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Location Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <PreferencesList users={users} preferenceType="locations" />
          </CardContent>
        </Card>

        <Button type="submit" className="w-full mt-6">
          Start Matching
        </Button>
      </div>
    </form>
  )
}

