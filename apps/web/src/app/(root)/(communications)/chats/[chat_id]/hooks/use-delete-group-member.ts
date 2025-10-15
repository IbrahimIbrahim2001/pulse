import type { ChatType } from "@/app/(root)/types/chat";
import { queryClient, trpc } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
export const useDeleteGroupMember = (roomId: string, groupName: string) => {
    return useMutation(trpc.chat.removeGroupMember.mutationOptions({
        onMutate: async (variables) => {
            const queryKey = trpc.chat.getAllChats.queryKey();
            const chatDetailsKey = trpc.chat.getChatDetails.queryKey({
                room_id: roomId,
            });
            await queryClient.cancelQueries({ queryKey: queryKey });
            await queryClient.cancelQueries({ queryKey: chatDetailsKey });
            const previousChats = queryClient.getQueryData([...queryKey]) as ChatType[];
            const previousChatDetails = queryClient.getQueryData([...chatDetailsKey]) as any;
            queryClient.setQueryData([queryKey], (old: ChatType[] | undefined) => {
                if (!old) return old;
                const chatIndex = old.findIndex(chat => chat.name === groupName);
                if (chatIndex === -1) return old;
                const updatedChat = { ...old[chatIndex] };
                updatedChat.members = updatedChat.members.filter(member => member.user.email !== variables.email);
                const newChats = [...old];
                newChats[chatIndex] = updatedChat;
                return newChats;
            });
            queryClient.setQueryData([...chatDetailsKey], (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    members: old.members.filter((member: any) => member.user.email !== variables.email)
                };
            });
            return {
                previousChats,
                previousChatDetails
            };
        },
        onError: (error, _variables, context) => {
            queryClient.setQueryData(["chat", "getAllChats"], context?.previousChats);
            queryClient.setQueryData(trpc.chat.getChatDetails.queryKey({
                room_id: roomId,
            }), context?.previousChatDetails);
            toast.error(error.message);
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: trpc.chat.getChatDetails.queryKey({ room_id: roomId })
            });
            queryClient.invalidateQueries({ queryKey: trpc.chat.getAllChats.queryKey() });
        }
    }));

}