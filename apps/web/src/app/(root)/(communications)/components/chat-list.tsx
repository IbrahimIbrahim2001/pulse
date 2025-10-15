"use client";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import ListHeader from "../../components/header/list-header";
import type { ChatType } from "../../types/chat";
import Chat from "./chat";
import ListLoading from "./chat-list-loading";
import { Badge } from "@/components/ui/badge";
import { filterChats } from "../chats/utils/filter-chats";
import { useFilterChats } from "../chats/hooks/use-filter-chats";
import { Input } from "@/components/ui/input";
export default function ChatList() {
    const searchParams = useSearchParams();
    const filter = searchParams.get("filter");
    const search = searchParams.get("search");
    const { data: chats, isLoading, isError, error } = useQuery({
        ...trpc.chat.getAllChats.queryOptions(),
        refetchOnMount: true,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
    });
    const filteredAndSortedChats = filterChats(chats, filter, search);
    if (isLoading) return <ListLoading />
    if (isError || error) return (<>Error</>)
    if (filteredAndSortedChats?.length === 0) return (
        <div className="w-full md:h-[calc(100vh-64px)] border-e overflow-y-auto hide-scrollbar mb-16 md:mb-0">
            <div className="hidden md:block md:p-4 sticky top-0 left-0 bg-background z-50">
                <ListHeader />
            </div>
            <FilterBadges />
            <SearchChats />
            <div className="flex flex-col items-center justify-center  mt-20">
                <Badge variant="secondary" className="rounded-md">No chats found</Badge>
            </div>
        </div>
    )
    return (
        <>
            <div className="w-full md:h-[calc(100vh-64px)] border-e overflow-y-auto hide-scrollbar mb-16 md:mb-0">
                <div className="hidden md:block md:p-4 md:pb-0 sticky top-0 left-0 bg-background z-50">
                    <ListHeader />
                </div>
                <FilterBadges />
                <SearchChats />
                <div className="md:pb-20">
                    {filteredAndSortedChats?.map((chat: ChatType) => (
                        <Chat key={chat.id} chat={chat} />
                    ))}
                </div>
            </div>
        </>
    )
}
function FilterBadges() {
    const { handleFilterClick } = useFilterChats();
    return (
        <div className="md:hidden px-4 py-2 flex gap-x-2 items-center max-w-screen overflow-scroll hide-scrollbar">
            <Badge variant="secondary" className="rounded-md" onClick={() => handleFilterClick('all chats')}>All</Badge>
            <Badge variant="secondary" className="rounded-md" onClick={() => handleFilterClick('unread')}>Unread</Badge>
            <Badge variant="secondary" className="rounded-md" onClick={() => handleFilterClick('groups')}>Groups</Badge>
        </div>
    )
}
function SearchChats() {
    const { handleSearch } = useFilterChats();
    return (
        <div className="px-4">
            <Input
                onChange={(e) => handleSearch(e.target.value)}
                type="text"
                placeholder="Search"
                className="mt-3 md:mt-4"
            />
        </div>
    )
}