"use client";
import type { ChatType } from "@/app/(root)/types/chat";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreVertical, Phone, PlusCircle, Video } from "lucide-react";
import { redirect } from "next/navigation";
import ChatAvatar from "../../../components/chat-avatar";
import { getRecipientName } from "../../utils/get-recipient-name";

interface HeaderProps {
    members: ChatType["members"] | undefined, // this is 
    groupName?: string
}
export default function Header({ members, groupName }: HeaderProps) {
    const recipientName = getRecipientName(members, groupName);
    const handleClick = () => {
        redirect("../chats");
    }
    return (
        <div className="flex items-center justify-between p-4 bg-card border-b border-border">
            <ArrowLeft className="size-5 sm:block md:hidden mr-2" onClick={handleClick} />
            <div className="flex-1 flex items-center gap-3">
                <ChatAvatar recipientName={recipientName} size="h-10 w-10" />
                <div>
                    <h2 className="font-semibold text-card-foreground">{recipientName}</h2>
                    {groupName ?
                        <p className="text-sm text-muted-foreground">{members?.length} members</p>
                        :
                        <p className="text-sm text-muted-foreground">Online</p>
                    }
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
                <Button disabled variant="ghost" size="icon" className="text-card-foreground">
                    <Video className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-card-foreground">
                    <MoreVertical className="h-5 w-5" />
                </Button>
            </div>
        </div >
    )
}
