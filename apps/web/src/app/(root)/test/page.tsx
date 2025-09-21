"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { socketClient } from "@/lib/socketClient";
import { useEffect, useMemo, useState } from "react";

export default function TestPage() {
    const [message, setMessage] = useState("");
    const [room, setRoom] = useState("");
    const [receivedMessages, setReceivedMessages] = useState<string[]>([]);
    const [socketId, setSocketId] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const userId = authClient.useSession().data?.session.id;

    const socket = useMemo(socketClient, []);

    useEffect(() => {
        // Set up event listeners
        socket.on("connect", () => {
            setIsConnected(true);
            setSocketId(socket.id || "undefined");
        });

        socket.on("disconnect", () => {
            setIsConnected(false);
            setSocketId("");
        });

        // Listen for messages from server
        socket.on("message", (msg: any) => {
            setReceivedMessages(prev => [...prev, msg.content]);
        });

        // Clean up on unmount
        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("message");
        };
    }, [socket]);

    // Handle room joining/leaving when room changes
    useEffect(() => {
        if (room.trim()) {
            socket.emit("join-room", room);

            return () => {
                socket.emit("leave-room", room);
            };
        }
    }, [room, socket]);

    const handleClick = () => {
        if (message.trim() && room.trim()) {
            const msgData = {
                roomId: room,
                content: message,
                senderId: userId || "123"
            };
            socket.emit("send", msgData);
            setMessage("");
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Chat Room Test</h1>

            <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Room ID</label>
                <Input
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    placeholder="Enter room ID..."
                    className="mb-2"
                />
            </div>

            <div className="flex gap-2 mb-4">
                <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyPress={(e) => e.key === 'Enter' && handleClick()}
                />
                <Button onClick={handleClick} disabled={!room.trim()}>
                    Send
                </Button>
            </div>

            <div className="mt-4 p-2 border rounded">
                <p className="text-sm text-gray-500">Socket ID: {socketId || "Not connected"}</p>
                <p className="text-sm text-gray-500">Status: {isConnected ? "Connected" : "Disconnected"}</p>
                <p className="text-sm text-gray-500">Current Room: {room || "None"}</p>
            </div>

            <div className="mt-4">
                <h3 className="font-semibold mb-2">Received Messages:</h3>
                {receivedMessages.length === 0 ? (
                    <p className="text-gray-500">No messages yet</p>
                ) : (
                    <ul className="border rounded divide-y">
                        {receivedMessages.map((msg, index) => (
                            <li key={index} className="p-2">{msg}</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}