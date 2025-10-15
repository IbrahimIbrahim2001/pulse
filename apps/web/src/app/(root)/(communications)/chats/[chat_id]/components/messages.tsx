"use client";
import type { ChatType } from "@/app/(root)/types/chat";
import { useEffect } from "react";
import type { Socket } from "socket.io-client";
import ChatAvatar from "../../../components/chat-avatar";
import { useMessageStatus } from "../hooks/use-message-status";
import { useSendMessage } from "../hooks/use-send-message";
import { getSenderName } from "../utils/get-sender-name";
import { ImageMessages } from "./messages/image-messages";
import { SystemMessages } from "./messages/system-messages";
import { TextMessages } from "./messages/text-messages";
export interface MessagesProps {
    sender_id: string | undefined,
    roomId: string,
    socket: Socket,
    chat: ChatType | undefined | null
}
const Messages = ({ sender_id, roomId, socket, chat }: MessagesProps) => {
    const { messagesEndRef } = useSendMessage(chat, roomId, socket);
    const { markAsSeen } = useMessageStatus(socket, roomId, sender_id);
    const markVisibleMessagesAsSeen = () => {
        if (!sender_id || !chat?.messages || chat?.messages.length === 0) return;
        const othersMessages = chat?.messages.filter(msg =>
            msg.senderId !== sender_id &&
            msg.status !== 'SEEN'
        );
        if (othersMessages.length > 0) {
            markAsSeen(othersMessages.map(msg => msg.id));
        }
    };
    useEffect(() => {
        markVisibleMessagesAsSeen();
    }, [chat?.messages, sender_id]);
    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar">
            {chat?.messages.length === 0 ? (
                <div className="flex items-center justify-center h-[calc(100%-32px)]">
                    <p className="text-muted-foreground">No messages yet. Start a conversation!</p>
                </div>
            ) : (
                chat?.messages.map((message) => (
                    <div key={message.id} className={`flex gap-x-2 ${message.senderId === sender_id ? "justify-end" : "justify-start"}`}>
                        {message.type !== "SYSTEM" && sender_id !== message.senderId && chat?.members && chat.type === "GROUP" && <ChatAvatar recipientName={getSenderName(chat.members, message.senderId)} size="h-8 w-8" />}
                        {message.type === "SYSTEM" && <SystemMessages message={message} />}
                        {message.type === "TEXT" && <TextMessages message={message} sender_id={sender_id} chat={chat} />}
                        {message.type === "IMAGE" && <ImageMessages message={message} sender_id={sender_id} />}
                        {message.type === "FILE" && null}
                    </div>
                ))
            )}
            <div ref={messagesEndRef} />
        </div>
    );
}

export default Messages;