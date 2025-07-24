"use client";

import { useAppContext } from "@/context/AppContext";
import TasteSelectForm from "./form";
import { socket } from "@/socket";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UsersList from "@/components/lobby/users-list";
import CopyButton from "@/components/ui/copy-button";
import { Users } from "lucide-react";

// socket.on('newUser', (msg) => {
//   toast(`👋   ${JSON.parse(msg).name} has joined the room`);
// });

export default function TasteSelect() {
  const { id, roomData, roomCode } = useAppContext();
  const [users, setUsers] = useState([]);

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

  return (
    <div className="min-h-screen flex justify-center items-center px-4 py-8">
      <div className="w-full max-w-md space-y-4">
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
    </div>
  );
}
