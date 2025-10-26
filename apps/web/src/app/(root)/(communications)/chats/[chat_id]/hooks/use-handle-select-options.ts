import { authClient } from "@/lib/auth-client";
import { socketClient } from "@/lib/socketClient";
import { trpc } from "@/utils/trpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { redirect, useParams } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";
import { useMutateDeleteMessages } from "./use-mutate-delete-messages";

export const useHandleSelectOptions = () => {
    const { chat_id: roomId } = useParams<{ chat_id: string }>();
    const mutateDeleteMessages = useMutateDeleteMessages(roomId);
    const mutateArchiveChat = useMutation(trpc.chat.archiveChat.mutationOptions());
    const mutateUnArchiveChat = useMutation(trpc.chat.unArchiveChat.mutationOptions());
    const mutateLeaveChat = useMutation(trpc.chat.leaveChat.mutationOptions({}));
    const mutateSendMessage = useMutation(trpc.messages.saveMessage.mutationOptions())
    const mutateDeleteGroup = useMutation(trpc.chat.deleteGroup.mutationOptions())
    const { data: archivedChats } = useQuery(trpc.chat.getArchivedChats.queryOptions());
    const socket = useMemo(socketClient, []);
    const user = authClient.useSession().data?.user
    const userId = user?.id
    const { data: chat } = useQuery(
        trpc.chat.getChatDetails.queryOptions({
            room_id: roomId,
        }),
    );

    const isAdmin = chat?.members.some(m => m.role === "ADMIN" && m.userId === userId) ? true : false;
    const isGroup = chat?.type === "GROUP";
    const deleteMessages = () => {
        if (chat) {
            mutateDeleteMessages.mutateAsync({ id: chat.id })
            if (userId && roomId) {
                const systemMessage = {
                    roomId: roomId,
                    content: `${user.name} deleted all messages`,
                    senderId: userId,
                    type: "SYSTEM" as const
                }
                socket.emit("send", systemMessage)
                mutateSendMessage.mutateAsync(systemMessage);
            }
        }
    }
    const deleteGroup = async () => {
        const res = await mutateDeleteGroup.mutateAsync({ room_id: roomId })
        if (res.success) {
            toast.success(res.message);
            redirect("../chats");
        }
    }
    const leaveChat = () => {
        if (userId && roomId) {
            mutateLeaveChat.mutateAsync({ user_id: userId, room_id: roomId })
            const systemMessage = {
                roomId: roomId,
                content: `${user.name}leaves the chat`,
                senderId: userId,
                type: "SYSTEM" as const
            }
            socket.emit("send", systemMessage)
            mutateSendMessage.mutateAsync(systemMessage);
            redirect("../chats");
        }
    }

    const toggleArchiveChat = async () => {
        if (!isChatArchived) {
            const res = await mutateArchiveChat.mutateAsync({
                roomId
            })
            if (res?.success) {
                toast.success(res.message);
            }
        }
        else {
            const res = await mutateUnArchiveChat.mutateAsync({
                roomId
            })

            if (res?.success) {
                toast.success(res.message);
            }
        }
    }
    const isChatArchived = archivedChats?.find(c => c.roomId === roomId) ? true : false;
    return {
        chat,
        isAdmin,
        isGroup,
        deleteMessages,
        deleteGroup,
        leaveChat,
        toggleArchiveChat,
        isChatArchived
    }
}