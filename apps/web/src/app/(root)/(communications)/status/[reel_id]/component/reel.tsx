"use client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import ChatAvatar from "../../../components/chat-avatar";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { useEffect, useState } from "react";
import { Reel, ReelContent, ReelControls, ReelImage, ReelItem, ReelNavigation, ReelNextButton, ReelPlayButton, ReelPreviousButton, ReelProgress } from "@/components/kibo-ui/reel";

export function ReelComponent({ reelData }: { reelData: ReelItem[] }) {
    const router = useRouter();
    const { reel_id } = useParams();
    const reelId: string = reel_id ? reel_id.toString() : "";

    const { data: myStories, isLoading } = useQuery(trpc.stories.myStory.queryOptions());
    const { data: friendsStories } = useQuery(trpc.stories.getStories.queryOptions());

    const [allStories, setAllStories] = useState<ReelItem[]>([]);
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

    useEffect(() => {
        if (myStories && friendsStories) {
            const combined = [...myStories, ...friendsStories]
                .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                .map(story => ({
                    ...story,
                    type: determineMediaType(story.fileUrl),
                    src: story.fileUrl,
                    duration: 5,
                    alt: story.title || "",
                    title: story.title ?? undefined,
                }));

            setAllStories(combined);

            // Find the initial current story index
            const initialIndex = combined.findIndex(s => s.id === reelId);
            setCurrentStoryIndex(initialIndex >= 0 ? initialIndex : 0);
        }
    }, [myStories, friendsStories, reelId]);

    const determineMediaType = (fileUrl: string): "video" | "image" => {
        const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm'];
        const extension = fileUrl.toLowerCase().substring(fileUrl.lastIndexOf('.'));
        return videoExtensions.includes(extension) ? "video" : "image";
    };

    const handleBack = () => {
        router.push("/status");
    };

    if (allStories.length === 0) return <>loading...</>;

    const currentStory = allStories[currentStoryIndex];

    return (
        <Reel
            data={allStories}
            className="w-full h-full md:h-auto md:w-auto"
            onIndexChange={setCurrentStoryIndex}
        >
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 bg-gradient-to-b from-black/60 to-transparent">
                <div className="flex items-center gap-4">
                    <Button
                        onClick={handleBack}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-black/30 backdrop-blur-sm hover:bg-black/50 transition-all duration-200"
                    >
                        <ArrowLeft className="size-5 text-white" />
                    </Button>
                    <div className="flex items-center gap-3">
                        <ChatAvatar
                            recipientName={currentStory?.user?.name}
                            size="h-8 w-8"
                            user_image={currentStory?.user?.image ?? undefined}
                        />
                        <div className="flex flex-col">
                            <h2 className="font-semibold text-white text-sm truncate">{currentStory?.user?.name}</h2>
                            <p className="text-xs text-gray-300">
                                {currentStory?.createdAt ? formatTimeAgo(new Date(currentStory.createdAt)) : 'Recently'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="absolute top-16 left-4 right-4 z-50">
                <ReelProgress />
            </div>

            {/* Video Content */}
            <ReelContent className="h-[calc(100svh-64px)]">
                {(reel, index) => (
                    <ReelItem key={reel.id} className="h-full">
                        {reel.type === "video" ? (
                            <video
                                src={reel.src}
                                className="object-cover w-full h-full"
                                autoPlay
                                muted
                                loop
                            />
                        ) : (
                            <ReelImage
                                src={reel.src}
                                alt={reel.alt ?? ""}
                                className="object-cover w-full h-full"
                            />
                        )}
                    </ReelItem>
                )}
            </ReelContent>

            {/* Navigation Controls */}
            <ReelNavigation />
            <ReelControls>
                <ReelPreviousButton className="left-4 bottom-4" />
                <ReelPlayButton />
                <ReelNextButton className="right-4 bottom-4" />
            </ReelControls>
        </Reel>
    );
}

// Helper function to format time ago
function formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
}