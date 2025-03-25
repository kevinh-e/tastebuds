"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Plus, X, Share2 } from "lucide-react"
import { useAppContext } from "@/context/AppContext.jsx";
import Link from "next/link"
import PreferencesList from "@/components/lobby/preferences-list"
import UsersList from "@/components/lobby/users-list"
import { socket } from "@/socket"


export default function LobbyPage() {
  const { id, roomCode, roomData, setRoomData } = useAppContext();

  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    socket.on("reccomendationsRecieved", (data) => {
      setRoomData(JSON.parse(data));
      router.push("/feed");
    });
  }, [roomData]);

  const handleSubmit = async (e) => {
    // Prevent the page from refreshing
    e.preventDefault();

    // Combine the strings of cuisines and locations into a single string
    let searchQuery = "";
    let locationsProvided = false;
    Object.values(roomData.roomMembers).forEach((user) => {
      user.preferences.cuisineTags.forEach((cuisine) => {
        searchQuery += cuisine + " ";
      });
      if (user.preferences.locationTags.length > 0) {
        locationsProvided = true;
      }
    })
    if (locationsProvided === true) {
      searchQuery += "located in ";
      Object.values(roomData.roomMembers).forEach((user) => {
        user.preferences.locationTags.forEach((location) => {
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

    const maskedApiResponse = searchApiResponse.places;

    socket.emit("reccomendationsBroadcast", roomCode, JSON.stringify({ maskedApiResponse }));
  }

  const shareGroup = () => {
    if (navigator.share) {
      navigator.share({
        title: "Join my FoodMates group!",
        text: `Join my group with code: ${roomCode}`,
        url: window.location.href,
      })
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(`Join my FoodMates group with code: ${roomCode}`)
      alert("Group code copied to clipboard!")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="container max-w-md mx-auto px-4 py-8">
      <div className="container max-w-md mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Link href="/start" className="flex items-center text-sm">
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
            <CardDescription>Group Code: {roomCode}</CardDescription>
          </CardHeader>
          <CardContent>
            <UsersList users={roomData.roomMembers} currentUserId={id} />
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Cuisine Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <PreferencesList users={roomData.roomMembers} preferenceType="cuisineTags" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Location Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <PreferencesList users={roomData.roomMembers} preferenceType="locationTags" />
          </CardContent>
        </Card>

        {

          (id in roomData.roomMembers && roomData.roomMembers[id]?.isHost === true) ? (
            <Button type="submit" className="w-full mt-6">
              Start Matching!
            </Button>
          ) : (
            <Button type="submit" className="w-full mt-6" disabled>
              Waiting for host to start matching...
            </Button>
          )
        }

      </div>
    </form>
  )
}

