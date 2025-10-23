import type { ChatType } from "@/app/(root)/types/chat";
import { authClient } from "@/lib/auth-client";

export const getChatImage = (members: ChatType["members"] | undefined, groupName?: string): string | undefined => {
    const image = authClient.useSession().data?.user.image;
    if (groupName) {
        return groupName;
    }
    const checkMemberWithImage = members?.find(member => {
        image &&
            image.trim() !== ''
    });
    return checkMemberWithImage?.user.image ?? undefined;
};