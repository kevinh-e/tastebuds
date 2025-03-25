"use client"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronLeft, Share2, Trophy } from "lucide-react"
import Link from "next/link"
import RestaurantCard from "@/components/restaurant-card"
import TopThreeRestaurants from "@/components/top-three-restaurants"

// Mock users data
const users = [
    { id: "1", name: "Alex", avatar: "A" },
    { id: "2", name: "Sam", avatar: "S" },
    { id: "3", name: "Jordan", avatar: "J" },
    { id: "current", name: "You", avatar: "Y" },
]

// Mock data for restaurant results with detailed voting information
const restaurantResults = [
    {
        id: "1",
        name: "Bella Italia",
        cuisine: "Italian",
        location: "Downtown",
        rating: 4.8,
        price: "$$",
        image: "/placeholder.svg?height=80&width=80",
        description: "Authentic Italian cuisine with homemade pasta and wood-fired pizzas.",
        votes: {
            yes: ["1", "2", "3", "current"],
            no: [],
        },
        reactions: [
            { emoji: "😍", count: 3 },
            { emoji: "👨‍🍳", count: 2 },
            { emoji: "🍕", count: 1 },
        ],
    },
    {
        id: "2",
        name: "Sakura Sushi",
        cuisine: "Japanese",
        location: "Westside",
        rating: 4.6,
        price: "$$$",
        image: "/placeholder.svg?height=80&width=80",
        description: "Fresh sushi and sashimi prepared by master chefs.",
        votes: {
            yes: ["1", "3", "current"],
            no: ["2"],
        },
        reactions: [
            { emoji: "🍣", count: 2 },
            { emoji: "👍", count: 1 },
        ],
    },
    {
        id: "3",
        name: "Taco Fiesta",
        cuisine: "Mexican",
        location: "Midtown",
        rating: 4.5,
        price: "$",
        image: "/placeholder.svg?height=80&width=80",
        description: "Vibrant Mexican street food with handmade tortillas.",
        votes: {
            yes: ["2", "current"],
            no: ["1"],
        },
        reactions: [
            { emoji: "🌮", count: 2 },
            { emoji: "🔥", count: 1 },
        ],
    },
    {
        id: "4",
        name: "Spice Garden",
        cuisine: "Indian",
        location: "Eastside",
        rating: 4.3,
        price: "$$",
        image: "/placeholder.svg?height=80&width=80",
        description: "Aromatic Indian dishes with authentic spices and flavors.",
        votes: {
            yes: ["3", "current"],
            no: ["1", "2"],
        },
        reactions: [{ emoji: "🌶️", count: 2 }],
    },
    {
        id: "5",
        name: "Golden Dragon",
        cuisine: "Chinese",
        location: "Uptown",
        rating: 4.2,
        price: "$$",
        image: "/placeholder.svg?height=80&width=80",
        description: "Traditional Chinese cuisine with a modern twist.",
        votes: {
            yes: ["1"],
            no: ["2", "3"],
        },
        reactions: [{ emoji: "🥡", count: 1 }],
    },
    {
        id: "6",
        name: "Thai Orchid",
        cuisine: "Thai",
        location: "Downtown",
        rating: 4.0,
        price: "$$",
        image: "/placeholder.svg?height=80&width=80",
        description: "Flavorful Thai dishes with fresh ingredients and bold spices.",
        votes: {
            yes: ["2"],
            no: ["1", "3", "current"],
        },
        reactions: [{ emoji: "🌶️", count: 1 }],
    },
]

// Sort restaurants by number of yes votes
const sortedRestaurants = [...restaurantResults].sort(
    (a, b) => b.votes.yes.length - a.votes.yes.length || a.votes.no.length - b.votes.no.length,
)

export default function ResultsPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const groupId = searchParams.get("groupId") || "UNKNOWN"
    const [activeTab, setActiveTab] = useState("all")

    // Get top 3 restaurants
    const topThree = sortedRestaurants.slice(0, 3)
    // Get the rest of the restaurants
    const otherRestaurants = sortedRestaurants.slice(3)

    const shareResults = () => {
        if (navigator.share) {
            navigator.share({
                title: "Our FoodMates Results",
                text: `Check out our restaurant recommendations! Top pick: ${sortedRestaurants[0].name}`,
                url: window.location.href,
            })
        } else {
            // Fallback for browsers that don't support the Web Share API
            navigator.clipboard.writeText(
                `Check out our restaurant recommendations! Top pick: ${sortedRestaurants[0].name} - ${window.location.href}`,
            )
            alert("Results link copied to clipboard!")
        }
    }

    return (
        <div className="container max-w-md mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <div></div>
                <Button variant="outline" size="sm" onClick={shareResults} className="flex items-center gap-1">
                    <Share2 className="h-4 w-4" />
                    Share Results
                </Button>
            </div>

            <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    <h2 className="text-xl font-bold">Top Picks</h2>
                </div>
                <TopThreeRestaurants restaurants={topThree} users={users} />
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

                    <div className="space-y-6">
                        {sortedRestaurants
                            .filter((restaurant) => {
                                if (activeTab === "all") return true
                                if (activeTab === "liked") return restaurant.votes.yes.includes("current")
                                if (activeTab === "passed") return restaurant.votes.no.includes("current")
                                return true
                            })
                            .map((restaurant, index) => (
                                <RestaurantCard
                                    key={restaurant.id}
                                    restaurant={restaurant}
                                    rank={index + 1}
                                    users={users}
                                    showVotes={true}
                                />
                            ))}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-center border-t pt-4">
                    <Button variant="outline" className="w-full">
                        Start New Search
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

