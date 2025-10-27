"use client";
import type { ChatType } from "@/app/(root)/types/chat";
import { ResponsiveModal, ResponsiveModalContent, ResponsiveModalDescription, ResponsiveModalHeader, ResponsiveModalTitle, ResponsiveModalTrigger } from "@/components/ui/responsive-modal";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import ChatAvatar from "../../../components/chat-avatar";
import { getChatImage } from "../../utils/get-image";
import { getRecipientName } from "../../utils/get-recipient-name";

export function UserDetails({ members, getStatusText }: { members: ChatType["members"] | undefined, getStatusText: () => string }) {
    const [open, setOpen] = useState(false);
    const currentUserId = authClient.useSession().data?.user.id;
    const userName = getRecipientName(members, "");
    const user_image = getChatImage(members, "");
    const userEmail = members?.find(m => m.user.id !== currentUserId)?.user.email;
    return (
        <>
            <ResponsiveModal open={open} onOpenChange={setOpen}>
                <ResponsiveModalTrigger>
                    <p className="text-sm text-muted-foreground truncate">{getStatusText()}</p>
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
                        </ResponsiveModalHeader>
                    </ResponsiveModalContent>
                }
            </ResponsiveModal>
        </>
    )
}