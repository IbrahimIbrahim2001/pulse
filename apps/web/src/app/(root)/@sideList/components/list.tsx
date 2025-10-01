"use client";
import ChatList from "@/app/(root)/(communications)/components/chat-list";
import { usePathname } from "next/navigation";
import AddButton from "../../components/add-button";
import StatusHeader from "../../components/header/status-header";

export default function List() {
    const pathname = usePathname();
    if (pathname.includes("chats")) return <ChatComponent />
    else if (pathname.includes("calls")) return <CallsComponent />
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
    return null;
}


function StatusComponent() {
    return <StatusHeader />;
}