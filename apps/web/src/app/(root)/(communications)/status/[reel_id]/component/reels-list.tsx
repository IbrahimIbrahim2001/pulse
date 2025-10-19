"use client";

import FullscreenLayout from "@/app/(root)/components/fullscreen-layout";
import type { StoryType } from "@/app/(root)/types/chat";
import { Reel, ReelProgress, ReelContent, ReelItem, ReelImage, ReelNavigation, ReelControls, ReelPreviousButton, ReelPlayButton, ReelNextButton } from "@/components/kibo-ui/reel";
import { Button } from "@/components/ui/button";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import ChatAvatar from "../../../components/chat-avatar";
import { ReelComponent } from "./reel";

export function ReelsList() {
    const { reel_id } = useParams();
    const reelId: string = reel_id ? reel_id.toString() : "";
    const { data: reels, isLoading } = useQuery(trpc.stories.getStory.queryOptions({
        reel_id: reelId
    }));
    const reelData: StoryType[] = Array.isArray(reels)
        ? reels.filter((r): r is StoryType => !!r)
        : reels ? [reels as unknown as StoryType] : [];
    if (isLoading) return <>loading...</>;
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
    title: story.title ?? undefined,
    createdAt: story.createdAt,
    user: story.user,
    type: 'image' as 'image',
    duration: 5000,
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