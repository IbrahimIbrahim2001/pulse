import type { Message } from "@/app/(root)/types/chat"

export const SystemMessages = ({ message }: { message: Message }) => {
    return (
        <p className="w-full text-center text-xs text-muted-foreground mb-1">{message.content}</p>
    )
}