"use client";
import type { ChatType } from "@/app/(root)/types/chat";
import { useEffect } from "react";
import type { Socket } from "socket.io-client";
import ChatAvatar from "../../../components/chat-avatar";
import { useMessageStatus } from "../hooks/use-message-status";
import { useSendMessage } from "../hooks/use-send-message";
import { getSenderName } from "../utils/get-sender-name";
import { ImageMessages } from "./messages/image-messages";
import { MessageReactions } from "./messages/message-reactions";
import { MessageReactionsList } from "./messages/message-reactions-list";
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

    const getUserImageForMessage = (messageSenderId: string) => {
        if (!chat?.members) return "";
        const member = chat.members.find(m => m.user.id === messageSenderId);
        return member?.user.image || "";
    };


    const reactions = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

    return (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 hide-scrollbar">
            {chat?.messages.length === 0 ? (
                <div className="flex items-center justify-center h-[calc(100%-32px)]">
                    <p className="text-muted-foreground">No messages yet. Start a conversation!</p>
                </div>
            ) : (
                chat?.messages.map((message) => {
                    const user_image = getUserImageForMessage(message.senderId);
                    const isMyMessage = message.senderId === sender_id;
                    return (
                        <div key={message.id} className="relative group">
                            <div className={`flex gap-x-2 ${isMyMessage ? "justify-end" : "justify-start"}`}>
                                {/* Message Reactions Component for own messages*/}
                                {message.type !== "SYSTEM" && isMyMessage && (
                                    // Emoji picker component
                                    <MessageReactions
                                        messageId={message.id}
                                        isMyMessage={isMyMessage}
                                    />
                                )}
                                {message.type !== "SYSTEM" && !isMyMessage && chat?.members && chat.type === "GROUP" && (
                                    <ChatAvatar
                                        recipientName={getSenderName(chat.members, message.senderId)}
                                        size="h-8 w-8"
                                        user_image={user_image ?? undefined}
                                    />
                                )}
                                {message.type === "SYSTEM" && <SystemMessages message={message} />}
                                {message.type === "TEXT" && <TextMessages message={message} sender_id={sender_id} chat={chat} />}
                                {message.type === "IMAGE" && <ImageMessages message={message} sender_id={sender_id} />}
                                {message.type === "FILE" && null}
                                {/* Message Reactions Component for others messages*/}
                                {message.type !== "SYSTEM" && !isMyMessage && (
                                    // Emoji picker component
                                    <MessageReactions
                                        messageId={message.id}
                                        isMyMessage={isMyMessage}
                                    />
                                )}
                            </div>
                            {/* Existing Reactions Display message.reactions and message.reactions.length*/}
                            {message.type !== "SYSTEM" && message.reaction && message.reaction.length > 0 && (
                                <MessageReactionsList reactions={message.reaction} isMyMessage={isMyMessage} />
                            )}
                        </div>
                    )
                })
            )}
            <div ref={messagesEndRef} />
        </div>
    );
}

export default Messages;