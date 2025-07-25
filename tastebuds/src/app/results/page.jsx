"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Share2,
  ThumbsUp,
  ThumbsDown,
  Crown,
  Sparkles,
  RotateCcw,
  Star,
  Clock,
  ChevronRight,
  PartyPopper,
  ChevronDown,
  ChevronUp,
  List,
  Eye,
} from "lucide-react"
import RestaurantCard from "@/components/restaurant-card"
import Confetti from "@/components/confetti"
import { useAppContext } from "@/context/AppContext"
import Link from "next/link"
import GameNotFound from "@/components/ui/game-not-found"
import Branding from "@/components/Branding"

export default function ResultsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [showConfetti, setShowConfetti] = useState(true)
  const [isSharing, setIsSharing] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const { id, roomCode, roomData, restIndex } = useAppContext()

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000)
    return () => clearTimeout(timer)
  }, [])

  if (!roomCode || !roomData) {
    return <GameNotFound />
  }

  const users = Object.entries(roomData.roomMembers).map(([userId, member]) => ({
    id: userId,
    name: member.name,
    avatar: member.name.charAt(0).toUpperCase(),
    isHost: member.isHost,
  }))

  const currentUser = id
  const restaurants = roomData.restaurants || []

  const sortedRestaurants = [...restaurants].sort((a, b) => {
    const aYesLength = a.votes.yes.length
    const bYesLength = b.votes.yes.length
    const yesDiff = bYesLength - aYesLength
    if (yesDiff !== 0) return yesDiff

    const aNoLength = a.votes.no.length
    const bNoLength = b.votes.no.length
    return aNoLength - bNoLength
  })

  const winner = sortedRestaurants[0]
  const topThree = sortedRestaurants.slice(0, 3)
  const likedRestaurants = sortedRestaurants.filter((r) => r.votes.yes.includes(currentUser))
  const passedRestaurants = sortedRestaurants.filter((r) => r.votes.no.includes(currentUser))

  const getFilteredRestaurants = () => {
    switch (activeTab) {
      case "liked":
        return likedRestaurants
      case "passed":
        return passedRestaurants
      default:
        return sortedRestaurants
    }
  }

  const shareResults = async () => {
    setIsSharing(true)
    const shareText = `🎉 Our TasteBuds Results!\n\n🏆 Winner: ${winner?.place?.displayName?.text || winner?.place?.name}\n\nTime to make a reservation! 🍽️`

    try {
      if (navigator.share) {
        await navigator.share({
          title: "TasteBuds Results",
          text: shareText,
          url: window.location.href,
        })
      } else {
        await navigator.clipboard.writeText(`${shareText}\n\n${window.location.href}`)
        alert("Results copied to clipboard! 📋")
      }
    } catch (error) {
      console.error("Error sharing:", error)
    } finally {
      setIsSharing(false)
    }
  }

  const getPodiumEmoji = (index) => {
    const emojis = ["🥇", "🥈", "🥉"]
    return emojis[index] || `#${index + 1}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-orange-50 to-amber-50">
      {showConfetti && <Confetti duration={4000} />}

      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-orange-100 shadow-sm">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full">
                <PartyPopper className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                  Results
                </h1>
                <p className="text-sm text-muted-foreground">Room: {roomCode}</p>
              </div>
            </div>
            <div className="text-2xl">
              <Branding />
            </div>
          </div>
        </div>
      </div>

      <main className="container max-w-4xl mx-auto px-4 py-6 space-y-4">
        {/* Top 3 Results */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">🏆 Top 3 Picks</h2>
            <p className="text-muted-foreground">Your group's favorite restaurants</p>
          </div>

          <div className="space-y-4">
            {topThree.map((restaurant, index) => (
              <div key={restaurant.place.id} className="relative">
                {/* Podium indicator for mobile */}
                <div className="flex items-center gap-3 mb-2 md:hidden">
                  <div className="text-2xl">{getPodiumEmoji(index)}</div>
                  <div className="text-lg font-semibold text-gray-700">
                    {index === 0 ? "Winner" : index === 1 ? "Runner-up" : "Third Place"}
                  </div>
                </div>
                <RestaurantCard
                  restaurant={restaurant}
                  rank={index + 1}
                  users={users}
                  currentUser={currentUser}
                  showVotes={true}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Expandable All Results Section */}
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <Card className="shadow-lg border-2 border-gray-200 py-4">
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full">
                      <List className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-lg">All Results</CardTitle>
                    <div>
                      {/* <p className="text-sm text-muted-foreground">
                        {isExpanded ? "Hide" : "View"} detailed breakdown of all {restaurants.length} restaurants
                      </p> */}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="bg-gray-100">
                      {restaurants.length} restaurants
                    </Badge>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </div>
              </CardHeader>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <CardContent className="">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="before:bg-border relative h-auto w-full gap-0.5 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px">
                    <TabsTrigger
                      value="all"
                      className="bg-black/5 overflow-hidden rounded-b-none border-border border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none data-[state=active]:border-b-0"
                    >
                      <Eye className="h-4 w-4" />
                      <span>All Results</span>
                      <Badge variant="secondary" className="ml-1 bg-gray-200 text-gray-700 hidden md:block">
                        {sortedRestaurants.length}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger
                      value="liked"
                      className="bg-black/5 overflow-hidden rounded-b-none border-border border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none data-[state=active]:border-b-0"
                    >
                      <ThumbsUp className="h-4 w-4" />
                      You Liked
                      <Badge variant="secondary" className="ml-1 bg-green-100 text-green-700 hidden md:block">
                        {likedRestaurants.length}
                      </Badge>
                    </TabsTrigger>
                    <TabsTrigger
                      value="passed"
                      className="bg-black/5 overflow-hidden rounded-b-none border-border border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none data-[state=active]:border-b-0"
                    >
                      <ThumbsDown className="h-4 w-4" />
                      You Passed
                      <Badge variant="secondary" className="ml-1 bg-red-100 text-red-700 hidden md:block">
                        {passedRestaurants.length}
                      </Badge>
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value={activeTab}>
                    {getFilteredRestaurants().length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">🤷‍♀️</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No restaurants here</h3>
                        <p className="text-muted-foreground">
                          {activeTab === "liked" && "You didn't like any restaurants in this session."}
                          {activeTab === "passed" && "You didn't pass on any restaurants in this session."}
                          {activeTab === "all" && "No restaurants found."}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {getFilteredRestaurants().map((restaurant, index) => (
                          <div key={restaurant.place.id} className="group">
                            <RestaurantCard
                              restaurant={restaurant}
                              rank={activeTab === "all" ? sortedRestaurants.indexOf(restaurant) + 1 : index + 1}
                              users={users}
                              currentUser={currentUser}
                              showVotes={true}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Stats Overview */}
        <div className="space-y-4 mt-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">📊 Session Summary</h2>
            <p className="text-sm text-muted-foreground">Quick overview of your group's dining decisions</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            {/* Restaurants Card */}
            <Card className="relative overflow-hidden border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-blue-50/50 to-indigo-100 hover:shadow-lg transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-200/30 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 bg-blue-300/20 rounded-full translate-y-6 -translate-x-6"></div>
              <CardContent className="relative p-4 md:p-6 text-center">
                <div className="mb-2">
                  <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-blue-500 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-lg md:text-xl">🍽️</span>
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-blue-600 mb-1 group-hover:scale-105 transition-transform duration-300">
                  {restaurants.length}
                </div>
                <div className="text-xs md:text-sm font-medium text-blue-600/80">Restaurants</div>
                <div className="text-xs text-blue-500/60 mt-1">Explored</div>
              </CardContent>
            </Card>

            {/* Participants Card */}
            <Card className="relative overflow-hidden border-2 border-green-200 bg-gradient-to-br from-green-50 via-green-50/50 to-emerald-100 hover:shadow-lg transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-green-200/30 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 bg-green-300/20 rounded-full translate-y-6 -translate-x-6"></div>
              <CardContent className="relative p-4 md:p-6 text-center">
                <div className="mb-2">
                  <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-green-500 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-lg md:text-xl">👥</span>
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-green-600 mb-1 group-hover:scale-105 transition-transform duration-300">
                  {users.length}
                </div>
                <div className="text-xs md:text-sm font-medium text-green-600/80">Participants</div>
                <div className="text-xs text-green-500/60 mt-1">Decided Together</div>
              </CardContent>
            </Card>

            {/* Yes Votes Card */}
            <Card className="relative overflow-hidden border-2 border-purple-200 bg-gradient-to-br from-purple-50 via-purple-50/50 to-violet-100 hover:shadow-lg transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-purple-200/30 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 bg-purple-300/20 rounded-full translate-y-6 -translate-x-6"></div>
              <CardContent className="relative p-4 md:p-6 text-center">
                <div className="mb-2">
                  <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-purple-500 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300">
                    <ThumbsUp className="h-4 w-4 md:h-5 md:w-5 text-white" />
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-1 group-hover:scale-105 transition-transform duration-300">
                  {restaurants.reduce((total, r) => total + r.votes.yes.length, 0)}
                </div>
                <div className="text-xs md:text-sm font-medium text-purple-600/80">Yes Votes</div>
                <div className="text-xs text-purple-500/60 mt-1">Positive Choices</div>
              </CardContent>
            </Card>

            {/* No Votes Card */}
            <Card className="relative overflow-hidden border-2 border-orange-200 bg-gradient-to-br from-orange-50 via-orange-50/50 to-red-100 hover:shadow-lg transition-all duration-300 group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-orange-200/30 rounded-full -translate-y-8 translate-x-8"></div>
              <div className="absolute bottom-0 left-0 w-12 h-12 bg-orange-300/20 rounded-full translate-y-6 -translate-x-6"></div>
              <CardContent className="relative p-4 md:p-6 text-center">
                <div className="mb-2">
                  <div className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-orange-500 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300">
                    <ThumbsDown className="h-4 w-4 md:h-5 md:w-5 text-white" />
                  </div>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-orange-600 mb-1 group-hover:scale-105 transition-transform duration-300">
                  {restaurants.reduce((total, r) => total + r.votes.no.length, 0)}
                </div>
                <div className="text-xs md:text-sm font-medium text-orange-600/80">No Votes</div>
                <div className="text-xs text-orange-500/60 mt-1">Filtered Out</div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mt-4">
            <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
              <CardContent className="p-4 text-center">
                <div className="text-lg font-bold text-gray-700">
                  {Math.round(
                    (restaurants.reduce((total, r) => total + r.votes.yes.length, 0) /
                      (restaurants.reduce((total, r) => total + r.votes.yes.length, 0) +
                        restaurants.reduce((total, r) => total + r.votes.no.length, 0))) *
                      100,
                  ) || 0}
                  %
                </div>
                <div className="text-xs text-gray-600">Overall Approval</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-amber-50 to-yellow-100 border-amber-200">
              <CardContent className="p-4 text-center">
                <div className="text-lg font-bold text-amber-700">
                  {Math.round(
                    (restaurants.reduce((total, r) => total + r.votes.yes.length, 0) +
                      restaurants.reduce((total, r) => total + r.votes.no.length, 0)) /
                      users.length,
                  ) || 0}
                </div>
                <div className="text-xs text-amber-600">Avg Votes per Person</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-teal-50 to-cyan-100 border-teal-200">
              <CardContent className="p-4 text-center">
                <div className="text-lg font-bold text-teal-700">
                {
                  winner && winner.votes &&
                  Array.isArray(winner.votes.yes) &&
                  Array.isArray(winner.votes.no) &&
                  (winner.votes.yes.length + winner.votes.no.length) > 0
                    ? `${Math.round(
                        (winner.votes.yes.length /
                          (winner.votes.yes.length + winner.votes.no.length)) * 100
                      )}%`
                    : "0%"
                  }
                </div>
                <div className="text-xs text-teal-600">Winner Approval</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button
            className="w-full h-14 bg-white hover:bg-gray-50 rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 shadow-sm"
            variant="outline"
            asChild
          >
            <Link href="/" className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4" />
              Start New Search
            </Link>
          </Button>
          <Button
            onClick={shareResults}
            disabled={isSharing}
            className="w-full h-14 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-lg font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1 shadow-sm"
          >
            <Share2 className="h-5 w-5 mr-3" />
            {isSharing ? "Sharing..." : "Share Results"}
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center py-8 text-muted-foreground">
          <Branding />
        </div>
      </main>
    </div>
  )
}
