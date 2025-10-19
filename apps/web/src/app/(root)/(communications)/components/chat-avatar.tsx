interface ChatAvatarType {
    recipientName: string | undefined,
    size: string,
    user_image: string | undefined
}

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ChatAvatar({ recipientName = "Unknown User", size, user_image }: ChatAvatarType) {
    return (
        <Avatar className={`${size}  ring-2 ring-transparent group-hover:ring-primary/20 transition-all duration-200`}>
            <AvatarImage src={user_image} />
            <AvatarFallback className="bg-primary text-primary-foreground font-medium">{recipientName.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
    )
}
