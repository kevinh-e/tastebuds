"use client";

import { useAppContext } from "@/context/AppContext";
import TasteSelectForm from "./form";
import { socket } from "@/socket";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UsersList from "@/components/lobby/users-list";
import CopyButton from "@/components/ui/copy-button";

socket.on('newUser', (msg) => {
  toast(`👋   ${JSON.parse(msg).name} has joined the room`);
});

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
    <div className="h-screen flex flex-col items-center justify-center px-4">
      <TasteSelectForm />
      {users.length > 0 && (
        <Card className="mt-2 w-full max-w-md">
          <CardHeader>
            <CardTitle>Buddies</CardTitle>
          </CardHeader>
          <CardContent>
            <UsersList users={users} currentUserId={id} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
