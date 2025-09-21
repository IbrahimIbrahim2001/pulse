interface ChatAvatarType {
    recipientName: string | undefined,
    size: string
}

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ChatAvatar({ recipientName = "Unknown User", size }: ChatAvatarType) {
    return (
        <Avatar className={`${size} ring-2 ring-transparent group-hover:ring-primary/20 transition-all duration-200`}>
            <AvatarImage src="/abstract-profile.png" />
            <AvatarFallback className="bg-primary text-primary-foreground font-medium">{recipientName.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
    )
}
