"use client";
import { useQuery } from "@tanstack/react-query";
import ListHeader from "../../components/header/list-header";
import { trpc } from "@/utils/trpc";
import ArchivedChat from "./archived-chat";
import { Badge } from "@/components/ui/badge";
import ListLoading from "../../(communications)/components/chat-list-loading";

export function ArchivedChatsList() {
    const { data: ArchivedChats, isLoading, isError, error } = useQuery(trpc.chat.getArchivedChats.queryOptions());
    if (isLoading) return <ListLoading />
    if (isError || error) return (<>Error</>)
    if (ArchivedChats?.length === 0) return (
        <div className="w-full md:h-[calc(100vh-64px)] border-e overflow-y-auto hide-scrollbar mb-16 md:mb-0 mt-18">
            <div className="hidden md:block md:p-4 sticky top-0 left-0 bg-background z-50">
                <ListHeader />
            </div>
            <div className="flex flex-col items-center justify-center  mt-20">
                <Badge variant="secondary" className="rounded-md">No archived chats yet</Badge>
            </div>
        </div>
    )

    return (
        <>
            <div className="w-full md:h-[calc(100vh-64px)] border-e overflow-y-auto hide-scrollbar mb-16 md:mb-0 mt-18">
                <div className="hidden md:block md:p-4 md:pb-0 sticky top-0 left-0 bg-background z-50">
                    <ListHeader />
                </div>
                <div className="md:pb-20">
                    {ArchivedChats?.map((chat: any) => (
                        <ArchivedChat key={chat.id} chat={chat} />
                    ))}
                </div>
            </div>
        </>
    )
}