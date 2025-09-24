"use client";
import { trpc } from "@/utils/trpc";
import ListHeader from "../../components/list-header"
import type { ChatType } from "../../types/chat";
import Chat from "./chat";
import { useQuery } from "@tanstack/react-query";
interface ChatListProps {
    initialChats: ChatType[];
}
export default function ChatList({ initialChats }: ChatListProps) {
    const { data: chats = initialChats } = useQuery({
        ...trpc.chat.getAllChats.queryOptions(),
        initialData: initialChats as any,
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
    });
    return (
        <>
            <div className="w-full border-e overflow-y-auto hide-scrollbar mb-16 md:mb-0">
                <div className="hidden md:block md:p-4 sticky top-0 left-0 bg-background z-50">
                    <ListHeader />
                </div>
                <div className="md:pb-20">
                    {chats?.map((chat: ChatType) => (
                        <Chat key={chat.id} chat={chat} />
                    ))}
                </div>
            </div>
        </>
    )
}
