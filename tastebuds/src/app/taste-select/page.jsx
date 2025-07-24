"use client";

import { useRouter } from "next/navigation"
import { useAppContext } from "@/context/AppContext";
import TasteSelectForm from "./form";
import { socket } from "@/socket";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"
import Link from "next/link"
import UsersList from "@/components/lobby/users-list";
import CopyButton from "@/components/ui/copy-button";
import { ChevronLeft, Users } from "lucide-react";

// socket.on('newUser', (msg) => {
//   toast(`👋   ${JSON.parse(msg).name} has joined the room`);
// });

export default function TasteSelect() {
  const { id, roomData, roomCode, setRoomData } = useAppContext();
  const [users, setUsers] = useState([]);
  const router = useRouter();
  console.log(id);

  // Listen for the list of other users when the component mounts
  useEffect(() => {
    const newUsers = [];
    if (roomData?.roomMembers === undefined) return;
    Object.entries(roomData?.roomMembers).forEach(([key, member]) => {
      member["id"] = key;
      newUsers.push(member);
    });
    setUsers(newUsers);
  }, [roomData]);

  const handleLeaveRoom = useCallback(() => {
    if (!roomCode || !id) {
      router.push("/")
      return
    }

    // emit leaveRoom, clear local state, then navigate home
    socket.emit("leaveRoom", roomCode, id, () => {
      // optional callback from server
      setRoomData(null)
      router.push("/")
    })
  }, [roomCode, id, router, setRoomData])

  return (
    <div className="min-h-screen flex justify-center items-center px-4 py-8">
      <div className="w-full max-w-md space-y-4">
        <div className="mb-6 flex justify-between items-center">
          <Button variant="ronaldo" size="sm" className="flex items-center text-sm" onClick={handleLeaveRoom}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Exit
          </Button>
        </div>
        {users.length > 0 && (
          <Card className="w-full">
            <CardContent>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-orange-500" />
                  <div className="text-lg font-semibold">Buddies</div>
                </div>
                <CopyButton
                  className="text-muted-foreground cursor-pointer"
                  textToCopy={roomCode}
                  displayText={roomCode}
                />
              </div>
              <UsersList users={users} currentUserId={id} />
            </CardContent>
          </Card>
        )}

        <TasteSelectForm />
      </div>
    </div >
  );
}
