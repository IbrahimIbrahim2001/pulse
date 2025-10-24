import type { StoryType } from "@/app/(root)/types/chat";
import Link from "next/link";
import ChatAvatar from "../../components/chat-avatar";
import Image from "next/image";

export function Status({ story }: { story: StoryType }) {
    return (
        <Link href={{ pathname: `status/${story.id}` }} >
            <div
                className="aspect-[3/4]  w-32 flex-shrink-0 rounded-xl relative overflow-hidden group cursor-pointer"
            >
                {/* Story Image */}
                <Image
                    fill
                    alt={story.title ?? `story_id: ${story.id}`}
                    src={story.fileUrl}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Top Gradient Overlay */}
                <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-black/40 to-transparent" />

                {/* Bottom Gradient Overlay */}
                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Story Title */}
                <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white font-medium text-sm truncate">
                        {story.title}
                    </p>
                </div>
                {/* Author Info */}
                <div className="absolute top-3 left-3 flex items-center space-x-2">
                    {/* Author Avatar */}
                    <div className="relative">
                        <ChatAvatar recipientName={story.user.name} size="w-8 h- 8" user_image={story.user.image ?? undefined} />
                    </div>

                    {/* Author Name */}
                    <span className="text-white text-sm font-medium truncate max-w-20">
                        {story.user.name}
                    </span>
                </div>
            </div>
        </Link>
    )
}