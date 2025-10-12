import type { ChatType } from "@/app/(root)/types/chat";
import { authClient } from "@/lib/auth-client";
import { useMemo } from "react";

export const filterChats = (chats: ChatType[] | undefined, filter: string | null, searchQuery: string | null) => {
    const user_id = authClient.useSession().data?.user.id;
    return (
        useMemo(() => {
            if (!chats) return [];
            let filteredChats = chats;
            if (filter === 'groups') {
                filteredChats = chats.filter(chat => chat.type === "GROUP" || chat.type === "CHANNEL");
            } else if (filter === 'unread') {
                filteredChats = chats.filter(chat => {
                    const lastMessage = chat.messages[chat.messages.length - 1];
                    return lastMessage && !(lastMessage.status === "SEEN") && user_id !== lastMessage.senderId;
                });
            } else if (filter === 'all chats') {
                filteredChats = chats
            } else if (filter === 'search') {

            }
            else {
                filteredChats = chats
            }

            if (searchQuery && searchQuery.trim() !== '') {
                const query = searchQuery.toLowerCase().trim();
                filteredChats = filteredChats.filter(chat => {
                    if (chat.name?.toLowerCase().includes(query)) {
                        return true;
                    }
                    const lastMessage = chat.messages[chat.messages.length - 1];
                    if (lastMessage?.content?.toLowerCase().includes(query)) {
                        return true;
                    }
                    return false;
                });
            }

            const myChats = filteredChats.sort((a, b) => {
                const lastMessageA = a.messages[a.messages.length - 1]?.createdAt || a.createdAt;
                const lastMessageB = b.messages[b.messages.length - 1]?.createdAt || b.createdAt;
                return new Date(lastMessageB).getTime() - new Date(lastMessageA).getTime();
            });
            return myChats;
        }, [chats, filter, searchQuery])
    )
}