"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, CheckCheck, MoreVertical, Phone, Send, Video } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { socketClient } from "@/lib/socketClient";
import { getRecipientName } from "../utils/get-recipient-name";
import ChatAvatar from "../../components/chat-avatar";

// Define the Message type
interface Message {
    id: string;
    createdAt: string;
    updatedAt: string;
    type: "Text";
    content: string;
    senderId: string;
    roomId: string;
}

export default function ConversationPage() {
    const { chat_id } = useParams();
    const roomId = chat_id ? chat_id.toString() : "";
    const { data: chat, isLoading: chatLoading } = useQuery(
        trpc.chat.getChatDetails.queryOptions({
            room_id: roomId,
        }),
    );

    const session = authClient.useSession();
    const sender_id = session.data?.user.id;
    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const socket = useMemo(socketClient, []);

    useEffect(() => {
        // Set up event listeners
        socket.on("connect", () => {
            console.log("Connected to server");
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from server");
        });

        // Listen for messages from server
        socket.on("message", (msg: Message) => {
            setMessages(prev => [...prev, msg]);
        });

        // Clean up on unmount
        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("message");
        };
    }, [socket]);

    useEffect(() => {
        if (roomId.trim()) {
            socket.emit("join-room", roomId);

            return () => {
                socket.emit("leave-room", roomId);
            };
        }
    }, [roomId, socket]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = () => {
        if (!newMessage.trim() || !sender_id || !roomId) return;

        const messageData = {
            roomId: roomId,
            content: newMessage.trim(),
            senderId: sender_id,
        };

        socket.emit("send", messageData);
        setNewMessage("");
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "sent":
                return <Check size="15" />;
            case "delivered":
                return <CheckCheck size="15" className="opacity-70" />;
            case "read":
                return <CheckCheck size="15" className="text-blue-400" />;
            default:
                return "";
        }
    };

    const recipientName = getRecipientName(chat?.members);

    if (chatLoading) {
        return (
            <div className="w-full flex flex-col h-svh md:h-[calc(100vh-64px)] bg-background items-center justify-center">
                <div className="text-lg">Loading chat...</div>
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col h-svh md:h-[calc(100vh-64px)] bg-background">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-card border-b border-border">
                <div className="flex items-center gap-3">
                    <ChatAvatar recipientName={recipientName} size="h-10 w-10" />
                    <div>
                        <h2 className="font-semibold text-card-foreground">{recipientName}</h2>
                        <p className="text-sm text-muted-foreground">Online</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-card-foreground">
                        <Phone className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-card-foreground">
                        <Video className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-card-foreground">
                        <MoreVertical className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-muted-foreground">No messages yet. Start a conversation!</p>
                    </div>
                ) : (
                    messages.map((message) => (
                        <div key={message.id} className={`flex ${message.senderId === sender_id ? "justify-end" : "justify-start"}`}>
                            <div
                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.senderId === sender_id
                                    ? "bg-primary/90 dark:bg-primary/75 text-primary-foreground"
                                    : "bg-card text-card-foreground border border-border"
                                    }`}
                            >
                                <p className="text-sm leading-relaxed">{message.content}</p>
                                <div className="flex items-center justify-end mt-1 text-xs opacity-80">
                                    {formatTime(message.createdAt)}
                                    {message.senderId === sender_id && getStatusIcon("delivered")}
                                </div>
                            </div>
                        </div>
                    ))
                )}
                <div ref={messagesEndRef} />
            </div>
            {/* Input Area */}
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
        </div>
    );
}