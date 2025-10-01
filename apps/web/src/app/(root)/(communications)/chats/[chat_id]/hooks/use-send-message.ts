import { useRef, useState, useEffect } from "react";
import type { ChatType, Message } from "@/app/(root)/types/chat";
import type { Socket } from "socket.io-client";

export const useSendMessage = (chat: ChatType | undefined | null, roomId: string, socket: Socket) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [messages, setMessages] = useState(() => chat?.messages ? [...chat.messages] : []);

    //     // Set up event listeners
    //     socket.on("connect", () => {
    //         console.log("Connected to server");
    //     });

    //     socket.on("disconnect", () => {
    //         console.log("Disconnected from server");
    //     });

    //     // Listen for messages from server
    //     socket.on("message", (msg: Message) => {
    //         setMessages(prev => [...prev, msg]);
    //     });

    //     // Clean up on unmount
    //     return () => {
    //         socket.off("connect");
    //         socket.off("disconnect");
    //         socket.off("message");
    //     };
    // }, [socket]);
    // Add this to your existing useSendMessage useEffect:
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

        // ADD THIS: Listen for status updates
        socket.on("message_status_updated", (data: { messageIds: string[]; status: string }) => {
            setMessages(prev => prev.map(message =>
                data.messageIds.includes(message.id)
                    ? { ...message, status: data.status as any }
                    : message
            ));
        });

        // Clean up on unmount
        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("message");
            socket.off("message_status_updated"); // ADD THIS
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

    return {
        messages,
        messagesEndRef
    }

}

