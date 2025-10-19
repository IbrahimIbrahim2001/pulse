"use client";
import { Reel, ReelContent, ReelControls, ReelImage, ReelItem, ReelNavigation, ReelNextButton, ReelPlayButton, ReelPreviousButton, ReelProgress } from "@/components/kibo-ui/reel";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ChatAvatar from "../../../components/chat-avatar";
import { useRouter } from "next/navigation";

export function ReelComponent({ reelData }: { reelData: ReelItem[] }) {
    const router = useRouter();
    const handleBack = () => {
        router.push("/status");
    };
    return (
        <Reel data={reelData} className="w-full h-full md:h-auto md:w-auto">
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
                            recipientName={"UnknownUser"}
                            size="h-8 w-8"
                            user_image={""}
                        />
                        <div className="flex flex-col">
                            <h2 className="font-semibold text-white text-sm truncate">UnknownUser</h2>
                            <p className="text-xs text-gray-300">2 hours ago</p>
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
                {(reel) => (
                    <ReelItem key={reel.id} className="h-full">
                        <ReelImage
                            src={reel.src}
                            alt={reel.title ?? ""}
                            className="object-cover w-full h-full"
                        />
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
    )
}
