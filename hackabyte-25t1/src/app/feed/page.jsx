"use client"

import { useEffect, useState } from "react"
import { useAppContext } from "@/context/AppContext"
import { FeedCard } from "./feed-card"

import { socket } from "@/socket.js";
import { Button } from "@/components/ui/button";

// socket.on('syncData', (msg) => {
//   // setResponse(JSON.parse(msg));
//   setRoomData(JSON.parse(msg));
// });

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
      {
        currentVote && (
          <div
            className={`mt-8 p-4 rounded-lg shadow-md ${currentVote === "yes" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
              }`}
          >
            <p className="text-xl font-medium">
              You voted: <span className="font-bold">{currentVote.toUpperCase()}</span>
            </p>
            <p className="text-sm mt-1">Swipe {currentVote === "yes" ? "left" : "right"} to change your vote</p>
          </div>
        )
      }
    </div>
  );
};

