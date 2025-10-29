"use client";
import ChatList from "@/app/(root)/(communications)/components/chat-list";
import { usePathname } from "next/navigation";
import AddButton from "../../components/add-button";
import { StatusList } from "./status-list";
import { EmptyCalls } from "./empty-calls";
import { ArchivedChatsList } from "./archived-chat-list";
import { StarredMessageList } from "./starred-message-list";


export default function List() {
    const pathname = usePathname();
    if (pathname.includes("archived-chats")) return <ArchivedChatsComponent />
    else if (pathname.includes("chats")) return <ChatComponent />
    else if (pathname.includes("calls")) return <CallsComponent />
    else if (pathname.includes("starred-messages")) return <StarredMessagesComponent />
    else if (pathname.includes("settings")) return null
    else if (pathname.includes("profile")) return null
    return <StatusComponent />
}

function ChatComponent() {
    return (
        <>
            <div className="hidden md:flex">
                <ChatList />
                <AddButton />
            </div>
        </>
    )
}

function CallsComponent() {
    return <EmptyCalls />;
}

function StatusComponent() {
    return <StatusList />
}

function ArchivedChatsComponent() {
    return (
        <div className="hidden md:flex">
            <ArchivedChatsList />
        </div>
    )
}

function StarredMessagesComponent() {
    return <div className="hidden md:flex">
        <StarredMessageList />
    </div>
}