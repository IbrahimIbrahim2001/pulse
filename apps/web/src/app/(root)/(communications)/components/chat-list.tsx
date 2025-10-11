"use client";
import { trpc } from "@/utils/trpc";
import ListHeader from "../../components/header/list-header"
import type { ChatType } from "../../types/chat";
import Chat from "./chat";
import { useQuery } from "@tanstack/react-query";
import ListLoading from "./chat-list-loading";
import { useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
export default function ChatList() {
    const searchParams = useSearchParams();
    const filter = searchParams.get("filter");

    const { data: chats, isLoading, isError, error } = useQuery({
        ...trpc.chat.getAllChats.queryOptions(),
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
    });
    const filteredAndSortedChats = filterChats(chats, filter);

    if (isLoading) return <ListLoading />
    if (isError || error) return (<>Error</>)
    return (
        <>
            <div className="w-full md:h-[calc(100vh-64px)] border-e overflow-y-auto hide-scrollbar mb-16 md:mb-0">
                <div className="hidden md:block md:p-4 sticky top-0 left-0 bg-background z-50">
                    <ListHeader />
                </div>
                <div className="md:pb-20">
                    {filteredAndSortedChats?.map((chat: ChatType) => (
                        <Chat key={chat.id} chat={chat} />
                    ))}
                </div>
            </div>
        </>
    )
}
const filterChats = (chats: ChatType[] | undefined, filter: string | null) => {
    const user_id = authClient.useSession().data?.user.id;
    return (
        useMemo(() => {
            if (!chats) return [];
            let filteredChats = chats;
            if (filter === 'groups') {
                filteredChats = chats.filter(chat => chat.type === "GROUP" || chat.type === "CHANNEL");
            } else if (filter === 'unread') {
                filteredChats = chats.filter(chat => {
                    const lastMessage = chat.messages[chat.messages.length - 1];
                    return lastMessage && !(lastMessage.status === "SEEN") && user_id !== lastMessage.senderId;
                });
            } else if (filter === "all") {
                filteredChats = chats;
            }
            const myChats = filteredChats.sort((a, b) => {
                const lastMessageA = a.messages[a.messages.length - 1]?.createdAt || a.createdAt;
                const lastMessageB = b.messages[b.messages.length - 1]?.createdAt || b.createdAt;
                return new Date(lastMessageB).getTime() - new Date(lastMessageA).getTime();
            });
            return myChats;
        }, [chats, filter])
    )
}