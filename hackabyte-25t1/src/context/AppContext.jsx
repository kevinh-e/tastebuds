"use client"

import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const uid = Date.now().toString(36) + Math.random().toString(36).substr(2);
  const [id, setId] = useState("1");
  const [roomCode, setRoomCode] = useState("");

  const defaultRoomData = {
    roomMembers: {},
    restaurants: [],
    roomSettings: {}
  }
  const [roomData, setRoomData] = useState(defaultRoomData);

  useEffect(() => {
    localStorage.setItem("id", id);
  }, [id]);

  useEffect(() => {
    localStorage.setItem("roomCode", roomCode);
  }, [roomCode]);

  useEffect(() => {
    const dataToStore =
      roomData && Object.keys(roomData).length > 0
        ? roomData
        : defaultRoomData

    localStorage.setItem("roomData", JSON.stringify(dataToStore))
  }, [roomData])


  return (
    <AppContext.Provider value={{ id, setId, roomCode, setRoomCode, roomData, setRoomData }}>
      <AppContext.Provider value={{ id, setId, roomCode, setRoomCode, roomData, setRoomData }}>
        {children}
      </AppContext.Provider>
      );
};

export const useAppContext = () => useContext(AppContext);