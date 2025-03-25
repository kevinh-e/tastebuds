"use client";

import { useState } from "react";
import { useAppContext } from "@/context/AppContext.jsx";
import { socket } from "@/socket.js";

socket.on('syncData', (msg) => {
    console.log("Client got a syncData event!");
    console.log(msg);
});

export default function RoomPage() {
    const { id, roomCode, setRoomCode } = useAppContext();

    const [roundTime, setRoundTime] = useState(60);
    const [joinCode, setJoinCode] = useState("");
    const [response, setResponse] = useState(null);
    const [error, setError] = useState("");

    const handleCreateRoom = () => {
        setError("");
        socket.emit("createRoom", roundTime, id, (data) => {
            const parsed = JSON.parse(data);
            setRoomCode(parsed.roomSettings.roomCode);
            setResponse(parsed);
        });
    };


    const handleJoinRoom = () => {
        setError("");
        if (!joinCode) {
            setError("Please enter a room code.");
            return;
        }

        socket.emit("joinRoom", id, (data) => {
            const parsed = JSON.parse(data);
            if (parsed.roomSettings?.roomCode === joinCode.toUpperCase()) {
                setRoomCode(joinCode.toUpperCase());
                setResponse(parsed);
            } else {
                setError("Invalid room code.");
            }
        });
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-3xl font-bold text-center">Join or Create a Room</h1>

            {/* Create Room Section */}
            <div className="p-4 border rounded shadow-md">
                <h2 className="text-xl font-semibold mb-2">Create Room (Host)</h2>
                <label className="block mb-2">
                    Round Time (seconds):
                    <input
                        type="number"
                        value={roundTime}
                        onChange={(e) => setRoundTime(parseInt(e.target.value))}
                        className="border rounded p-2 ml-2 w-24"
                    />
                </label>
                <button
                    onClick={handleCreateRoom}
                    className="bg-green-500 text-white px-4 py-2 rounded"
                >
                    Create Room
                </button>
            </div>

            {/* Join Room Section */}
            <div className="p-4 border rounded shadow-md">
                <h2 className="text-xl font-semibold mb-2">Join Room (Guest)</h2>
                <label className="block mb-2">
                    Room Code:
                    <input
                        type="text"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                        className="border rounded p-2 ml-2 w-32 uppercase"
                    />
                </label>
                <button
                    onClick={handleJoinRoom}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Join Room
                </button>
                {error && <p className="text-red-600 mt-2">{error}</p>}
            </div>

            {/* Debug / Response Section */}
            {response && (
                <div className="p-4 border rounded bg-gray-100 text-sm">
                    <h3 className="font-bold mb-1">Room Info</h3>
                    <p><strong>Your ID:</strong> {id}</p>
                    <p><strong>Room Code:</strong> {roomCode}</p>
                    <pre className="mt-2">{JSON.stringify(response, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}
