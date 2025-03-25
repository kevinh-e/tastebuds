"use client"

import { useEffect, useState } from "react"
import { useAppContext } from "@/context/AppContext"
import { FeedCard } from "./feed-card"
import { socket } from "@/socket.js";
import { toast } from "sonner";
import { CheckCircle, XCircle } from "lucide-react";
import { RestaurantReactions } from "./restaurant-reactions";

export default function FeedPage() {
  const [currentVote, setCurrentVote] = useState(null)
  const [userReaction, setUserReaction] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const { id, roomData, roomCode, restIndex, setRoomData } = useAppContext();
  const [userLocation, setUserLocation] = useState(null)

  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setUserLocation({ latitude, longitude });
          },
          (error) => {
            console.error("Error getting user location:", error);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    };

    getUserLocation();
  }, []);

  useEffect(() => {
    socket.on("voteToast", ({ userName, vote }) => {
      if (vote !== null) {
        const noToast = () => {
          toast(`${userName}`,
          {
            icon: <XCircle className="text-red-500" />, 
            style: { backgroundColor: "#ffe2e2", color: "black", width: "128px" }
          })
        }
        const yesToast = () => {
          toast(`${userName}`, {
            icon: <CheckCircle className="text-green-500" />, 
            style: { backgroundColor: "#dcfce7", color: "black", width: "128px" }
          })
        }

        if (vote === "yes") {
          yesToast();
        } else if (vote === "no") {
          noToast();
        }
      }
    })

    return () => {
      socket.off("voteToast");
    }
  }, []);

  useEffect(() => {
    if (roomData) {
      setIsHost(roomData.roomMembers[id].isHost)
    }
  }, [roomData]);
  const [msLeft, setMsLeft] = useState(0);
  const [hasEmitted, setHasEmitted] = useState(false);

  const skipRestaurant = () => {
    if (socket.connected && roomCode !== "") {
      socket.emit("nextRestaurant", roomCode, Date.now());
    }
  }

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
    return (
      <div className="flex justify-center items-center h-screen text-xl font-medium text-gray-600">
        Loading...
      </div>
    );

  }

  return (
    <div className="bg-gray-100 min-h-screen px-4 py-0 flex flex-col justify-center items-center">
      <FeedCard
        place={roomData.restaurants[roomData.roomSettings.restIndex].place}
        progress={progress}
        reactions={
          roomData.restaurants[roomData.roomSettings.restIndex].reactions
        }
        onVoteChange={handleVoteChange}
        onSkip={skipRestaurant}
        isHost={isHost}
        location={userLocation}
      />
      <div className="mt-6 w-full max-w-md">
        <RestaurantReactions onReactionChange={handleReactionChange} currentReaction={userReaction} />
      </div>
    </div>
  );
};
