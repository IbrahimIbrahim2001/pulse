type MessageType = "TEXT" | "IMAGE" | "FILE" | "SYSTEM";


type MessageStatusType = "DELIVERED" | "SENT" | "SEEN";
type RoleType = "ADMIN" | "MODERATOR" | "MEMBER";

// Message Type
export interface Message {
    id: string;
    createdAt: string;
    updatedAt: string;
    type: MessageType;
    content: string;
    senderId: string;
    roomId: string;
    status?: MessageStatusType;
    fileUrl: string | null;
    fileName: string | null;
    fileSize: number | null;
    replyToId: string | null;
    reaction: {
        id: string;
        reaction: string;
        roomMemberId: string,
        messageId: string
    }[]
}
type RoomType = "DIRECT" | "GROUP" | "CHANNEL"
type User = {
    id: string,
    name: string,
    email: string,
    image: string | null,
    lastSeenAt?: string | null,
    isOnline?: boolean,

}

interface ChatMember {
    id: string,
    user: User,
    role: RoleType
}

// Chat Type
export interface ChatType {
    id: string,
    name: string,
    type: RoomType,
    members: ChatMember[]
    messages: Message[]
    createdAt: string;
}




export interface StoryType {
    id: string;
    title: string | null;
    fileUrl: string;
    fileName: string;
    createdAt: string;
    user: User;
    views: {
        user: User
    }[],
}