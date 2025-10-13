"use client";
import type { ChatType } from "@/app/(root)/types/chat";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { ArrowLeft, DeleteIcon, Dot, MoreVertical, Phone, TrashIcon } from "lucide-react";
import { redirect, useParams } from "next/navigation";
import ChatAvatar from "../../../components/chat-avatar";
import { getRecipientName } from "../../utils/get-recipient-name";
import { useMultipleUserStatus } from "../hooks/use-multiple-user-status";
import { useUserStatus } from "../hooks/use-user-status";
import AddNewGroupMember from "./add-new-group-member";
import { formatLastSeen } from "../utils/format-last-seen";
import { ResponsiveModal, ResponsiveModalContent, ResponsiveModalHeader, ResponsiveModalTitle, ResponsiveModalDescription, ResponsiveModalTrigger } from "@/components/ui/responsive-modal";
import { Badge } from "@/components/ui/badge";
import { queryClient, trpc } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useMemo, useState } from "react";
import { socketClient } from "@/lib/socketClient";

interface HeaderProps {
    members: ChatType["members"] | undefined,
    groupName?: string
}
export default function Header({ members, groupName }: HeaderProps) {
    const session = authClient.useSession();
    const currentUserId = session.data?.user.id;
    const recipientName = getRecipientName(members, groupName);

    const otherMember = members?.find(member => member.user.id !== currentUserId);
    const { isOnline: isRecipientOnline, lastSeenAt } = useUserStatus(otherMember?.user.id || '');

    // For group chats - get status of all members
    const memberIds = members?.map(member => member.user.id) || [];
    const memberStatuses = useMultipleUserStatus(memberIds);

    // Calculate online count for groups
    const onlineCount = memberIds.filter(id =>
        memberStatuses[id]?.isOnline
    ).length;


    const getStatusText = () => {
        if (groupName) {
            return `${onlineCount} of ${members?.length} members online`;
        } else {
            if (isRecipientOnline) {
                return "Online";
            } else {
                return `Last seen ${formatLastSeen(lastSeenAt)}`;
            }
        }
    };

    const handleClick = () => {
        redirect("../chats");
    }

    return (
        <div className="flex items-center justify-between p-4 bg-card border-b border-border">
            <ArrowLeft className="size-5 sm:block md:hidden mr-2" onClick={handleClick} />
            <div className="flex-1 flex items-center gap-3">
                <ChatAvatar recipientName={recipientName} size="h-10 w-10" />
                <div className="flex-1">
                    <h2 className="font-semibold text-card-foreground truncate">{recipientName}</h2>
                    {!groupName ? <p className="text-sm text-muted-foreground truncate">{getStatusText()}</p> : <GroupMembersModal groupName={groupName} members={members} getStatusText={getStatusText} />}
                </div>
            </div>
            <div className="flex items-center gap-2">
                {groupName &&
                    <AddNewGroupMember groupName={groupName} />
                }
                <Button disabled variant="ghost" size="icon" className="text-card-foreground">
                    <Phone className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-card-foreground">
                    <MoreVertical className="h-5 w-5" />
                </Button>
            </div>
        </div >
    )
}


function GroupMembersModal({ groupName, members, getStatusText }: { groupName: string, members: ChatType["members"] | undefined, getStatusText: () => string }) {
    const { chat_id } = useParams();
    const roomId = chat_id ? chat_id.toString() : "";
    const mutateMessage = useMutation(trpc.messages.saveMessage.mutationOptions());
    const socket = useMemo(socketClient, []);
    const user = authClient.useSession().data?.user;
    const mutate = useMutation(trpc.chat.removeGroupMember.mutationOptions({
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

    const session = authClient.useSession();
    const currentUserId = session.data?.user.id;

    const [isOpen, setIsOpen] = useState(false);

    const removeUser = (email: string, name: string) => {
        mutate.mutateAsync({ email: email, group_name: groupName });
        setIsOpen(false);
        const user_id = user?.id;
        if (user_id) {
            const systemMessage = {
                roomId: roomId,
                content: `${name} was removed from the group`,
                senderId: user_id,
                type: "SYSTEM" as const
            }
            socket.emit("send", systemMessage)
            mutateMessage.mutateAsync(systemMessage);
        }
    }
    return (
        <>
            <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
                <ResponsiveModalTrigger>
                    <p className="text-sm text-muted-foreground truncate">{getStatusText()}</p>
                </ResponsiveModalTrigger>
                <ResponsiveModalContent>
                    <ResponsiveModalHeader>
                        <ResponsiveModalTitle>{groupName}'s members</ResponsiveModalTitle>
                        <ResponsiveModalDescription className="flex flex-col gap-2 mt-2">
                            {members?.map(member => {
                                const isCurrentUser = member.user.id === currentUserId;
                                const isAdmin = member.role === "ADMIN";
                                const isOnline = member.user.isOnline;
                                const currentUserIsAdmin = members?.find(m => m.user.id === currentUserId)?.role === "ADMIN";
                                return (
                                    <div key={member.user.id} className={`flex items-center gap-2 ${isCurrentUser ? 'font-semibold' : ''}`}>
                                        <div className="flex items-center gap-2 flex-1">
                                            <div className="relative">
                                                <ChatAvatar recipientName={member.user.name} size="h-8 w-8" />
                                                {isOnline && !isCurrentUser && (
                                                    <>
                                                        <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-background z-10" />
                                                        <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-green-500 border-2 border-background animate-ping" />
                                                    </>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground truncate">{member.user.name}</p>
                                            {isCurrentUser && <span className="text-xs text-muted-foreground">(You)</span>}
                                        </div>
                                        {currentUserIsAdmin && !isAdmin && !isCurrentUser && (
                                            <Button variant="outline" className="text-destructive" onClick={() => removeUser(member.user.email, member.user.name)}>
                                                <TrashIcon />
                                            </Button>
                                        )}
                                        {isAdmin && <Badge className="bg-primary/80 dark:bg-primary/50 text-white/90 flex items-center justify-center">Group Admin</Badge>}
                                    </div>
                                );
                            })}
                        </ResponsiveModalDescription>
                    </ResponsiveModalHeader>
                </ResponsiveModalContent>
            </ResponsiveModal>
        </>
    )
}