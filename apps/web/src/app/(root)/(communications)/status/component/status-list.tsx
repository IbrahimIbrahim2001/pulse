"use client";
import { Status } from "./story";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
export function StatusList() {
    const { data: stories, isLoading } = useQuery(trpc.stories.getStories.queryOptions());
    if (isLoading) return <>loading...</>
    return (
        <>
            {stories?.map((story: any) => (
                <Status key={story.id} story={story} />
            ))
            }
        </>
    )
}