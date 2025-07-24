"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Users, UserPlus, X, HelpCircle } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { useAppContext } from "@/context/AppContext.jsx"
import { socket } from "@/socket.js"
import FloatingBubbles from "@/components/floating-bubbles"

export default function PreLobbyPage() {
  const { id, setRoomCode, setRoomData } = useAppContext()
  const router = useRouter()
  const [lobbyCode, setLobbyCode] = useState("")
  const [hostName, setHostName] = useState("")
  const [roundTime, setRoundTime] = useState(10)
  const [joinName, setJoinName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)

  useEffect(() => {
    socket.on("syncData", (msg) => {
      setRoomData(JSON.parse(msg))
    })

    socket.on("gotoResults", () => {
      router.push("/results")
    })
  }, [])

  const handleCreateLobby = () => {
    setLoading(true)
    if (!hostName.trim() || !roundTime) {
      setLoading(false)
      setError("Please fill in all required fields")
      return
    }

    socket.emit("createRoom", roundTime, id, hostName, (data) => {
      setRoomCode(data)
    })
    setLoading(false)
    router.push("/taste-select")
  }

  const handleJoinLobby = () => {
    if (!lobbyCode.trim() || !joinName.trim()) {
      setError("Please fill in all required fields")
      return
    }

    socket.emit("joinRoom", lobbyCode, id, joinName, (data) => {
      setRoomCode(data)
    })
    router.push("/taste-select")
  }

  const handleOTPChange = (value) => {
    // Remove non-alphanumeric characters and convert to uppercase
    const sanitized = value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()
    setLobbyCode(sanitized)
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-white to-orange-300 p-4 overflow-hidden">
      <FloatingBubbles />
      {/* Tutorial Modal */}
      {showTutorial && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowTutorial(false)}
          aria-label="Close tutorial overlay"
        >
          <Card
            className="w-full max-w-md mx-auto relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-orange-500 cursor-pointer p-2 rounded-full"
              onClick={() => setShowTutorial(false)}
              aria-label="Close tutorial"
            >
              <X className="h-6 w-6" />
            </button>
            <CardHeader className="text-center">
              <CardTitle className="text-xl font-bold text-orange-500">TasteBuds: How to Play</CardTitle>
              <CardDescription>Quick guide to get started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal list-inside space-y-2 text-left">
                <li><b>Host or Join:</b> Start a new room as host, or join a friend's room with their code.</li>
                <li><b>Set Preferences:</b> Choose your favorite cuisines, locations, and price range.</li>
                <li><b>Vote:</b> Swipe or tap Yes/No on restaurants as they appear. React and discuss with friends!</li>
                <li><b>Results:</b> When all restaurants are reviewed, see the top picks and make plans!</li>
              </ol>
              <div className="text-sm text-muted-foreground">You can revisit this tutorial anytime from the main page.</div>
            </CardContent>
          </Card>
        </div>
      )}
      {/* Main Card */}
      <Card className="w-full max-w-md relative z-10 bg-white shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl select-none">
            <span className="font-light">taste/</span>
            <span className="font-semibold text-orange-500">buds</span>
          </CardTitle>
          <CardDescription>Find the best taste for your buds.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            className="mb-4 w-full border-orange-300 text-orange-500 hover:bg-orange-50 cursor-pointer"
            onClick={() => setShowTutorial(true)}
          >
            <HelpCircle className="inline-block mr-2 h-5 w-5" />
            How to Play
          </Button>
          <Tabs defaultValue="host" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="host" className="flex items-center gap-2 cursor-pointer">
                <UserPlus className="h-4 w-4" /> Host
              </TabsTrigger>
              <TabsTrigger value="join" className="flex items-center gap-2 cursor-pointer">
                <Users className="h-4 w-4" /> Join
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
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="roundTime">Round Time</Label>
                  <span className="text-sm font-medium">{roundTime} seconds</span>
                </div>
                <Slider
                  id="roundTime"
                  min={5}
                  max={60}
                  step={1}
                  value={[roundTime]}
                  onValueChange={(value) => setRoundTime(value[0])}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>5s</span>
                  <span>60s</span>
                </div>
              </div>
              <Button
                type="submit"
                onClick={handleCreateLobby}
                size="lg"
                className={`w-full ${loading ? "bg-orange-400 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"}`}
                disabled={loading}
              >
                {loading ? "Creating..." : "Create a New Lobby"}
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
                <div className="flex justify-center">
                  <InputOTP maxLength={6} value={lobbyCode} onChange={handleOTPChange}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
              </div>
              <Button onClick={handleJoinLobby} className="w-full cursor-pointer">
                Join Lobby
              </Button>
            </TabsContent>
          </Tabs>
          {error && <p className="mt-4 text-center text-sm text-red-500">{error}</p>}
        </CardContent>
      </Card>
    </div>
  )
}
