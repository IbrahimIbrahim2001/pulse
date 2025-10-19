import type { ChatType } from "@/app/(root)/types/chat";

export const getChatImage = (members: ChatType["members"] | undefined): string | undefined => {
    const memberWithImage = members?.find(member =>
        member.user.image &&
        member.user.image.trim() !== ''
    );

    return memberWithImage?.user.image ?? undefined;
};