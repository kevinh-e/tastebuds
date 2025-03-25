"use client"

import { useEffect, useState } from "react"
import { useAppContext } from "@/context/AppContext"
import { FeedCard } from "./feed-card"

import { socket } from "@/socket.js";
import { Button } from "@/components/ui/button";

export default function FeedPage() {
  const [currentVote, setCurrentVote] = useState(null)
  const { id, roomData, roomCode, restIndex } = useAppContext();

  const isHost = roomData ? roomData.roomMembers[id].isHost : false;

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
    <div className="bg-gray-100 min-h-screen px-4 py-0 flex flex-col justify-center items-center">
      <FeedCard
        place={roomData.restaurants[restIndex].place}
        onVoteChange={handleVoteChange}
        onSkip={skipRestaurant}
        isHost={isHost}
      />
    </div>
  );
};

