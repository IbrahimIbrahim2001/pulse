import { queryClient, trpc } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";


export const useMutateDeleteMessages = (roomId: string) => {
    return useMutation(trpc.messages.deleteAllMessages.mutationOptions({
        onMutate: async (variables) => {
            const chatDetailsKey = trpc.chat.getChatDetails.queryKey({
                room_id: roomId,
            });
            await queryClient.cancelQueries({ queryKey: chatDetailsKey });
            const previousChatDetails = queryClient.getQueryData([...chatDetailsKey]) as any;
            queryClient.setQueryData([...chatDetailsKey], (old: any) => {
                if (!old) return old;
                return {
                    ...old,
                    messages: []
                };
            });
            return {
                previousChatDetails
            };
        },
        onError: (error, _variables, context) => {
            queryClient.setQueryData(trpc.chat.getChatDetails.queryKey({
                room_id: roomId,
            }), context?.previousChatDetails);
            toast.error(error.message);
        },
        onSettled: () => {
            queryClient.invalidateQueries({
                queryKey: trpc.chat.getChatDetails.queryKey({ room_id: roomId })
            });
        },
    }));
}
