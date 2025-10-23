import { useRef, useEffect } from "react";
import type { ChatType, Message } from "@/app/(root)/types/chat";
import type { Socket } from "socket.io-client";
import { trpc } from "@/utils/trpc";
import { useQueryClient } from "@tanstack/react-query";

export const useSendMessage = (chat: ChatType | undefined | null, roomId: string, socket: Socket) => {
    const queryClient = useQueryClient();
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatDetailsKey = trpc.chat.getChatDetails.queryKey({ room_id: roomId });
    useEffect(() => {
        socket.on("connect", () => {
            console.log("Connected to server");
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from server");
        });
        socket.on("message", (msg: Message) => {
            queryClient.setQueryData(chatDetailsKey, (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    messages: [...old.messages, msg]
                };
            });
        });
        socket.on("message_status_updated", (data: { messageIds: string[]; status: string }) => {
            queryClient.setQueryData(chatDetailsKey, (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    messages: old.messages.map((message: Message) =>
                        data.messageIds.includes(message.id)
                            ? { ...message, status: data.status as any }
                            : message
                    )
                };
            });
        });
        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("message");
            socket.off("message_status_updated");
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
    }, [[chat?.messages]]);

    return {
        messagesEndRef
    }

}

