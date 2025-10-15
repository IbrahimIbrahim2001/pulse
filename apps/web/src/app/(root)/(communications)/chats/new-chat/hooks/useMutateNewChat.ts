import type { ChatType } from "@/app/(root)/types/chat";
import { trpc, queryClient } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useMutateNewChat = () => {
    return useMutation(trpc.chat.newChat.mutationOptions({
        onMutate: async (_variables) => {
            const queryKey = trpc.chat.getAllChats.queryKey();
            await queryClient.cancelQueries({ queryKey: queryKey });
            const previousChats = queryClient.getQueryData([...queryKey]) as ChatType[];
            const optimisticChat: ChatType = {
                id: `optimistic-${Date.now()}`,
                name: "New Chat",
                type: "DIRECT",
                members: [],
                messages: [],
                createdAt: ""
            };
            queryClient.setQueryData([queryKey], (old: ChatType[] | undefined) => {
                return old ? [...old, optimisticChat] : [optimisticChat];
            });
            return { previousChats };
        },
        onError: (error, _variables, context) => {
            queryClient.setQueryData(["chat", "getAllChats"], context?.previousChats);
            if (error?.data?.code === "NOT_FOUND") {
                toast.error("User Not Found", {
                    description: error.message
                });
            } else if (error?.data?.code === "CONFLICT") {
                toast.warning("", {
                    description: error.message
                });
            } else if (error?.data?.code === 'INTERNAL_SERVER_ERROR') {
                toast.error("Error", {
                    description: "Something went wrong. Please try again later.",
                });
            }
            else {
                toast.error("Error", {
                    description: "An unexpected error occurred.",
                });
            }
        },
        onSuccess: () => {
            const queryKey = trpc.chat.getAllChats.queryKey();
            queryClient.invalidateQueries({ queryKey: [...queryKey] });
            toast.success("Added new chat");
        },
        onSettled: () => {
            const queryKey = trpc.chat.getAllChats.queryKey();
            queryClient.invalidateQueries({ queryKey: [...queryKey] });
        }
    }));
}
