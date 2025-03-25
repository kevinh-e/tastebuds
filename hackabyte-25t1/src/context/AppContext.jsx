"use client"

import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const uid = Date.now().toString(36) + Math.random().toString(36).substr(2);
  const [id, setId] = useState(uid);

  useEffect(() => {
    localStorage.setItem("id", id);
  }, [id]);

  return (
    <AppContext.Provider value={{ id, setId }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
