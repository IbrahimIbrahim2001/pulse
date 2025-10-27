import ChatAvatar from "@/app/(root)/(communications)/components/chat-avatar";
import type { ChatType, Message } from "@/app/(root)/types/chat";
import { Button } from "@/components/ui/button";
import { ResponsiveModal, ResponsiveModalContent, ResponsiveModalDescription, ResponsiveModalHeader, ResponsiveModalTitle, ResponsiveModalTrigger } from "@/components/ui/responsive-modal";
import { cn } from "@/lib/utils";
import { MessageSquareText, Phone } from "lucide-react";
import { useState } from "react";
import { getSenderName } from "../../utils/get-sender-name";
import { useMutateNewChat } from "../../../new-chat/hooks/useMutateNewChat";
import { redirect } from "next/navigation";
import { getChatImage } from "../../../utils/get-image";

export const UserDetailsDialog = ({ chat, message }: { chat: ChatType, message: Message }) => {
    const mutation = useMutateNewChat();
    const [open, setOpen] = useState(false);
    const userName = getSenderName(chat.members, message.senderId)
    const groupName = chat.type === "GROUP" ? chat.name : "";
    const user_image = getChatImage(chat.members, groupName)
    const userEmail = chat.members.find(m => m.user.name === userName)?.user.email;

    const handleNewChat = async () => {
        if (userEmail) {
            const res = await mutation.mutateAsync({ email: userEmail });
            if (res) redirect(`../chats/${res.id}`)
        }
    }

    return (
        <>
            <ResponsiveModal open={open} onOpenChange={setOpen}>
                <ResponsiveModalTrigger>
                    <p className={cn(
                        "text-primary text-xs font-extrabold",
                        userName !== "Unknown User" && "hover:underline underline-offset-4 transition-all delay-75"
                    )}>
                        {userName}
                    </p>
                </ResponsiveModalTrigger>
                {userName !== "Unknown User" &&
                    <ResponsiveModalContent>
                        <ResponsiveModalHeader>
                            <ResponsiveModalTitle>
                                <div className="w-full flex flex-col space-y-2 items-center justify-center">
                                    <ChatAvatar recipientName={userName} size="h-15 w-15" user_image={user_image} />
                                    <p>{userEmail}</p>
                                    <p className="text-sm text-muted-foreground/90">~ {userName}</p>
                                </div>
                            </ResponsiveModalTitle>
                            <ResponsiveModalDescription asChild>
                                <div className="flex items-center justify-between md:justify-center gap-2 mt-2">
                                    <Button
                                        variant="secondary"
                                        className={cn(
                                            "group h-16 flex-1 flex flex-col items-center justify-center gap-1.5 transition-all duration-200",
                                            "hover:shadow-md hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                                            "active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                        )}
                                        onClick={handleNewChat}
                                    >
                                        <MessageSquareText className="size-5 text-primary transition-transform group-hover:scale-110" />
                                        <p className="font-bold text-xs text-muted-foreground">New Chat</p>
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        disabled
                                        className={cn(
                                            "group h-16 flex-1 flex flex-col items-center justify-center gap-1.5 transition-all duration-200",
                                            "hover:shadow-md hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                                            "active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                        )}
                                    >
                                        <Phone className="size-5 text-primary transition-transform group-hover:scale-110" />
                                        <p className="font-bold text-xs text-muted-foreground">Call</p>
                                    </Button>
                                </div>
                            </ResponsiveModalDescription>
                        </ResponsiveModalHeader>
                    </ResponsiveModalContent>
                }
            </ResponsiveModal>
        </>
    )
}