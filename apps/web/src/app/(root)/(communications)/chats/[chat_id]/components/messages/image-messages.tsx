"use client";
import type { Message } from "@/app/(root)/types/chat";
import { ImageZoom } from "@/components/kibo-ui/image-zoom";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { MessagesProps } from "../messages";
import { formatTime } from "../../utils/format-time";
import { MessageStatus } from "./get-status-icon";
export const ImageMessages = ({ message, sender_id }: { message: Message, sender_id: MessagesProps["sender_id"] }) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const isOwnMessage = message.senderId === sender_id;
    return (
        <div className={`max-w-xs lg:max-w-md ${isOwnMessage ? "ml-auto" : "mr-auto"}`}>
            <div className="relative rounded-2xl overflow-hidden">
                {!imageLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-100/90 to-gray-200/80 dark:from-gray-700/90 dark:to-gray-600/80 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}
                {message.fileUrl &&
                    <ImageZoom backdropClassName={cn(
                        '[&_[data-rmiz-modal-overlay="visible"]]:bg-black/80'
                    )}>
                        <img
                            src={message.fileUrl}
                            alt={message.content || "Image"}
                            className={`w-full rounded-2xl transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                                }`}
                            onLoad={() => setImageLoaded(true)}
                        />
                    </ImageZoom>}
            </div>
            {message.content && (
                <div className="mt-3">
                    <p className={`text-sm px-3 py-2 rounded-xl ${isOwnMessage
                        ? "bg-primary text-primary-foreground shadow-lg"
                        : "bg-card text-card-foreground shadow-md border border-border"
                        }`}>
                        {message.content}
                    </p>
                </div>
            )}
            <div className="flex items-center justify-end mt-1 text-xs gap-x-1 opacity-80">
                {formatTime(message.createdAt)}
                <MessageStatus message={message} sender_id={sender_id} />
            </div>
        </div>
    );
};
