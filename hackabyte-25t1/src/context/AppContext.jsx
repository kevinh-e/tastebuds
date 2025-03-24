"use client"

import { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [id, setId] = useState(0);
  const [lobbyCode, setLobbyCode] = useState("");

  return (
    <AppContext.Provider value={{ id, setId, lobbyCode, setLobbyCode }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
