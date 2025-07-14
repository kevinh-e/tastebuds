"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChevronLeft, MapPin, Utensils, Users } from "lucide-react"
import { useAppContext } from "@/context/AppContext.jsx"
import Link from "next/link"
import PreferencesList from "@/components/lobby/preferences-list"
import UsersList from "@/components/lobby/users-list"
import { socket } from "@/socket"
import CopyButton from "@/components/ui/copy-button"
import { useState } from "react"

export default function LobbyPage() {
  const { id, roomCode, roomData, setRoomData } = useAppContext();
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  socket.on("reccomendationsRecieved", (data) => {
    setRoomData(JSON.parse(data))
    router.push("/feed")
  })

  const handleSubmit = async (e) => {
    // Prevent the page from refreshing
    e.preventDefault();

    // Combine the strings of cuisines and locations into a single string
    let searchQuery = "";
    let locationsProvided = false;

    if (roomData && roomData.roomMembers) {
      Object.values(roomData.roomMembers).forEach((user) => {
        user.preferences.cuisineTags.forEach((cuisine) => {
          searchQuery += cuisine + " ";
        })
        if (user.preferences.locationTags.length > 0) {
          locationsProvided = true;
        }
      })
      if (locationsProvided === true) {
        searchQuery += "located in ";
        Object.values(roomData.roomMembers).forEach((user) => {
          user.preferences.locationTags.forEach((location) => {
            searchQuery += location + " ";
          })
        })
      }
    }

    setLoading(true);
    if (searchQuery.length === 0) {
      searchQuery = "restaurants"
    }

    const response = await fetch("/api/places", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ textQuery: searchQuery, pageSize: 10 }),
    })

    const searchApiResponse = await response.json()
    const maskedApiResponse = searchApiResponse.places
    const restaurantArrayFinal = []
    setLoading(false);

    maskedApiResponse.forEach((placeObj) => {
      const obj = {}
      obj["place"] = { ...placeObj }
      obj["countDownStart"] = 0
      obj["votes"] = {
        yes: [],
        no: []
      };
      obj["reactions"] = {};
      obj["thumbnail"] = "";
      restaurantArrayFinal.push(obj);
    })

    socket.emit("reccomendationsBroadcast", roomCode, JSON.stringify(restaurantArrayFinal))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50/50 to-white">
      <main className="container max-w-md mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <Button asChild variant="ronaldo" size="sm" className="flex items-center text-sm">
            <Link href="/">
              <ChevronLeft className="h-4 w-4 mr-1" /> Exit
            </Link>
          </Button>
          <CopyButton className="text-muted-foreground font-medium" textToCopy={roomCode} displayText={roomCode} />
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-500" />
                <CardTitle>Buddies</CardTitle>
              </div>
              <CardDescription>Everyone who has joined this room</CardDescription>
            </CardHeader>
            <CardContent>
              {roomData && roomData.roomMembers ? (
                <UsersList users={roomData.roomMembers} currentUserId={id} />
              ) : (
                <p>No users available</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Utensils className="h-5 w-5 text-orange-500" />
                <CardTitle>Cuisines</CardTitle>
              </div>
              <CardDescription>Food preferences from all participants</CardDescription>
            </CardHeader>
            <CardContent>
              {roomData && roomData.roomMembers ? (
                <PreferencesList users={roomData.roomMembers} preferenceType="cuisineTags" />
              ) : (
                <p>No preferences available</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-orange-500" />
                <CardTitle>Locations</CardTitle>
              </div>
              <CardDescription>Preferred areas to find restaurants</CardDescription>
            </CardHeader>
            <CardContent>
              {roomData && roomData.roomMembers ? (
                <PreferencesList users={roomData.roomMembers} preferenceType="locationTags" />
              ) : (
                <p>No locations available</p>
              )}
            </CardContent>
          </Card>

          {roomData && id in roomData.roomMembers && roomData.roomMembers[id]?.isHost === true ? (
            <Button
              type="submit"
              size="lg"
              className={`w-full ${loading ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'}`}
              disabled={loading}
            >
              {loading ? "Loading..." : "Start Matching!"}
            </Button>
          ) : (
            <Button type="submit" size="lg" className="w-full" disabled>
              Waiting for host to start matching...
            </Button>
          )}
        </form>
      </main>
    </div>
  )
}


