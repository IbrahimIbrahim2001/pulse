import { Button } from '@/components/ui/button'
import { trpc } from '@/utils/trpc'
import { useMutation } from '@tanstack/react-query'
import { Star } from 'lucide-react'
import { toast } from 'sonner'

interface StarMessageProps {
    messageId: string,
    isMyMessage: boolean
}
export default function StarMessage({ messageId, isMyMessage }: StarMessageProps) {
    const mutateStarMessage = useMutation(trpc.messages.starMessage.mutationOptions({
        onSuccess: () => {
            toast.success("starred message successfully");
        },
        onError: (err) => {
            toast.error(err.message);
        }
    }));
    const starMessage = () => {
        mutateStarMessage.mutateAsync({ messageId });
    }
    return (
        <div className="md:relative">
            <Button
                variant="ghost"
                size="sm"
                className={`opacity-75 md:opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0 ${isMyMessage ? 'order-first' : 'order-last'
                    }`}
                onClick={starMessage}
            >
                <Star className="h-4 w-4" />
            </Button>
        </div >
    )
}
