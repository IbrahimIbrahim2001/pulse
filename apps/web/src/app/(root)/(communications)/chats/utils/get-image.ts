import type { ChatType } from "@/app/(root)/types/chat";
import { authClient } from "@/lib/auth-client";

// export const getChatImage = (members: ChatType["members"] | undefined, groupName?: string): string | undefined => {
//     const user_id = authClient.useSession().data?.user.id;
//     const image = authClient.useSession().data?.user.image;
//     if (groupName) {
//         return groupName;
//     }

//     const anotherMember = members?.find(m => (m.user.id !== user_id))
//     const memberImage = anotherMember?.user.image;
//     if (image && user_id !== anotherMember?.user.id && !memberImage) return image
//     return memberImage ?? undefined;
// };

export const getChatImage = (
    members: ChatType["members"] | undefined,
    groupName?: string
): string | undefined => {
    const user_id = authClient.useSession().data?.user.id;
    const currentUserImage = authClient.useSession().data?.user.image;

    if (groupName) {
        return groupName;
    }

    const anotherMember = members?.find(m => m.user.id !== user_id);
    const memberImage = anotherMember?.user.image;

    if (anotherMember && !anotherMember.user.image) return undefined
    if (memberImage) {
        return memberImage;
    }
    return currentUserImage || undefined;
};