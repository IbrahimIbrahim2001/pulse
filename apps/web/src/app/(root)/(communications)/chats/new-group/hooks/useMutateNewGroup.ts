import type { ChatType } from "@/app/(root)/types/chat";
import { trpc, queryClient } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useMutateNewGroup = () => {
    return useMutation(trpc.chat.newGroup.mutationOptions({
        onMutate: async (_variables) => {
            const queryKey = trpc.chat.getAllChats.queryKey();
            await queryClient.cancelQueries({ queryKey: queryKey });
            const previousChats = queryClient.getQueryData([...queryKey]) as ChatType[];
            const optimisticChat: ChatType = {
                id: `optimistic-${Date.now()}`,
                name: "New Group",
                type: "GROUP",
                members: []
            };
            queryClient.setQueryData([queryKey], (old: ChatType[] | undefined) => {
                return old ? [...old, optimisticChat] : [optimisticChat];
            });
            return { previousChats };
        },
        onError: (error, _variables, context) => {
            queryClient.setQueryData(["chat", "getAllChats"], context?.previousChats);
            toast.error(error.message);
        },
        onSuccess: () => {
            const queryKey = trpc.chat.getAllChats.queryKey();
            queryClient.invalidateQueries({ queryKey: [...queryKey] });
            toast.success("Added new group");
        },
        onSettled: () => {
            const queryKey = trpc.chat.getAllChats.queryKey();
            queryClient.invalidateQueries({ queryKey: [...queryKey] });
        }
    }));
}