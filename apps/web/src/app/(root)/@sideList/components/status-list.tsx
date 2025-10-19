"use client";
import StatusHeader from "../../components/header/status-header";
import Link from "next/link";
import ChatAvatar from "../../(communications)/components/chat-avatar";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export const StatusList = () => {
    const { data: stories, isLoading } = useQuery(trpc.stories.getStories.queryOptions());
    // Group stories by user and get the latest one for each user
    const storiesByUser = stories?.reduce((acc, story) => {
        if (!acc[story.user.id] || new Date(story.createdAt) > new Date(acc[story.user.id].createdAt)) {
            acc[story.user.id] = story;
        }
        return acc;
    }, {} as Record<string, any>);

    const uniqueUserStories = storiesByUser ? Object.values(storiesByUser) : [];


    if (isLoading) return <>
        <div className="relative hidden md:block  h-[calc(100vh-64px)] border-e overflow-y-auto hide-scrollbar mb-16 md:mb-0 ">
            <StatusHeader />
            <h3 className="h-8 my-2 px-4 text-muted-foreground flex items-center sticky top-37 left-0 bg-background z-50">Recent updates</h3>
            {Array.from([1, 2, 3, 4, 5, 6]).map((_, index) => {
                return (
                    <div key={index} className="flex items-center  w-full p-4 hover:bg-muted/50 transition-colors duration-200  group">
                        <Skeleton className="size-9 rounded-full" />
                        <div className="flex flex-col justify-center ml-4 flex-1 min-w-0 gap-y-1">
                            <Skeleton className="w-10/12 h-4" />
                            <Skeleton className="w-1/2 h-3" />
                        </div>
                    </div>
                )
            })}
        </div>
    </>
    if (stories?.length === 0) return (
        <div className="relative hidden md:block  h-[calc(100vh-64px)] border-e overflow-y-auto hide-scrollbar mb-16 md:mb-0 ">
            <StatusHeader />
            <h3 className="h-8 my-2 px-4 text-muted-foreground flex items-center sticky top-37 left-0 bg-background z-50">Recent updates</h3>
            <div className="flex flex-col items-center justify-center  mt-20">
                <Badge variant="secondary" className="rounded-md">No Stories found</Badge>
            </div>
        </div>
    )
    return (
        <div className="relative hidden md:block  h-[calc(100vh-64px)] border-e overflow-y-auto hide-scrollbar mb-16 md:mb-0 ">
            <StatusHeader />
            <h3 className="h-8 my-2 px-4 text-muted-foreground flex items-center sticky top-37 left-0 bg-background z-50">Recent updates</h3>
            {uniqueUserStories?.map((story) => {
                const storyTime = getRelativeTime(story.createdAt);
                return (
                    <Link
                        href={{
                            pathname: `../status/${story.id}`,
                        }}
                        className="block"
                        key={story.id}
                    >
                        <div className="flex items-center  w-full p-4 hover:bg-muted/50 transition-colors duration-200  group">
                            <ChatAvatar recipientName={story.user.name} size="h-9 w-9" user_image={story.user.image ?? undefined} />
                            <div className="flex flex-col justify-center ml-4 flex-1 min-w-0">
                                <p className="font-semibold">{story.user.name}</p>
                                <p className="text-sm text-muted-foreground w-full ">{storyTime}</p>
                            </div>
                        </div>
                    </Link>
                )
            })}
        </div>
    )
}

const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInHours < 1) {
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    } else {
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
        });
    }
};