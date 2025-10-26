"use client";
import React from 'react'
import { formatLastMessageTime } from '../../(communications)/utils/format-last-message-time';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { trpc } from '@/utils/trpc';
import { useMutation } from '@tanstack/react-query';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AvatarImage } from '@radix-ui/react-avatar';
import type { ArchivedChatType } from '../../types/chat';
import ChatMemberName from '../../(communications)/components/chat-member-name';

interface ArchivedChatProps {
    chat: ArchivedChatType;
}

export default function ArchivedChat({ chat }: ArchivedChatProps) {
    const { data: session } = authClient.useSession();
    const currentUserId = session?.user?.id;
    const username = session?.user.name;
    const image = session?.user.image;

    const mutate = useMutation(trpc.messages.updateMessageStatus.mutationOptions());

    const groupName = chat.room.type === "GROUP" ? chat.room.name : undefined;
    const lastTextMessage = chat.room.messages
        .slice()
        .reverse()
        .find(msg => msg.type === "TEXT");

    const lastMsg = lastTextMessage?.content || "";
    const lastMsgDate = lastTextMessage?.createdAt;
    const formattedTime = lastMsgDate ? formatLastMessageTime(lastMsgDate) : "";

    const unreadReceivedMessages = chat.room.messages.filter(msg =>
        msg.senderId !== currentUserId && msg.status === "SENT"
    );

    const unreadMessagesCount = unreadReceivedMessages.length;

    const HandleMessageStatus = () => {
        if (unreadMessagesCount > 0 && currentUserId) {
            mutate.mutateAsync({
                message_ids: unreadReceivedMessages.map(msg => msg.id),
                status: "DELIVERED"
            });
        }
    };

    const recipientMember = chat.room.members.find(member =>
        member?.user.name !== username
    );
    const recipientName = recipientMember?.user.name || "Unknown User";

    const checkMemberWithImage = chat.room.members?.find(member => {
        image &&
            image.trim() !== ''
    });
    const user_image = checkMemberWithImage?.user.image ?? undefined;
    return (
        <Link
            href={{
                pathname: `../chats/${chat.room.id}`,
            }}
            className="block"
            onClick={HandleMessageStatus}
        >
            <div className="flex items-center w-full p-4 hover:bg-muted/50 transition-colors duration-200 border-b border-border/50 group">
                <Avatar className={`w-12 h-12  ring-2 ring-transparent group-hover:ring-primary/20 transition-all duration-200`}>
                    <AvatarImage src={user_image} />
                    <AvatarFallback className="bg-primary text-primary-foreground font-medium">{!groupName ? recipientName.slice(0, 2).toUpperCase() : groupName?.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col justify-center ml-4 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <div className="min-w-0 flex-1">
                            <ChatMemberName recipientName={!groupName ? recipientName : groupName} />
                            <p
                                className={`text-sm text-muted-foreground truncate ${unreadMessagesCount > 0
                                    ? "font-semibold text-foreground/80 dark:text-white/80"
                                    : ""
                                    }`}
                            >
                                {lastMsg}
                            </p>
                        </div>
                        <div className="flex flex-col items-end space-y-1 ml-2 flex-shrink-0">
                            <span className="text-xs text-muted-foreground">
                                {formattedTime}
                            </span>
                            {unreadMessagesCount > 0 && (
                                <span className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {unreadMessagesCount}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}