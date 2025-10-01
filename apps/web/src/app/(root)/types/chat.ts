type MessageType = "TEXT" | "IMAGE" | "FILE" | "SYSTEM";


type MessageStatusType = "DELIVERED" | "SENT" | "SEEN";

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
}
type RoomType = "DIRECT" | "GROUP" | "CHANNEL"
type User = {
    id: string,
    name: string,
    email: string,
    // image:
    lastSeenAt?: string | null,
    isOnline?: boolean,

}

interface ChatMember {
    id: string,
    user: User
}

// Chat Type
export interface ChatType {
    id: string,
    name: string,
    type: RoomType,
    members: ChatMember[]
    messages: Message[]
}