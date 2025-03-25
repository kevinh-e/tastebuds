"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { Users, UserPlus } from "lucide-react"

export default function PreLobbyPage() {
  const router = useRouter()
  const [lobbyName, setLobbyName] = useState("")
  const [lobbyCode, setLobbyCode] = useState("")
  const [hostName, setHostName] = useState("")
  const [joinName, setJoinName] = useState("")
  const [error, setError] = useState("")

  const handleCreateLobby = async () => {
    if (!lobbyName.trim() || !hostName.trim()) {
      setError("Please fill in all required fields")
      return
    }
  }

  const handleJoinLobby = async () => {
    if (!lobbyCode.trim() || !joinName.trim()) {
      setError("Please fill in all required fields")
      return
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-white to-gray-500 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Game Lobby</CardTitle>
          <CardDescription>Host or join a game session</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="host" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="host" className="flex items-center gap-2">
                <UserPlus className="h-4 w-4" />
                Host
              </TabsTrigger>
              <TabsTrigger value="join" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Join
              </TabsTrigger>
            </TabsList>
            <TabsContent value="host" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="hostName">Your Name</Label>
                <Input
                  id="hostName"
                  placeholder="Enter your name"
                  value={hostName}
                  onChange={(e) => setHostName(e.target.value)}
                />
              </div>
              <Button onClick={handleCreateLobby} className="w-full">
                Create a New Lobby
              </Button>
            </TabsContent>
            <TabsContent value="join" className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="joinName">Your Name</Label>
                <Input
                  id="joinName"
                  placeholder="Enter your name"
                  value={joinName}
                  onChange={(e) => setJoinName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lobbyCode">Lobby Code</Label>
                <Input
                  id="lobbyCode"
                  placeholder="Enter lobby code"
                  value={lobbyCode}
                  onChange={(e) => setLobbyCode(e.target.value)}
                />
              </div>
              <Button onClick={handleJoinLobby} className="w-full">
                Join Lobby
              </Button>
            </TabsContent>
          </Tabs>
          {error && <p className="mt-4 text-center text-sm text-red-500">{error}</p>}
        </CardContent>
        <CardFooter className="flex justify-center text-sm text-muted-foreground">
          Connect with friends and play together
        </CardFooter>
      </Card>
    </div>
  )
}


