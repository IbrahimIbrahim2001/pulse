import { useEffect } from 'react';
import { trpc } from '@/utils/trpc';
import { useMutation } from '@tanstack/react-query';
import type { Socket } from 'socket.io-client';

export const useMessageStatus = (socket: Socket, roomId: string, sender_id: string | undefined) => {
    const updateStatusMutation = useMutation(trpc.messages.updateMessageStatus.mutationOptions());

    useEffect(() => {
        if (!sender_id) return;

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                updateStatusMutation.mutate({
                    message_ids: [],
                    status: 'SEEN'
                });
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [sender_id, updateStatusMutation]);

    return {
        markAsSeen: (messageIds: string[]) => {
            updateStatusMutation.mutate({
                message_ids: messageIds,
                status: 'SEEN'
            });

            socket.emit("message_status_update", {
                messageIds,
                status: 'SEEN',
                roomId
            });
        }
    };
};