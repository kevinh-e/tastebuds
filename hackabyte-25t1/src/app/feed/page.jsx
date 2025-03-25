"use client"

import { useEffect, useState } from "react"
import { useAppContext } from "@/context/AppContext"
import { FeedCard } from "./feed-card"
import { socket } from "@/socket.js";

export default function FeedPage() {
  const [currentVote, setCurrentVote] = useState(null)
  const { id, setRoomData, roomData, roomCode } = useAppContext();
  const [msLeft, setMsLeft] = useState(0);
  const [hasEmitted, setHasEmitted] = useState(false);

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

  // Prevent rendering invalid restaurant index
  if (!roomData.restaurants ||
    roomData.roomSettings.restIndex === -1 ||
    roomData.roomSettings.restIndex >= roomData.restaurants.length) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-8 flex flex-col items-center justify-center">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Swipe to Vote</h1>
        <p className="text-gray-600">Swipe right for Yes, left for No. You can change your vote anytime.</p>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
          <div
            className="bg-blue-600 rounded-full h-2 transition-all duration-100"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      <FeedCard
        place={roomData.restaurants[roomData.roomSettings.restIndex].place}
        onVoteChange={handleVoteChange}
      />

      {currentVote && (
        <div className={`mt-8 p-4 rounded-lg shadow-md ${currentVote === "yes" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}>
          <p className="text-xl font-medium">
            You voted: <span className="font-bold">{currentVote.toUpperCase()}</span>
          </p>
          <p className="text-sm mt-1">Swipe {currentVote === "yes" ? "left" : "right"} to change your vote</p>
        </div>
      )}
    </div>
  );
};