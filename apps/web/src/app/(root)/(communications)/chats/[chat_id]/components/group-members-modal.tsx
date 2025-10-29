"use client";
import type { ChatType } from "@/app/(root)/types/chat";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ResponsiveModal, ResponsiveModalContent, ResponsiveModalDescription, ResponsiveModalHeader, ResponsiveModalTitle, ResponsiveModalTrigger } from "@/components/ui/responsive-modal";
import { authClient } from "@/lib/auth-client";
import { socketClient } from "@/lib/socketClient";
import { trpc } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { TrashIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import ChatAvatar from "../../../components/chat-avatar";
import { useDeleteGroupMember } from "../hooks/use-delete-group-member";
import { getChatImage } from "../../utils/get-image";

export function GroupMembersModal({ groupName, members, getStatusText }: { groupName: string, members: ChatType["members"] | undefined, getStatusText: () => string }) {
    const { chat_id } = useParams();
    const roomId = chat_id ? chat_id.toString() : "";
    const socket = useMemo(socketClient, []);
    const currentUser = authClient.useSession().data?.user;
    const mutateMessage = useMutation(trpc.messages.saveMessage.mutationOptions());
    const mutate = useDeleteGroupMember(roomId, groupName);
    const [isOpen, setIsOpen] = useState(false);
    const removeUser = (email: string, name: string) => {
        mutate.mutateAsync({ email: email, group_name: groupName });
        setIsOpen(false);
        const user_id = currentUser?.id;
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
                    <ResponsiveModalHeader >
                        <ResponsiveModalTitle>{groupName}'s members</ResponsiveModalTitle>
                        <ResponsiveModalDescription className="flex flex-col gap-2 mt-2" asChild>
                            <div>
                                {members?.map(member => {
                                    const isCurrentUser = member.user.id === currentUser?.id;
                                    const isAdmin = member.role === "ADMIN";
                                    const isOnline = member.user.isOnline;
                                    const currentUserIsAdmin = members?.find(m => m.user.id === currentUser?.id)?.role === "ADMIN";
                                    const user_image = member.user.image || ""
                                    return (
                                        <div key={member.user.id} className={`flex items-center gap-2 ${isCurrentUser ? 'font-semibold' : ''}`}>
                                            <div className="flex items-center gap-2 flex-1">
                                                <div className="relative">
                                                    <ChatAvatar recipientName={member.user.name} size="h-8 w-8" user_image={user_image} />
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
                            </div>
                        </ResponsiveModalDescription>
                    </ResponsiveModalHeader>
                </ResponsiveModalContent>
            </ResponsiveModal>
        </>
    )
}