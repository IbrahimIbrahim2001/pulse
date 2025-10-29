"use client";

import { Badge } from "@/components/ui/badge";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import type { StarredMessageType } from "../../types/chat";
import { StarredMessage } from "./starred-message";

export function StarredList() {
    const { data: starredMessages, isLoading, isError, error } = useQuery(trpc.messages.getStarredMessage.queryOptions());
    if (isLoading) return (
        <div className="w-full h-[calc(100vh-64px)] border-e overflow-y-auto hide-scrollbar mb-16 md:mb-0 grid place-content-center justify-items-center">
            <Loader2 className="animate-spin size-10 text-primary" />
        </div>
    )
    if (isError || error) return (<>Error</>)
    if (starredMessages?.length === 0) return (
        <div className="w-full md:h-[calc(100vh-64px)] border-e overflow-y-auto hide-scrollbar mb-16 md:mb-0 mt-18">
            <div className="flex flex-col items-center justify-center  mt-20">
                <Badge variant="secondary" className="rounded-md">No Starred messages yet</Badge>
            </div>
        </div>
    )
    return (
        <div className="mt-18">
            <div className="md:pb-20 space-y-2 px-4 mt-2">
                {starredMessages?.map((message: StarredMessageType) => (
                    <div key={message.id}>
                        <StarredMessage starredMessage={message} />
                    </div>
                ))}
            </div>
        </div>
    )
}
