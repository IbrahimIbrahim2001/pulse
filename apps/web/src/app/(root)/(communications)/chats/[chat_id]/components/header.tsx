"use client";
import type { ChatType } from "@/app/(root)/types/chat";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { ArrowLeft, MoreVertical, Phone, PlusCircle } from "lucide-react";
import { redirect } from "next/navigation";
import ChatAvatar from "../../../components/chat-avatar";
import { getRecipientName } from "../../utils/get-recipient-name";
import { useMultipleUserStatus } from "../hooks/use-multiple-user-status";
import { useUserStatus } from "../hooks/use-user-status";

interface HeaderProps {
    members: ChatType["members"] | undefined,
    groupName?: string
}
export default function Header({ members, groupName }: HeaderProps) {
    const session = authClient.useSession();
    const currentUserId = session.data?.user.id;
    const recipientName = getRecipientName(members, groupName);
    const handleClick = () => {
        redirect("../chats");
    }
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

    return (
        <div className="flex items-center justify-between p-4 bg-card border-b border-border">
            <ArrowLeft className="size-5 sm:block md:hidden mr-2" onClick={handleClick} />
            <div className="flex-1 flex items-center gap-3">
                <ChatAvatar recipientName={recipientName} size="h-10 w-10" />
                <div className="flex-1">
                    <h2 className="font-semibold text-card-foreground">{recipientName}</h2>
                    <p className="text-sm text-muted-foreground">{getStatusText()}</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {groupName &&
                    <Button disabled variant="ghost" size="icon" className="text-card-foreground">
                        <PlusCircle className="h-5 w-5" />
                    </Button>
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


function formatLastSeen(lastSeenAt: Date | null): string {
    if (!lastSeenAt) return 'recently';

    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - lastSeenAt.getTime()) / 60000);

    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
}
