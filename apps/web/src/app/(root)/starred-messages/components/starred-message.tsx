import { Card } from "@/components/ui/card"
import { Star } from "lucide-react"
import ChatAvatar from "../../(communications)/components/chat-avatar";
import type { StarredMessageType } from "../../types/chat";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { Button } from "@/components/ui/button";

interface StarredMessageProps {
    starredMessage: StarredMessageType
}

export function StarredMessage({ starredMessage }: StarredMessageProps) {
    const queryClient = useQueryClient();
    const isImage = starredMessage.message.type === "IMAGE"
    const senderId = starredMessage.message.senderId;
    const user = useQuery(trpc.user.getUserData.queryOptions({ userId: senderId }));
    const mutateUnStarMessage = useMutation(trpc.messages.removeStarredMessage.mutationOptions({
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: trpc.messages.getStarredMessage.queryKey() });
        }
    }));

    const unStarMessage = () => {
        mutateUnStarMessage.mutateAsync({ messageId: starredMessage.message.id })
    }

    return (
        <Card className="p-4 hover:bg-accent/50 transition-colors">
            <div className="flex gap-3">
                <ChatAvatar recipientName={user.data?.name} size="h-10 w-10" user_image={user.data?.image ?? undefined} />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{starredMessage.user.name}</span>
                        <span className="text-xs text-muted-foreground">
                            {/* {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })} */}time
                        </span>
                    </div>
                    {isImage ? (
                        <div className="space-y-2">
                            {starredMessage.message.content && <p className="text-sm text-foreground break-words">{starredMessage.message.content}</p>}
                            <img
                                src={starredMessage.message.fileUrl || ""}
                                alt="Starred image"
                                className="rounded-lg max-w-full h-auto max-h-64 object-cover"
                            />
                        </div>
                    ) : (
                        <p className="text-sm text-foreground break-words whitespace-pre-wrap">{starredMessage.message.content}</p>
                    )}
                </div>
                <Button variant="ghost" type="button" onClick={unStarMessage}>
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
                </Button>
            </div>
        </Card>
    )
}
