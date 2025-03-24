"use client";

import { useEffect, useState } from "react";
import { socket } from "../socket";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [id, setId] = useState()

  useEffect(() => {

    socket.on('connect', () => {
      console.log('connected')
      setIsConnected(true);
      setId(socket.id);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  const click = () => {
    socket.emit('send-id', id);
  };

  return (
    <div>
      <p>Status: { isConnected ? "connected" : "disconnected" }</p>
      <button onClick={click} className="bg-green-500">ojwefojwe</button>
    </div>
  );
}
