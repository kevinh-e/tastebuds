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
  const { id, roomData, roomCode, restIndex, setRoomData } = useAppContext();

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
    console.log('jofwejoFJeowfjowfjeo')
    console.log(roomData?.restaurants[0].reactions);
  }, [roomData]);
  const [msLeft, setMsLeft] = useState(0);
  const [hasEmitted, setHasEmitted] = useState(false);

  const skipRestaurant = () => {
    if (socket.connected && roomCode !== "") {
      console.log("SKIPPING")
      socket.emit("nextRestaurant", roomCode, Date.now());
    }
  }

  useEffect(() => {
    console.log(`userReaction: ${userReaction}`);
  }, [userReaction]);

  // Handle synchronization when new restaurant starts
  useEffect(() => {
    const handleSyncData = (msg) => {
      const data = JSON.parse(msg);
      setRoomData(data);
      setHasEmitted(false);
    };

    socket.on('startNextCard', handleSyncData);
    return () => socket.off('startNextCard', handleSyncData);
  }, [setRoomData]);

  // Host initialization for first restaurant
  useEffect(() => {
    if (roomData?.roomSettings?.restIndex === -1 &&
      roomData.roomMembers?.[id]?.isHost) {
      const now = Date.now();
      socket.emit("nextRestaurant", roomCode, now);
    }
  }, [roomData, id, roomCode]);

  // Countdown timer logic for host
  useEffect(() => {
    const currentRestIndex = roomData.roomSettings.restIndex;

    if (currentRestIndex === -1) return;

    const interval = setInterval(() => {
      const restaurant = roomData.restaurants[currentRestIndex];
      if (!restaurant) return;

      const elapsed = Date.now() - restaurant.countDownStart;
      const remainingMs = roomData.roomSettings.roundTime * 1000 - elapsed;

      // if (!roomData?.roomMembers?.[id]?.isHost) return;

      if (remainingMs <= 0 && roomData?.roomMembers?.[id]?.isHost) {
        if (!hasEmitted) {
          socket.emit("nextRestaurant", roomCode, Date.now());
          setHasEmitted(true);
        }
      } else {
        setMsLeft(remainingMs);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [roomData, id, roomCode, hasEmitted]);

  // Timer progress for UI (all users)
  const progress = Math.max(0, msLeft / (roomData.roomSettings.roundTime * 1000));

  const handleVoteChange = (vote) => {
    setCurrentVote(vote)
    if (socket.connected && roomCode !== "") {
      socket.emit("sendUserVote", vote, id, roomCode,
        roomData.roomSettings.restIndex);
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

  // Prevent rendering invalid restaurant index
  if (!roomData.restaurants ||
    roomData.roomSettings.restIndex === -1 ||
    roomData.roomSettings.restIndex >= roomData.restaurants.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen px-4 py-0 flex flex-col justify-center items-center">
      <div
        className="bg-blue-600 rounded-full h-2 transition-all duration-100"
        style={{ width: `${progress * 100}%` }}
      />
      <FeedCard
        reactions={
          roomData.restaurants[roomData.roomSettings.restIndex].reactions
        }
        place={
          roomData.restaurants[roomData.roomSettings.restIndex].place
        }
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
