"use client";
import type { ChatType } from "@/app/(root)/types/chat";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { ArrowLeft, MoreVertical, Phone } from "lucide-react";
import { redirect } from "next/navigation";
import ChatAvatar from "../../../components/chat-avatar";
import { getRecipientName } from "../../utils/get-recipient-name";
import { useMultipleUserStatus } from "../hooks/use-multiple-user-status";
import { useUserStatus } from "../hooks/use-user-status";
import { formatLastSeen } from "../utils/format-last-seen";
import AddNewGroupMember from "./add-new-group-member";
import { GroupMembersModal } from "./group-members-modal";
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
    const memberIds = members?.map(member => member.user.id) || [];
    const memberStatuses = useMultipleUserStatus(memberIds);
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