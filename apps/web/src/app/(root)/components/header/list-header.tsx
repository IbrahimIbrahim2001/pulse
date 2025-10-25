"use client";

import { usePathname } from "next/navigation";

import ChatsHeader from "./chat-header";
import StatusHeader from "./status-header";
import { CallsHeader } from "./calls-header";
export default function ListHeader() {
    const pathname = usePathname();
    if (pathname.includes("chats")) return <ChatsHeader />
    else if (pathname.includes("calls")) return <CallsHeader />
    return <StatusHeader />
}