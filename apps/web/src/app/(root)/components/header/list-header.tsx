"use client";

import { usePathname } from "next/navigation";

import ChatsHeader from "./chat-header";
import StatusHeader from "./status-header";
import { CallsHeader } from "./calls-header";
import { ArchivedChatsHeader } from "./archived-chat-header";
import { StarredMessageHeader } from "./starred-messages-header";
export default function ListHeader() {
    const pathname = usePathname();
    if (pathname.includes("archived-chats")) return <ArchivedChatsHeader />
    else if (pathname.includes("chats") || pathname.includes("chats/")) return <ChatsHeader />
    else if (pathname.includes("calls")) return <CallsHeader />
    else if (pathname.includes("starred-messages")) return <StarredMessageHeader />
    return <StatusHeader />
}