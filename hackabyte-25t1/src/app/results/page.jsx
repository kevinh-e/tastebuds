"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Share2, Trophy, Utensils } from "lucide-react"
import Link from "next/link"
import RestaurantCard from "@/components/restaurant-card"
import TopThreeRestaurants from "@/components/top-three-restaurants"
import Confetti from "@/components/confetti"
import { useAppContext } from "@/context/AppContext"

// ────────────────────────[ NEW DATA STRUCTURE ]─────────────────────

const data = {
  UNKNOWN: {
    roomMembers: {
      "1": {
        name: "Alex",
        isHost: false,
        preferences: {
          cuisineTags: ["Italian", "Pizza"],
          locationTags: ["Downtown"],
          prices: ["$"],
          rating: "4",
        },
      },
      "2": {
        name: "Sam",
        isHost: false,
        preferences: {
          cuisineTags: ["Japanese"],
          locationTags: ["Westside"],
          prices: ["$$", "$$$"],
          rating: "4",
        },
      },
      "3": {
        name: "Jordan",
        isHost: false,
        preferences: {
          cuisineTags: ["Mexican", "Chinese"],
          locationTags: ["Midtown", "Uptown"],
          prices: ["$", "$$"],
          rating: "4",
        },
      },
      "current": {
        name: "You",
        isHost: true,
        preferences: {
          cuisineTags: ["Thai"],
          locationTags: ["Downtown"],
          prices: ["$"],
          rating: "5",
        },
      },
    },
    restaurants: [
      {
        place: {
          id: "1",
          name: "Bella Italia",
          cuisine: "Italian",
          location: "Downtown",
          rating: 4.8,
          price: "$$",
          image: "/placeholder.svg?height=80&width=80",
          description: "Authentic Italian cuisine with homemade pasta and wood-fired pizzas.",
        },
        countDownStart: new Date("2025-03-01T12:00:00"),
        votes: {
          yes: ["1", "2", "3", "current"],
          no: [],
        },
        reactions: [
          { emoji: "😍", users: ["1", "2", "3"] },
          { emoji: "👨‍🍳", users: ["current"] },
        ],
      },
      {
        place: {
          id: "2",
          name: "Sakura Sushi",
          cuisine: "Japanese",
          location: "Westside",
          rating: 4.6,
          price: "$$$",
          image: "/placeholder.svg?height=80&width=80",
          description: "Fresh sushi and sashimi prepared by master chefs.",
        },
        countDownStart: new Date("2025-03-01T12:00:00"),
        votes: {
          yes: ["1", "3", "current"],
          no: ["2"],
        },
        reactions: [
          { emoji: "🍣", users: ["1", "3", "current"] },
          { emoji: "👍", users: ["2"] },
        ],
      },
      {
        place: {
          id: "3",
          name: "Taco Fiesta",
          cuisine: "Mexican",
          location: "Midtown",
          rating: 4.5,
          price: "$",
          image: "/placeholder.svg?height=80&width=80",
          description: "Vibrant Mexican street food with handmade tortillas.",
        },
        countDownStart: new Date("2025-03-01T12:00:00"),
        votes: {
          yes: ["2", "current"],
          no: ["1"],
        },
        reactions: [
          { emoji: "🌮", users: ["2", "current"] },
          { emoji: "🔥", users: ["1"] },
        ],
      },
      {
        place: {
          id: "4",
          name: "Spice Garden",
          cuisine: "Indian",
          location: "Eastside",
          rating: 4.3,
          price: "$$",
          image: "/placeholder.svg?height=80&width=80",
          description: "Aromatic Indian dishes with authentic spices and flavors.",
        },
        countDownStart: new Date("2025-03-01T12:00:00"),
        votes: {
          yes: ["3", "current"],
          no: ["1", "2"],
        },
        reactions: [{ emoji: "🌶️", users: ["1", "2"] }],
      },
      {
        place: {
          id: "5",
          name: "Golden Dragon",
          cuisine: "Chinese",
          location: "Uptown",
          rating: 4.2,
          price: "$$",
          image: "/placeholder.svg?height=80&width=80",
          description: "Traditional Chinese cuisine with a modern twist.",
        },
        countDownStart: new Date("2025-03-01T12:00:00"),
        votes: {
          yes: ["1"],
          no: ["2", "3"],
        },
        reactions: [{ emoji: "🥡", users: ["3"] }],
      },
      {
        place: {
          id: "6",
          name: "Thai Orchid",
          cuisine: "Thai",
          location: "Downtown",
          rating: 4.0,
          price: "$$",
          image: "/placeholder.svg?height=80&width=80",
          description: "Flavorful Thai dishes with fresh ingredients and bold spices.",
        },
        countDownStart: new Date("2025-03-01T12:00:00"),
        votes: {
          yes: ["2"],
          no: ["1", "3", "current"],
        },
        reactions: [{ emoji: "🌶️", users: ["1"] }],
      },
    ],
    roomSettings: {
      roomCode: "UNKNOWN",
      roundTime: 60,
    },
  },
}

