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

// Mock data for demonstration
const mockUsers = [
  {
    id: "1",
    name: "Alex",
    cuisines: ["Italian", "Japanese"],
    locations: ["Downtown", "Westside"],
  },
  {
    id: "2",
    name: "Sam",
    cuisines: ["Mexican", "Thai"],
    locations: ["Eastside"],
  },
  {
    id: "3",
    name: "Jordan",
    cuisines: ["Indian", "Chinese"],
    locations: ["Midtown", "Uptown"],
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

  const onSubmit = (data) => {
    console.log("Button Pressed");
  }

  const addCuisine = (cuisine) => {
    if (!currentUser.cuisines.includes(cuisine)) {
      setCurrentUser({
        ...currentUser,
        cuisines: [...currentUser.cuisines, cuisine],
      })
    }
    setShowCuisineForm(false)
  }

  const removeCuisine = (cuisine) => {
    setCurrentUser({
      ...currentUser,
      cuisines: currentUser.cuisines.filter((c) => c !== cuisine),
    })
  }

  const addLocation = (location) => {
    if (!currentUser.locations.includes(location)) {
      setCurrentUser({
        ...currentUser,
        locations: [...currentUser.locations, location],
      })
    }
    setShowLocationForm(false)
  }

  const removeLocation = (location) => {
    setCurrentUser({
      ...currentUser,
      locations: currentUser.locations.filter((l) => l !== location),
    })
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
  )
}

