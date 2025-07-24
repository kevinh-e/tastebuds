"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Share2, Trophy } from "lucide-react"
import RestaurantCard from "@/components/restaurant-card"
import TopThreeRestaurants from "@/components/top-three-restaurants"
import Confetti from "@/components/confetti"
import { useAppContext } from "@/context/AppContext"
import Link from "next/link"
import GameNotFound from "@/components/ui/game-not-found";

export default function ResultsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")
  const [showConfetti, setShowConfetti] = useState(true)
  const { id, roomCode, roomData, restIndex } = useAppContext()

  // Remove any router.push("/game-not-found") logic and related useEffect.

  if (!roomCode || !roomData) {
    return <GameNotFound />;
  }

  // Extract users from roomMembers
  const users = Object.entries(roomData.roomMembers).map(([userId, member]) => ({
    id: userId,
    name: member.name,
    avatar: member.name.charAt(0).toUpperCase(),
    isHost: member.isHost,
  }))

  // Get current user
  const currentUser = id

  // Extract restaurants from roomData
  const restaurants = roomData.restaurants || []

  // Sort restaurants by "most yes votes" descending, then by "fewest no votes"
  const sortedRestaurants = [...restaurants].sort((a, b) => {
    const aYesLength = a.votes.yes.length
    const bYesLength = b.votes.yes.length
    const yesDiff = bYesLength - aYesLength

    if (yesDiff !== 0) return yesDiff

    // If # of "yes" is the same, sort by fewer "no"
    const aNoLength = a.votes.no.length
    const bNoLength = b.votes.no.length
    return aNoLength - bNoLength
  })

  // Top 3
  const topThree = sortedRestaurants.slice(0, 3)
  // The rest
  const otherRestaurants = sortedRestaurants.slice(3)

  const shareResults = () => {
    if (navigator.share) {
      navigator.share({
        title: "Our TasteBuds Results",
        text: `Check out our restaurant recommendations! Top pick: ${sortedRestaurants[0]?.place?.displayName?.text || sortedRestaurants[0]?.place?.name || "Our restaurant"}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(
        `Check out our restaurant recommendations! Top pick: ${sortedRestaurants[0]?.place?.displayName?.text || sortedRestaurants[0]?.place?.name || "Our restaurant"} - ${window.location.href}`,
      )
      alert("Results link copied to clipboard!")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/50 to-white">
      {showConfetti && <Confetti duration={5000} />}

      <main className="container max-w-lg mx-auto px-4 py-8">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Results Are In!</h1>
        </div>

        {/* Top pick section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-5 w-5 text-orange-500" />
            <h2 className="text-xl font-bold">Top Pick</h2>
          </div>
          <TopThreeRestaurants restaurants={topThree} users={users} currentUser={currentUser} />
        </div>

        <Card>
          <CardContent>
            <span className="text-xl font-bold mb-3">All Results</span>
            <Tabs defaultValue="all" className="mb-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="all" onClick={() => setActiveTab("all")}>
                  All
                </TabsTrigger>
                <TabsTrigger value="liked" onClick={() => setActiveTab("liked")}>
                  You Liked
                </TabsTrigger>
                <TabsTrigger value="passed" onClick={() => setActiveTab("passed")}>
                  You Passed
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="space-y-3">
              {sortedRestaurants
                .filter((restaurant) => {
                  if (activeTab === "all") return true
                  if (activeTab === "liked") return restaurant.votes.yes.includes(currentUser)
                  if (activeTab === "passed") return restaurant.votes.no.includes(currentUser)
                  return true
                })
                .map((restaurant, index) => (
                  <RestaurantCard
                    key={restaurant.place.id}
                    restaurant={restaurant}
                    rank={index + 1}
                    users={users}
                    currentUser={currentUser}
                    showVotes={true}
                  />
                ))}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 border-t pt-4">
            <Button variant="outline" className="w-full" asChild>
              <Link href="/">
                Start New Search
              </Link>
            </Button>
            <Button onClick={shareResults} className="w-full flex gap-2" variant="secondary">
              <Share2 size={16} />
              Share Results
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}

