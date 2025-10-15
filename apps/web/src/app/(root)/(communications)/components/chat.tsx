"use client";
import Link from "next/link"
import ChatMemberName from "./chat-member-name";
import type { ChatType } from "../../types/chat";
import ChatAvatar from "./chat-avatar";
import { getRecipientName } from "../chats/utils/get-recipient-name";
import { Badge } from "@/components/ui/badge";
import { formatLastMessageTime } from "../utils/format-last-message-time";
import { useMutation } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { authClient } from "@/lib/auth-client";
import { useEffect } from "react";
export default function Chat({ chat }: { chat: ChatType }) {
    const mutate = useMutation(trpc.messages.updateMessageStatus.mutationOptions());
    const currentUserId = authClient.useSession().data?.session.userId;
    const groupName = chat.type === "GROUP" ? chat.name : undefined
    const recipientName = getRecipientName(chat.members, groupName);
    const lastMsg = chat.messages[chat?.messages.length - 1]?.content;
    const lastMsgDate = chat.messages[chat?.messages.length - 1]?.createdAt;
    const formattedTime = lastMsgDate ? formatLastMessageTime(lastMsgDate) : "";
    const unreadReceivedMessages = chat.messages.filter(msg =>
        msg.senderId !== currentUserId && msg.status === "SENT"
    );
    const unreadMessagesCount = unreadReceivedMessages.length;
    const HandleMessageStatus = () => {
        if (unreadMessagesCount > 0) {
            mutate.mutateAsync({
                message_ids: unreadReceivedMessages.map(msg => msg.id),
                status: "DELIVERED"
            })
        }
    }
    useEffect(() => {
        HandleMessageStatus();
    }, [unreadMessagesCount]);
    return (
        <Link
            href={{
                pathname: `../chats/${chat.id}`,
            }}
            className="block"
        >
            <div className="flex items-center w-full p-4 hover:bg-muted/50 transition-colors duration-200 border-b border-border/50 group">
                <ChatAvatar recipientName={recipientName} size="h-12 w-12" />
                <div className="flex flex-col justify-center ml-4 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <ChatMemberName recipientName={recipientName} />
                            <p className={`text-sm text-muted-foreground truncate ${unreadMessagesCount > 0 ? "font-semibold text-foreground/80 dark:text-white/80" : ""}`}>{lastMsg}</p>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                            <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">{formattedTime}</span>
                            {unreadMessagesCount > 0 ? <Badge variant="secondary" className="rounded-full size-4 flex items-center justify-center text-muted-foreground/80 font-semibold">{unreadMessagesCount}</Badge> : null}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}