"use client";
import { trpc } from "@/utils/trpc";
import ListHeader from "../../components/header/list-header"
import type { ChatType } from "../../types/chat";
import Chat from "./chat";
import { useQuery } from "@tanstack/react-query";
import ListLoading from "./chat-list-loading";
import { useMemo } from "react";
export default function ChatList() {
    const { data: chats, isLoading, isError, error } = useQuery({
        ...trpc.chat.getAllChats.queryOptions(),
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
    });
    const sortedChats = useMemo(() => {
        if (!chats) return [];
        return [...chats].sort((a, b) => {
            const lastMessageA = a.messages[a.messages.length - 1]?.createdAt || a.createdAt;
            const lastMessageB = b.messages[b.messages.length - 1]?.createdAt || b.createdAt;
            return new Date(lastMessageB).getTime() - new Date(lastMessageA).getTime();
        });
    }, [chats]);
    if (isLoading) return <ListLoading />
    if (isError || error) return (<>Error</>)
    return (
        <>
            <div className="w-full md:h-[calc(100vh-64px)] border-e overflow-y-auto hide-scrollbar mb-16 md:mb-0">
                <div className="hidden md:block md:p-4 sticky top-0 left-0 bg-background z-50">
                    <ListHeader />
                </div>
                <div className="md:pb-20">
                    {sortedChats?.map((chat: ChatType) => (
                        <Chat key={chat.id} chat={chat} />
                    ))}
                </div>
            </div>
        </>
    )
}
