import type { Message } from "@/app/(root)/types/chat"
import { formatTime } from "../../utils/format-time"
import { MessageStatus } from "./get-status-icon"
import { UserDetailsDialog } from "./user-details-dialog"
import type { MessagesProps } from "../messages"

export const TextMessages = ({ message, sender_id, chat }: { message: Message, sender_id: MessagesProps["sender_id"], chat: MessagesProps["chat"] }) => {
    return (
        <div
            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${message.senderId === sender_id
                ? "bg-primary/90 dark:bg-primary/75 text-primary-foreground"
                : "bg-card text-card-foreground border border-border"
                }`}
        >
            {(message.senderId !== sender_id && chat?.type === "GROUP") && <UserDetailsDialog chat={chat} message={message} />}
            <p className="text-sm leading-relaxed">{message.content}</p>
            <div className="flex items-center justify-end mt-1 text-xs gap-x-1 opacity-80">
                {formatTime(message.createdAt)}
                <MessageStatus message={message} sender_id={sender_id} />
            </div>
        </div>
    )
}