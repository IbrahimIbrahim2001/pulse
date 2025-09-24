"use client";
import Link from "next/link"
import ChatMemberName from "./chat-member-name";
import type { ChatType } from "../../types/chat";
import ChatAvatar from "./chat-avatar";
import { getRecipientName } from "../chats/utils/get-recipient-name";
export default function Chat({ chat }: { chat: ChatType }) {
    const groupName = chat.type === "GROUP" ? chat.name : undefined
    const recipientName = getRecipientName(chat.members, groupName);
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
                        <ChatMemberName recipientName={recipientName} />
                        <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">2m</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate mt-1">hi sweet</p>
                </div>
            </div>
        </Link>
    )
}
