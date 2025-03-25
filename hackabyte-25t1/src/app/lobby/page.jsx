"use client";

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, MapPin, Utensils } from "lucide-react"
import { useAppContext } from "@/context/AppContext.jsx";
import Link from "next/link"
import PreferencesList from "@/components/lobby/preferences-list"
import UsersList from "@/components/lobby/users-list"
import { socket } from "@/socket"
import CopyButton from "@/components/ui/copy-button"


export default function LobbyPage() {
  const { id, roomCode, roomData, setRoomData } = useAppContext();
  
  const router = useRouter()
  
  socket.on("reccomendationsRecieved", (data) => {
    setRoomData(JSON.parse(data));
    router.push("/feed");
  });

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

    const restaurantArrayFinal = [];

    maskedApiResponse.forEach((placeObj) => {
      const obj = {}
      obj["place"] = {...placeObj}
      obj["countDownStart"] = 0;
      obj["votes"] = {
        yes: [],
        no: []
      };
      obj["reactions"] = []
      restaurantArrayFinal.push(obj);
    })

    socket.emit("reccomendationsBroadcast", roomCode, JSON.stringify(restaurantArrayFinal));
  }

  return (
    <form onSubmit={handleSubmit} className="container max-w-md mx-auto px-4 py-8 h-screen">
      <div className="container max-w-md mx-auto px-4 h-full flex flex-col justify-between">
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <Button asChild className="bg-card text-muted-foreground border">
              <Link href="/start" className="flex items-center text-sm">
                <ChevronLeft className="h-4 w-4 mr-1" /> Exit
              </Link>
            </Button>
            <CopyButton
              className="text-muted-foreground"
              textToCopy={roomCode}
              displayText={roomCode}
            />
          </div>

          <div className="flex flex-col space-y-3">
            <Card>
              <CardContent className="space-y-3">
                <h3 className="text-xl font-semibold">Buddies:</h3>
                <UsersList users={roomData.roomMembers} currentUserId={id} />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-3">
                <Utensils className="h-6 w-6"/>
                <h3 className="text-xl font-semibold">Cusines:</h3>
                <PreferencesList users={roomData.roomMembers} preferenceType="cuisineTags" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-3">
                <MapPin className="h-6 w-6"/>
                <h3 className="text-xl font-semibold">Locations:</h3>
                <PreferencesList users={roomData.roomMembers} preferenceType="locationTags" />
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="justify-self-end">
          {
            (id in roomData.roomMembers && roomData.roomMembers[id]?.isHost === true) ? (
              <Button type="submit" size="lg" className="w-full">
                Start Matching!
              </Button>
            ) : (
              <Button type="submit" className="w-full" disabled>
                Waiting for host to start matching...
              </Button>
            )
          }
        </div>
      </div>
    </form>
  )
}

