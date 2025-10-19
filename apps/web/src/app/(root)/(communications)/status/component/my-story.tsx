"use client";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { User } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function MyStory() {
    const { data: myStories, isLoading } = useQuery(trpc.stories.myStory.queryOptions());

    if (isLoading) return <>
        <div className="aspect-[3/4] w-32 flex-shrink-0 rounded-xl relative overflow-hidden group cursor-pointer">
            <Skeleton className="w-full h-full bg-secondary" />
        </div>
    </>
    if (myStories && myStories.length > 0) {
        const coverStory = myStories[0];
        return (
            <Link href={`/status/${coverStory.id}`}>
                <div className="aspect-[3/4] w-32 flex-shrink-0 rounded-xl relative overflow-hidden group cursor-pointer">
                    {/* Story Image */}
                    <Image
                        width={100}
                        height={100}
                        alt={coverStory.title ?? `story_id: ${coverStory.id}`}
                        src={coverStory.fileUrl}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Top Gradient Overlay */}
                    <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-black/40 to-transparent" />

                    {/* Bottom Gradient Overlay */}
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Story Title */}
                    <div className="absolute bottom-3 left-3 right-3">
                        <p className="text-white font-medium text-sm truncate">
                            {coverStory.title || "My Story"}
                        </p>
                    </div>

                    {/* My Story Indicator */}
                    <div className="absolute top-2 left-2 bg-secondary rounded-full p-1">
                        <User className="h-3 w-3" />
                    </div>

                    {/* Story Count Badge (optional) */}
                    {myStories.length > 1 && (
                        <div className="absolute top-2 right-2 bg-primary/80 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                            {myStories.length}
                        </div>
                    )}
                </div>
            </Link>
        );
    }
    return null;
}