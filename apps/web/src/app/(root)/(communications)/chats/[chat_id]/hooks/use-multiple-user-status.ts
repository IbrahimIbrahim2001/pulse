import { useEffect, useState } from 'react';
import { useSocket } from './use-socket';

interface UserStatus {
    isOnline: boolean;
    lastSeenAt: Date | null;
}

interface UserStatuses {
    [userId: string]: UserStatus;
}

export const useMultipleUserStatus = (userIds: string[]) => {
    const [statuses, setStatuses] = useState<UserStatuses>({});
    const socket = useSocket();

    useEffect(() => {
        if (!socket) return;

        const handleStatusChange = (data: {
            userId: string;
            isOnline: boolean;
            lastSeenAt: string;
        }) => {
            if (userIds.includes(data.userId)) {
                setStatuses(prev => ({
                    ...prev,
                    [data.userId]: {
                        isOnline: data.isOnline,
                        lastSeenAt: new Date(data.lastSeenAt)
                    }
                }));
            }
        };

        socket.on('user_status_changed', handleStatusChange);

        return () => {
            socket.off('user_status_changed', handleStatusChange);
        };
    }, [socket, userIds]);

    return statuses;
};