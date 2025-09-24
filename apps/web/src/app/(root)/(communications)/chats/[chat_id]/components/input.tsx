"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { useState } from "react";
import type { Socket } from "socket.io-client";

interface MessageInputProps {
    sender_id: string | undefined,
    roomId: string,
    socket: Socket
}
export default function MessageInput({ sender_id, roomId, socket }: MessageInputProps) {
    const mutate = useMutation(trpc.messages.saveMessage.mutationOptions())
    const [newMessage, setNewMessage] = useState("");
    const handleSendMessage = () => {
        if (!newMessage.trim() || !sender_id || !roomId) return;

        const messageData = {
            roomId: roomId,
            content: newMessage.trim(),
            senderId: sender_id,
        };

        socket.emit("send", messageData);
        mutate.mutateAsync(messageData);

        setNewMessage("");
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };
    return (
        <div className="p-4 bg-card">
            <div className="flex items-center gap-2">
                <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyUp={handleKeyPress}
                    className="flex-1 bg-input border-border text-card-foreground placeholder:text-muted-foreground"
                />
                <Button
                    onClick={handleSendMessage}
                    size="icon"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full"
                    disabled={!newMessage.trim()}
                >
                    <Send className="size-4" />
                </Button>
            </div>
        </div>
    )
}