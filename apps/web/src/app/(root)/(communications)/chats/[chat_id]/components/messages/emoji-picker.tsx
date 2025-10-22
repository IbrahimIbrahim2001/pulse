import { Button } from '@/components/ui/button';
import { Smile } from 'lucide-react';
import React, { useState } from 'react'

export const EmojiPicker = ({ messageId, reverse }: { messageId: string, reverse?: boolean }) => {
    const [showReactionPicker, setShowReactionPicker] = useState<string | null>(null);
    return (
        <div className={`flex ${reverse ? "flex-row-reverse" : "flex-row"} md:hidden group-hover:md:flex group-hover:flex items-center mr-1`}>
            <Button
                className="h-7 w-7 rounded-full border bg-background/80 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-accent transition-all duration-200 hover:scale-105"
                title="Add reaction"
                onClick={(e) => {
                    e.stopPropagation();
                    setShowReactionPicker(showReactionPicker === messageId ? null : messageId);
                }}
            >
                <Smile className="h-3.5 w-3.5 text-black/80 dark:text-white/80" />
            </Button>
            {showReactionPicker === messageId && (
                <div className={`mx-2 mb-2 bg-popover w-fit border rounded-full shadow-lg p-2 z-10`}>
                    <div className="flex gap-1">
                        {['👍', '❤️', '😂', '😮', '😢', '🙏'].map(emoji => (
                            <Button key={emoji} variant="emoji" size="icon-sm">
                                {emoji}
                            </Button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}