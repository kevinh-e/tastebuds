"use client"

import { useEffect, useState } from "react"
import { useAppContext } from "@/context/AppContext"
import { FeedCard } from "./feed-card"

import { socket } from "@/socket.js";
import { toast } from "sonner";
import { RestaurantReactions } from "./restaurant-reactions";

export default function FeedPage() {
  const [currentVote, setCurrentVote] = useState(null)
  const [userReaction, setUserReaction] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const { id, roomData, roomCode, restIndex } = useAppContext();

  useEffect(() => {
    socket.on("reactionToast", ({ userName, reaction }) => {
      if (reaction !== null) {
        toast(`${userName} reacted with ${reaction}`);
      }
    })

    return () => {
      socket.off("reactionToast");
    }
  }, []);

  useEffect(() => {
    if (roomData) {
      setIsHost(roomData.roomMembers[id].isHost)
    }
    console.log(isHost);
  }, [roomData]);

  const handleVoteChange = (vote) => {
    setCurrentVote(vote)
    if (socket.connected && roomCode !== "") {
      socket.emit("sendUserVote", vote, id, roomCode, restIndex, res => {
        console.log("votes");
        console.log(res);
      });
    }
  }

  const handleReactionChange = (reaction) => {
    setUserReaction(reaction)
    if (socket.connected && roomCode !== "") {
      socket.emit("sendUserReaction", reaction, id, roomCode, restIndex, res => {
        console.log("reaction");
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

  useEffect(() => {
    console.log(`userReaction: ${userReaction}`)
  }, [userReaction]);

  return (
    <div className="bg-gray-100 min-h-screen px-4 py-0 flex flex-col justify-center items-center">
      <FeedCard
        reactions={roomData.restaurants[restIndex].reactions}
        place={roomData.restaurants[restIndex].place}
        onVoteChange={handleVoteChange}
        onSkip={skipRestaurant}
        isHost={isHost}
      />
      <div className="mt-6 w-full max-w-md">
        <RestaurantReactions onReactionChange={handleReactionChange} currentReaction={userReaction} />
      </div>
    </div>
  );
};

