"use client";
import { Button } from "@/components/ui/button"; // Adjust import path as needed
import { trpc } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import EmojiPicker, { Theme, type EmojiClickData } from 'emoji-picker-react';
import { Smile } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface MessageReactionsProps {
    messageId: string;
    isMyMessage: boolean;
}

export const MessageReactions = ({ messageId, isMyMessage }: MessageReactionsProps) => {
    const mutateReaction = useMutation(trpc.messages.messageReaction.mutationOptions());
    const [showFullPicker, setShowFullPicker] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowFullPicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleEmojiClick = async (emojiData: EmojiClickData) => {
        await mutateReaction.mutateAsync({ messageId, reaction: emojiData.emoji })
        // handleReaction(emojiData.emoji, messageId);
        setShowFullPicker(false);
    };

    // const handleReaction = (emoji: string, messageId: string) => {
    //     // Add your socket logic here:
    //     // socket.emit('message-reaction', { messageId, emoji, userId: sender_id });
    // };

    const openFullPicker = () => {
        setShowFullPicker(true);;
    };

    return (
        <div ref={containerRef} className="md:relative">
            <Button
                variant="ghost"
                size="sm"
                className={`opacity-75 md:opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 ${isMyMessage ? 'order-first' : 'order-last'
                    }`}
                onClick={openFullPicker}
            >
                <Smile className="h-4 w-4" />
            </Button>
            {showFullPicker && (
                <div className={`absolute z-50  left-1/2 -translate-x-1/2 ${isMyMessage
                    ? 'md:left-auto md:right-8 md:translate-x-0'
                    : 'md:left-8 md:translate-x-0'
                    }`}>
                    <EmojiPicker
                        theme={Theme.AUTO}
                        onEmojiClick={handleEmojiClick}
                        width={320}
                        height={400}
                        searchDisabled
                        skinTonesDisabled
                        previewConfig={{ showPreview: false }}
                    />
                </div>
            )}
        </div>
    );
};