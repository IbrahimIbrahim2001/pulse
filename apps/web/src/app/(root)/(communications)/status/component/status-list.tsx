"use client";
import { Status } from "./story";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { Skeleton } from "@/components/ui/skeleton";

export function StatusList() {
    const { data: stories, isLoading } = useQuery(trpc.stories.getStories.queryOptions());
    if (isLoading) return <>
        <div className="aspect-[3/4] w-32 flex-shrink-0 rounded-xl relative overflow-hidden group cursor-pointer">
            <Skeleton className="w-full h-full bg-secondary" />
        </div>
    </>

    // Group stories by user and get the latest one for each user
    const storiesByUser = stories?.reduce((acc, story) => {
        if (!acc[story.user.id] || new Date(story.createdAt) > new Date(acc[story.user.id].createdAt)) {
            acc[story.user.id] = story;
        }
        return acc;
    }, {} as Record<string, any>);

    const uniqueUserStories = storiesByUser ? Object.values(storiesByUser) : [];

    if (uniqueUserStories.length === 0) return (
        <div
            className="aspect-[3/4] w-32 flex-shrink-0 rounded-xl relative overflow-hidden group cursor-pointer bg-secondary flex items-center px-5"
        >
            <p className="w-full text-muted-foreground">No new stories for now</p>
        </div>
    )

    return (
        <>
            {uniqueUserStories.map((story: any) => (
                <Status key={story.id} story={story} />
            ))}
        </>
    )
}