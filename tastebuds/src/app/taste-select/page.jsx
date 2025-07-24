"use client"

import { useAppContext } from "@/context/AppContext"
import TasteSelectForm from "./form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import UsersList from "@/components/lobby/users-list"
import CopyButton from "@/components/ui/copy-button"
import { Users } from "lucide-react"

// socket.on('newUser', (msg) => {
//   toast(`👋   ${JSON.parse(msg).name} has joined the room`);
// });

export default function TasteSelect() {
  const { id, roomData, roomCode } = useAppContext()

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-6">
      <div className="flex-1 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full min-h-[calc(100vh-2rem)] md:min-h-[calc(100vh-3rem)]">
          {/* Users Panel */}
          <Card className="lg:col-span-1 flex flex-col">
            <CardHeader className="flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-orange-500" />
                  <CardTitle className="text-lg">Buddies</CardTitle>
                </div>
                <CopyButton className="text-muted-foreground text-sm" textToCopy={roomCode} displayText={roomCode} />
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0 px-6 pb-2">
              <div className="h-full overflow-y-auto pt-1">
                <UsersList users={roomData.roomMembers} currentUserId={id} />
              </div>
            </CardContent>
          </Card>

          {/* Main Content Panel */}
          <div className="lg:col-span-2 flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
              <TasteSelectForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
