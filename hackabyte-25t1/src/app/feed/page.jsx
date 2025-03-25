"use client"

import { useEffect, useState } from "react"
import { useAppContext } from "@/context/AppContext"
import { FeedCard } from "./feed-card"
import { RestaurantReactions } from "./restaurant-reactions"

import { socket } from "@/socket.js"
import { toast } from "sonner"

export default function FeedPage() {
  const [currentVote, setCurrentVote] = useState(null)
  const [userReaction, setUserReaction] = useState(null)
  const { id, setRoomData, roomData, roomCode, restIndex, setRestIndex } = useAppContext()
  const isHost = roomData ? roomData.roomMembers[id].isHost : false;

  useEffect(() => {
    socket.on("reactionToast", ({ userName, reaction }) => {
      // don't toast if someone is unreacting
      if (reaction !== null) {
        toast(`${userName} reacted with ${reaction}`)
      }
    })

    return () => {
      socket.off("reactionToast")
    }
  }, [])

  const handleVoteChange = (vote) => {
    setCurrentVote(vote)
    if (socket.connected && roomCode !== "") {
      socket.emit("sendUserVote", vote, id, roomCode, restIndex, (res) => {
        console.log("votes")
        console.log(res)
      })
    }
  }

  const handleReactionChange = (reaction) => {
    setUserReaction(reaction)
    if (socket.connected && roomCode !== "") {
      socket.emit("sendUserReaction", reaction, id, roomCode, restIndex, (res) => {
        console.log("reactions")
        console.log(res)
      })
    }
  }

  const skipRestaurant = () => {
    if (socket.connected && roomCode !== "") {
      console.log("SKIPPING")
      socket.emit("nextRestaurant", roomCode);
    }
  }

  useEffect(() => {
    console.log(`currentVote: ${currentVote}`)
  }, [currentVote])

  useEffect(() => {
    console.log(`userReaction: ${userReaction}`)
  }, [userReaction])

  return (
    <div className="bg-gray-100 min-h-screen px-4 py-0 flex flex-col justify-center items-center">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Swipe to Vote</h1>
        <p className="text-gray-600">Swipe right for Yes, left for No. You can change your vote anytime.</p>
      </div>

      <FeedCard
        place={roomData.restaurants[restIndex].place}
        onVoteChange={handleVoteChange}
        onSkip={skipRestaurant}
        isHost={isHost}
      />
      <div className="mt-6 w-full max-w-md">
        <RestaurantReactions onReactionChange={handleReactionChange} currentReaction={userReaction} />
      </div>

      {currentVote && (
        <div
          className={`mt-8 p-4 rounded-lg shadow-md ${
            currentVote === "yes" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          <p className="text-xl font-medium">
            You voted: <span className="font-bold">{currentVote.toUpperCase()}</span>
          </p>
          <p className="text-sm mt-1">Swipe {currentVote === "yes" ? "left" : "right"} to change your vote</p>
        </div>
      )}
    </div>
  )
}

