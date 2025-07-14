"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users, UserPlus } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useAppContext } from "@/context/AppContext.jsx";
import { socket } from "@/socket.js";
import FloatingBubbles from "@/components/floating-bubbles";

export default function PreLobbyPage() {
  const { id, setRoomCode, setRoomData } = useAppContext();
  const router = useRouter();
  const [lobbyCode, setLobbyCode] = useState("");
  const [hostName, setHostName] = useState("");
  const [roundTime, setRoundTime] = useState(10);
  const [joinName, setJoinName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    socket.on("syncData", (msg) => {
      setRoomData(JSON.parse(msg));
    });
    socket.on("gotoResults", () => {
      router.push("/results");
    });
  }, []);

  const handleCreateLobby = () => {
    setLoading(true);
    if (!hostName.trim() || !roundTime) {
      setLoading(false);
      setError("Please fill in all required fields");
      return;
    }
    socket.emit("createRoom", roundTime, id, hostName, (data) => {
      setRoomCode(data);
    });
    setLoading(false);
    router.push("/taste-select");
  };

  const handleJoinLobby = () => {
    if (!lobbyCode.trim() || !joinName.trim()) {
      setError("Please fill in all required fields");
      return;
    }
    socket.emit("joinRoom", lobbyCode, id, joinName, (data) => {
      setRoomCode(data);
    });
    router.push("/taste-select");
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-white to-orange-300 p-4 overflow-hidden">

      <FloatingBubbles />

      <Card className="w-full max-w-md relative z-10 bg-white shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl select-none">
            <span className="font-light">taste/</span>
            <span className="font-semibold text-orange-500">buds</span>
          </CardTitle>
          <CardDescription>Find the best taste for your buds.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="host" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="host" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" /> Host
              </TabsTrigger>
              <TabsTrigger value="join" className="flex items-center gap-2">
                <Users className="h-4 w-4" /> Join
              </TabsTrigger>
            </TabsList>
            <TabsContent value="host" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="hostName">Your Name</Label>
                <Input id="hostName" placeholder="Enter your name" value={hostName} onChange={(e) => setHostName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="roundTime">Round Time</Label>
                  <span className="text-sm font-medium">{roundTime} seconds</span>
                </div>
                <Slider id="roundTime" min={5} max={60} step={1} value={[roundTime]} onValueChange={(value) => setRoundTime(value[0])} className="py-4" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>5s</span>
                  <span>60s</span>
                </div>
              </div>
              <Button 
              type="submit" 
              onClick={handleCreateLobby}
              size="lg" 
              className={`w-full ${loading ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600'}`} 
              disabled={loading}
            >
              {loading ? "Creating..." : "Create a New Lobby"}
            </Button>
            </TabsContent>
            <TabsContent value="join" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="joinName">Your Name</Label>
                <Input id="joinName" placeholder="Enter your name" value={joinName} onChange={(e) => setJoinName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lobbyCode">Lobby Code</Label>
                <Input id="lobbyCode" placeholder="Enter lobby code" value={lobbyCode} onChange={(e) => setLobbyCode(e.target.value)} />
              </div>
              <Button onClick={handleJoinLobby} className="w-full">Join Lobby</Button>
            </TabsContent>
          </Tabs>
          {error && <p className="mt-4 text-center text-sm text-red-500">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
}