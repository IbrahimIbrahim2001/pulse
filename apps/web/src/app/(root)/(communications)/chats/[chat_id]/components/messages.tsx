"use client";
import type { ChatType } from "@/app/(root)/types/chat";
import type { Socket } from "socket.io-client";
import { useSendMessage } from "../hooks/use-send-message";
import { formatTime } from "../utils/format-time";
import { getStatusIcon } from "../utils/get-status-icon";
import { getSenderName } from "../utils/get-sender-name";
interface MessagesProps {
    sender_id: string | undefined,
    roomId: string,
    socket: Socket,
    chat: ChatType | undefined | null
}
const Messages = ({ sender_id, roomId, socket, chat }: MessagesProps) => {
    const { messages, messagesEndRef } = useSendMessage(chat, roomId, socket);
    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
                <div className="flex items-center justify-center h-[calc(100%-32px)]">
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
                            {(message.senderId !== sender_id && chat?.type === "GROUP") && <p className="text-primary text-xs mb-1 font-extrabold">{getSenderName(chat.members, message.senderId)}</p>}
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
    );
}

export default Messages;