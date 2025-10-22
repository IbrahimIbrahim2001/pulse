import ChatAvatar from "@/app/(root)/(communications)/components/chat-avatar"
import { Button } from "@/components/ui/button"
import { ResponsiveModal, ResponsiveModalContent, ResponsiveModalDescription, ResponsiveModalHeader, ResponsiveModalTitle, ResponsiveModalTrigger } from "@/components/ui/responsive-modal"
import { authClient } from "@/lib/auth-client"
import { socketClient } from "@/lib/socketClient"
import { trpc } from "@/utils/trpc"
import { useQuery } from "@tanstack/react-query"
import { ChevronUp, TrashIcon } from "lucide-react"
import { useParams } from "next/navigation"
import { useMemo } from "react"

interface MessageReactionsType {
    reactions: {
        id: string,
        reaction: string,
        roomMemberId: string,
        messageId: string
    }[],
    isMyMessage: boolean
}

export const MessageReactionsList = ({ reactions, isMyMessage }: MessageReactionsType) => {
    const { chat_id } = useParams<{ chat_id: string }>()
    const userId = authClient.useSession().data?.user.id;
    const { data: room } = useQuery(
        trpc.chat.getChatDetails.queryOptions({ room_id: chat_id || "" })
    );
    // const socket = useMemo(socketClient, []); //tomorrow
    const roomMemberToUserMap = useMemo(() => {
        const map = new Map()
        room?.members?.forEach(member => {
            if (member.id) map.set(member.id, member.user)
            if (member.userId) map.set(member.userId, member.user)
            if (member.user?.id) map.set(member.user.id, member.user)
        })
        return map
    }, [room?.members])
    const groupedReactions = useMemo(() => {
        const groups: {
            [key: string]: {
                count: number;
                reactions: Array<{
                    id: string;
                    roomMemberId: string;
                    user?: {
                        id: string;
                        name?: string | null;
                        email?: string | null;
                        image?: string | null;
                    }
                }>
            }
        } = {};
        reactions?.forEach(reaction => {
            if (!groups[reaction.reaction]) {
                groups[reaction.reaction] = {
                    count: 0,
                    reactions: []
                };
            }
            groups[reaction.reaction].count++;
            let user = roomMemberToUserMap.get(reaction.roomMemberId);
            if (!user) {
                console.log('Room members:', room?.members);
                console.log('Reaction roomMemberId:', reaction.roomMemberId);
            }
            groups[reaction.reaction].reactions.push({
                id: reaction.id,
                roomMemberId: reaction.roomMemberId,
                user: user
            });
        });
        return groups;
    }, [reactions, roomMemberToUserMap, room?.members]);
    const reactionEntries = Object.entries(groupedReactions);
    if (!reactions?.length || reactionEntries.length === 0) {
        return null;
    }
    return (
        <ResponsiveModal>
            <ResponsiveModalTrigger asChild>
                <div
                    className={`absolute -bottom-4 z-10 cursor-pointer ${isMyMessage ? "right-20" : "left-20"
                        } flex items-center gap-1 mt-1 mb-2 bg-popover/40 border rounded-full shadow-lg px-2 py-1 break-words truncate max-w-32 hover:bg-popover/60 transition-colors`}
                >
                    {reactionEntries.slice(0, 2).map(([emoji, data]) => (
                        <div key={emoji} className="flex items-center gap-1 text-xs">
                            <span>{emoji}</span>
                            {data.count > 1 && (
                                <span className="text-xs opacity-70">{data.count}</span>
                            )}
                        </div>
                    ))}
                    {reactionEntries.length > 2 && (
                        <ChevronUp className="size-3 opacity-70" />
                    )}
                </div>
            </ResponsiveModalTrigger>
            <ResponsiveModalContent>
                <ResponsiveModalHeader>
                    <ResponsiveModalTitle>Reactions</ResponsiveModalTitle>
                    <ResponsiveModalDescription className="flex flex-col gap-4 mt-4" asChild>
                        <div>
                            {reactionEntries.map(([emoji, data]) => (
                                <div key={emoji} className="border-b pb-4 last:border-b-0 last:pb-0">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-2xl">{emoji}</span>
                                        <span className="text-sm text-muted-foreground">
                                            {data.count} {data.count === 1 ? 'reaction' : 'reactions'}
                                        </span>
                                    </div>
                                    <div className="space-y-2">
                                        {data.reactions.map((reaction) => {
                                            const userName = reaction.user?.name || 'Unknown User';
                                            const userImage = reaction.user?.image || "";
                                            const myReaction = reaction.user?.id === userId;
                                            return (
                                                <div
                                                    key={reaction.id}
                                                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-accent/50 transition-colors"
                                                >
                                                    <ChatAvatar
                                                        recipientName={userName}
                                                        size="w-8 h-8"
                                                        user_image={userImage}
                                                    />
                                                    <div className="flex justify-between w-full">
                                                        <div className="flex-1 flex flex-col items-start min-w-0">
                                                            <p className="font-medium text-sm truncate">
                                                                {userName}  {" "} {myReaction ? "(you)" : ""}
                                                            </p>
                                                            {reaction.user?.email && (
                                                                <p className="text-xs text-muted-foreground truncate">
                                                                    {reaction.user.email}
                                                                </p>
                                                            )}
                                                            {!reaction.user && (
                                                                <p className="text-xs text-muted-foreground">
                                                                    User information not available
                                                                </p>
                                                            )}
                                                        </div>
                                                        {myReaction &&
                                                            <Button variant="outline" className="text-destructive" onClick={() => console.log("first")}>
                                                                <TrashIcon />
                                                            </Button>
                                                        }
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ResponsiveModalDescription>
                </ResponsiveModalHeader>
            </ResponsiveModalContent>
        </ResponsiveModal>
    );
};