"use client"

import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const uid = Date.now().toString(36) + Math.random().toString(36).substr(2);
  const [id, setId] = useState(uid);
  const [roomCode, setRoomCode] = useState("");
  const [roomData, setRoomData] = useState(null);
  const [restIndex, setRestIndex] = useState(0);

  useEffect(() => {
    localStorage.setItem("id", id);
  }, [id]);

  useEffect(() => {
    localStorage.setItem("roomCode", roomCode);
    console.log(roomCode);
  }, [roomCode]);

  useEffect(() => {
    localStorage.setItem("roomData", roomData);
    localStorage.setItem("restIndex", roomData.roomSettings.restIndex);
    console.log(roomData);
  }, [roomData]);

  return (
    <AppContext.Provider value={{ id, setId, roomCode, setRoomCode, roomData, setRoomData, restIndex, setRestIndex }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
