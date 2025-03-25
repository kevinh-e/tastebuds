"use client"

import { useEffect, useState } from "react"
import { useAppContext } from "@/context/AppContext"
import { FeedCard } from "./feed-card"

import { socket } from "@/socket.js";
import { Button } from "@/components/ui/button";

export default function FeedPage() {
  const [currentVote, setCurrentVote] = useState(null)
  const { id, roomData, roomCode, restIndex } = useAppContext();

  const handleVoteChange = (vote) => {
    setCurrentVote(vote)
    if (socket.connected && roomCode !== "") {
      socket.emit("sendUserVote", vote, id, roomCode, restIndex, res => {
        console.log("votes");
        console.log(res);
      });
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
  }, [currentVote]);

  return (
    <div className="bg-gray-100 min-h-screen p-8 flex flex-col items-center justify-center">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Swipe to Vote</h1>
        <Button onClick={skipRestaurant}>
          Skip
        </Button>
        <p className="text-gray-600">Swipe right for Yes, left for No. You can change your vote anytime.</p>
      </div>

      <FeedCard
        place={roomData.restaurants[restIndex].place}
        onVoteChange={handleVoteChange}
      />
    </div>
  );
};

