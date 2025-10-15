"use client";
import type { Message } from "@/app/(root)/types/chat";
import { Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface MessageStatusProps {
    message: Message;
    sender_id: string | undefined;
    className?: string;
}
export const MessageStatus = ({ message, sender_id, className }: MessageStatusProps) => {
    if (message.senderId !== sender_id) {
        return null;
    }
    return (
        <span className={cn("ml-1", className)}>
            {getStatusIcon(message.status || "SENT")}
        </span>
    );
};

const getStatusIcon = (status: Message["status"]) => {
    switch (status) {
        case "SENT":
            return <Check size={15} className="text-muted-foreground" />;
        case "DELIVERED":
            return <CheckCheck size={15} className="text-muted-foreground" />;
        case "SEEN":
            return <CheckCheck size={15} className="text-blue-500" />;
        default:
            return <Check size={15} className="text-muted-foreground" />;
    }
};