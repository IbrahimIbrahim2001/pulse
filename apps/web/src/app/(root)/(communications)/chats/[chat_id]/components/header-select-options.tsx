import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";
import { useMutation, useQuery } from "@tanstack/react-query";
import { MoreVertical } from "lucide-react";
import { useParams } from "next/navigation";
import { useMutateDeleteMessages } from "../hooks/use-mutate-delete-messages";
import { useMemo } from "react";
import { socketClient } from "@/lib/socketClient";
export const SelectOptions = () => {
    const { chat_id } = useParams();
    const roomId = chat_id ? chat_id.toString() : "";

    const mutateDeleteMessages = useMutateDeleteMessages(roomId);
    const mutateSendMessage = useMutation(trpc.messages.saveMessage.mutationOptions())
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
            mutateDeleteMessages.mutateAsync({ id: chat.id }) //add optimistic states for messages
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
    const deleteGroup = () => {

    }
    const leaveChat = () => {

    }
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-card-foreground">
                        <MoreVertical className="h-5 w-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mr-5">
                    {isGroup ? (
                        //Group Logic
                        isAdmin ? (
                            //Group Admin Logic
                            <>
                                {
                                    chat?.messages && chat?.messages.length > 0 && <DropdownMenuItem onClick={deleteMessages}>
                                        <p className="w-full flex items-center justify-start">
                                            Delete messages
                                        </p>
                                    </DropdownMenuItem>
                                }
                                <DropdownMenuItem onClick={deleteGroup}>
                                    <p className="w-full flex items-center justify-start">
                                        Delete group
                                    </p>
                                </DropdownMenuItem>
                            </>
                        ) : (
                            // Group user Logic
                            <DropdownMenuItem onClick={leaveChat}>
                                <p className="w-full flex items-center justify-start">
                                    Leave group
                                </p>
                            </DropdownMenuItem>
                        )
                    ) :
                        //Direct Chat Logic
                        (
                            <>
                                {
                                    chat?.messages && chat?.messages.length > 0 && chat.messages.find(m => m.type === "TEXT") && <DropdownMenuItem onClick={deleteMessages}>
                                        <p className="w-full flex items-center justify-start">
                                            Delete messages
                                        </p>
                                    </DropdownMenuItem>
                                }
                                <DropdownMenuItem onClick={leaveChat}>
                                    <p className="w-full flex items-center justify-start">
                                        Delete Chat
                                    </p>
                                </DropdownMenuItem>
                            </>
                        )
                    }
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    )
}
