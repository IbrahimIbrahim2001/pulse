import type { ChatType } from "@/app/(root)/types/chat";
import { authClient } from "@/lib/auth-client";

export const getRecipientName = (members: ChatType["members"] | undefined) => {
    const username = authClient.useSession().data?.user.name;
    if (members) {
        const recipientMember = members.find(member =>
            member?.user.name !== username
        );
        const recipientName = recipientMember?.user.name || "Unknown User";
        return recipientName;
    }
}