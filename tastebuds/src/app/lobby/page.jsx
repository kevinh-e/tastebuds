"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChevronLeft, MapPin, Utensils, Users, Pencil } from "lucide-react"
import { useAppContext } from "@/context/AppContext.jsx"
import PreferencesList from "@/components/lobby/preferences-list"
import UsersList from "@/components/lobby/users-list"
import { socket } from "@/socket"
import CopyButton from "@/components/ui/copy-button"
import { useState, useEffect, useCallback } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import GameNotFound from "@/components/ui/game-not-found";

export default function LobbyPage() {
  const { id, roomCode, roomData, setRoomData } = useAppContext()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const onRecommendations = (data) => {
      setRoomData(JSON.parse(data))
      router.push("/feed")
    }

    socket.on("reccomendationsRecieved", onRecommendations)

    return () => {
      socket.off("reccomendationsRecieved", onRecommendations)
    }
  }, [router, setRoomData])

  const handleLeaveRoom = useCallback(() => {
    if (!roomCode || !id) {
      router.push("/");
      return;
    }

    socket.emit("leaveRoom", roomCode, id, () => {
      setRoomData(null);
      router.push("/");
    })
  }, [roomCode, id, router, setRoomData])

  const handleEditPrefs = useCallback(() => {
    console.log("editting")
    if (!roomCode || !id) {
      router.push("/");
      return;
    }

    socket.emit("editPreferences", roomCode, id, () => {
      router.push("/taste-select");
    })
  }, [roomCode, id, router]);

  const handleSubmit = async (e) => {
    e.preventDefault()

    let searchQuery = ""
    let locationsProvided = false

    if (roomData && roomData.roomMembers) {
      Object.values(roomData.roomMembers).forEach((user) => {
        user.preferences.cuisineTags.forEach((cuisine) => {
          searchQuery += cuisine + " "
        })
        if (user.preferences.locationTags.length > 0) {
          locationsProvided = true
        }
      })

      if (locationsProvided === true) {
        searchQuery += "located in "
        Object.values(roomData.roomMembers).forEach((user) => {
          user.preferences.locationTags.forEach((location) => {
            searchQuery += location + " "
          })
        })
      }
    }

    setLoading(true)

    if (searchQuery.length === 0) {
      searchQuery = "restaurants"
    }

    try {
      const response = await fetch("/api/places/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ textQuery: searchQuery, pageSize: 10 }),
      })

      const searchApiResponse = await response.json()
      const maskedApiResponse = searchApiResponse.places
      const restaurantArrayFinal = []

      maskedApiResponse.forEach((placeObj) => {
        const obj = {}
        obj["place"] = { ...placeObj }
        obj["countDownStart"] = 0
        obj["votes"] = {
          yes: [],
          no: [],
        }
        obj["reactions"] = {}
        obj["thumbnail"] = ""
        restaurantArrayFinal.push(obj)
      })

      socket.emit("reccomendationsBroadcast", roomCode, JSON.stringify(restaurantArrayFinal))
    } catch (error) {
      console.error("Error fetching recommendations:", error)
    } finally {
      setLoading(false)
    }
  }

  const isHost = roomData && id in roomData.roomMembers && roomData.roomMembers[id]?.isHost === true

  if (!roomCode || !roomData) {
    return <GameNotFound />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/50 to-white">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header - Related to room and buddies */}
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="ronaldo"
            size="sm"
            className="flex items-center text-sm"
            onClick={handleLeaveRoom}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Exit
          </Button>
          <CopyButton className="text-muted-foreground font-medium" textToCopy={roomCode} displayText={roomCode} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Mobile Layout */}
          <div className="block lg:hidden space-y-6">
            {/* Buddies Card - Acts as attachment/header to the preferences section */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-orange-500" />
                  <CardTitle className="text-lg">Buddies</CardTitle>
                </div>
                <CardDescription className="text-xs">Everyone in this room</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="max-h-32 overflow-y-auto">
                  {roomData && roomData.roomMembers ? (
                    <UsersList users={roomData.roomMembers} currentUserId={id} />
                  ) : (
                    <p className="text-muted-foreground text-center py-4 text-sm">No users available</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Preferences Card - Groups cuisines and locations together, with edit button integrated */}
            <Card>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Utensils className="h-4 w-4 text-orange-500" />
                    <CardTitle className="text-lg">Preferences</CardTitle>
                  </div>
                  <Button
                    variant="ronaldo"
                    size="sm"
                    className="flex items-center text-sm"
                    onClick={handleEditPrefs}
                  >
                    <Pencil className="h-4 w-4 mr-1" /> Edit
                  </Button>
                </div>
                <CardDescription className="text-xs">Combined food and location preferences</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 space-y-6">
                {/* Cuisines Subsection */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Utensils className="h-4 w-4 text-orange-500" />
                    <h3 className="text-sm font-medium">Cuisines</h3>
                  </div>
                  <div className="max-h-24 overflow-y-auto">
                    {roomData && roomData.roomMembers ? (
                      <PreferencesList users={roomData.roomMembers} preferenceType="cuisineTags" />
                    ) : (
                      <p className="text-muted-foreground text-center py-2 text-sm">No preferences available</p>
                    )}
                  </div>
                </div>

                {/* Locations Subsection */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-orange-500" />
                    <h3 className="text-sm font-medium">Locations</h3>
                  </div>
                  <div className="max-h-24 overflow-y-auto">
                    {roomData && roomData.roomMembers ? (
                      <PreferencesList users={roomData.roomMembers} preferenceType="locationTags" />
                    ) : (
                      <p className="text-muted-foreground text-center py-2 text-sm">No locations available</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6 lg:h-[calc(100vh-12rem)]">
            {/* Buddies Column - Acts as attachment to preferences */}
            <Card className="flex flex-col col-span-1">
              <CardHeader className="flex-shrink-0 pb-3">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-orange-500" />
                  <CardTitle className="text-lg">Buddies</CardTitle>
                </div>
                <CardDescription>Everyone who has joined this room</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden">
                <ScrollArea className="h-full">
                  {roomData && roomData.roomMembers ? (
                    <UsersList users={roomData.roomMembers} currentUserId={id} />
                  ) : (
                    <p className="text-muted-foreground text-center py-8">No users available</p>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Preferences Column - Groups cuisines and locations together, with edit button integrated */}
            <Card className="flex flex-col col-span-2">
              <CardHeader className="flex-shrink-0 pb-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Utensils className="h-5 w-5 text-orange-500" />
                    <CardTitle className="text-lg">Preferences</CardTitle>
                  </div>
                  <Button
                    variant="ronaldo"
                    size="sm"
                    className="flex items-center text-sm"
                    onClick={handleEditPrefs}
                  >
                    <Pencil className="h-4 w-4 mr-1" /> Edit Preferences
                  </Button>
                </div>
                <CardDescription>Combined food and location preferences from all participants</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 overflow-hidden">
                <div className="grid grid-cols-2 gap-6 h-full">
                  {/* Cuisines Subsection */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <Utensils className="h-5 w-5 text-orange-500" />
                      <h3 className="text-base font-medium">Cuisines</h3>
                    </div>
                    <ScrollArea className="flex-1">
                      {roomData && roomData.roomMembers ? (
                        <PreferencesList users={roomData.roomMembers} preferenceType="cuisineTags" />
                      ) : (
                        <p className="text-muted-foreground text-center py-8">No preferences available</p>
                      )}
                    </ScrollArea>
                  </div>

                  {/* Locations Subsection */}
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <MapPin className="h-5 w-5 text-orange-500" />
                      <h3 className="text-base font-medium">Locations</h3>
                    </div>
                    <ScrollArea className="flex-1">
                      {roomData && roomData.roomMembers ? (
                        <PreferencesList users={roomData.roomMembers} preferenceType="locationTags" />
                      ) : (
                        <p className="text-muted-foreground text-center py-8">No locations available</p>
                      )}
                    </ScrollArea>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Button */}
          <div className="pt-6">
            {isHost ? (
              <Button
                type="submit"
                size="lg"
                className={`w-full ${loading ? "bg-orange-400 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"}`}
                disabled={loading}
              >
                {loading ? "Finding Restaurants..." : "Start Matching!"}
              </Button>
            ) : (
              <Button type="button" size="lg" className="w-full" disabled variant="secondary">
                Waiting for host to start matching...
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
