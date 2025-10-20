"use client";

import FullscreenLayout from "@/app/(root)/components/fullscreen-layout";
import type { StoryType } from "@/app/(root)/types/chat";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { ReelComponent } from "./reel";
import { Loader2 } from "lucide-react";

export function ReelsList() {
    const { reel_id } = useParams();
    const reelId: string = reel_id ? reel_id.toString() : "";
    const { data: reels, isLoading } = useQuery(trpc.stories.getStory.queryOptions({
        reel_id: reelId
    }));
    const reelData: StoryType[] = Array.isArray(reels)
        ? reels.filter((r): r is StoryType => !!r)
        : reels ? [reels as unknown as StoryType] : [];

    if (isLoading) {
        return (
            <div className="w-full h-[calc(100vh-64px)] grid place-items-center item-center">
                <Loader2 className="size-12 text-primary/90 animate-spin" />
            </div>
        )
    }
    return (
        <>
            <div className="block md:hidden" >
                <MobileReel reels={reelData} />
            </div>
            {/* Desktop - hidden on mobile */}
            < div className="hidden md:block" >
                <DesktopReel reels={reelData} />
            </ div>
        </>
    )
}


const transformStoryToReel = (story: StoryType) => ({
    id: story.id,
    src: story.fileUrl,
    fileUrl: story.fileUrl,
    title: story.title ?? undefined,
    createdAt: story.createdAt,
    user: story.user,
    type: 'image' as 'image',
    duration: 5000,
    userData: { ...story.user }
});


// Mobile Component (xs/sm) - with FullscreenLayout
function MobileReel({ reels }: { reels: StoryType[] }) {
    const reelData = reels.map(transformStoryToReel);
    return (
        <FullscreenLayout>
            <div className="relative flex justify-center w-full bg-black [height:100dvh] overflow-hidden">
                <ReelComponent reelData={reelData} />
            </div>
        </FullscreenLayout>
    );
}

// Desktop Component (md/lg) - without FullscreenLayout
function DesktopReel({ reels }: { reels: StoryType[] }) {
    const reelData = reels.map(transformStoryToReel);
    return (
        <div className="relative md:flex justify-center md:h-[calc(100vh-64px)] w-full">
            <ReelComponent reelData={reelData} />
        </div>
    );
}