// ───────────────────────────[ Page Content ]────────────────────────

export default function ResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const groupId = searchParams.get("groupId") || "UNKNOWN"
  const [activeTab, setActiveTab] = useState("all")
  const [showConfetti, setShowConfetti] = useState(true)
  const { roomData } = useAppContext();

  // --- Transform roomMembers object into the array of users you previously had ---
  const users = Object.entries(data[groupId].roomMembers).map(([id, member]) => ({
    id,
    name: member.name,
    // For a simple avatar, just take the first letter:
    avatar: member.name.charAt(0).toUpperCase(),
  }))

  useEffect(() => {
    console.log('emoji')
    console.log(roomData);
  }, [])

  // --- Extract restaurants from data[groupId].restaurants ---
  const restaurants = data[groupId].restaurants

  // Sort restaurants by "most yes votes" descending, then by "fewest no votes"
  const sortedRestaurants = [...restaurants].sort((a, b) => {
    const yesDiff = b.votes.yes.length - a.votes.yes.length
    if (yesDiff !== 0) return yesDiff

    // if # of "yes" is the same, sort by fewer "no"
    return a.votes.no.length - b.votes.no.length
  })

  // Top 3
  const topThree = sortedRestaurants.slice(0, 3)
  // The rest
  const otherRestaurants = sortedRestaurants.slice(3)

  const shareResults = () => {
    if (navigator.share) {
      navigator.share({
        title: "Our TasteBuds Results",
        text: `Check out our restaurant recommendations! Top pick: ${sortedRestaurants[0].place.name}`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(
        `Check out our restaurant recommendations! Top pick: ${sortedRestaurants[0].place.name} - ${window.location.href}`,
      )
      alert("Results link copied to clipboard!")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/50 to-white">
      {showConfetti && <Confetti duration={5000} />}

      <main className="container max-w-md mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold mb-2">Results Are In!</h1>
          <p className="text-muted-foreground">
            Based on everyone&apos;s preferences, we&apos;ve found the perfect spot for your group.
          </p>
        </div>

        {/* Top pick section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-5 w-5 text-orange-500" />
            <h2 className="text-xl font-bold">Top Pick</h2>
          </div>
          <TopThreeRestaurants
            restaurants={topThree.map((r) => ({
              ...r.place,
              votes: r.votes,
              reactions: r.reactions,
            }))}
            users={users}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">All Results</CardTitle>
            <CardDescription>See how everyone voted on each restaurant suggestion</CardDescription>
          </CardHeader>
          <CardContent>
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
                  if (activeTab === "liked") return restaurant.votes.yes.includes("current")
                  if (activeTab === "passed") return restaurant.votes.no.includes("current")
                  return true
                })
                .map((restaurant, index) => {
                  const mergedData = {
                    ...restaurant.place,
                    votes: restaurant.votes,
                    reactions: restaurant.reactions,
                  }
                  return (
                    <RestaurantCard
                      key={restaurant.place.id}
                      restaurant={mergedData}
                      rank={index + 1}
                      users={users}
                      showVotes={true}
                    />
                  )
                })}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 border-t pt-4">
            <Button className="w-full bg-orange-500 hover:bg-orange-600">Make Reservation</Button>
            <Button variant="outline" className="w-full">
              Start New Search
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
