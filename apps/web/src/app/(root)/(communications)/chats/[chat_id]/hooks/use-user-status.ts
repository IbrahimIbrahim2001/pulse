import { useEffect, useState } from 'react';
import { useSocket } from './use-socket';

interface UserStatus {
    isOnline: boolean;
    lastSeenAt: Date | null;
}

export const useUserStatus = (userId: string) => {
    const [status, setStatus] = useState<UserStatus>({
        isOnline: false,
        lastSeenAt: null
    });
    const socket = useSocket();

    useEffect(() => {
        if (!socket || !userId) return;

        const handleStatusChange = (data: {
            userId: string;
            isOnline: boolean;
            lastSeenAt: string;
        }) => {
            if (data.userId === userId) {
                setStatus({
                    isOnline: data.isOnline,
                    lastSeenAt: new Date(data.lastSeenAt)
                });
            }
        };

        socket.on('user_status_changed', handleStatusChange);

        return () => {
            socket.off('user_status_changed', handleStatusChange);
        };
    }, [socket, userId]);

    return status;
};