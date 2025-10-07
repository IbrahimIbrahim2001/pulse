import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { authClient } from '@/lib/auth-client';

export const useSocket = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const { data: session } = authClient.useSession();

    useEffect(() => {
        if (session?.user?.id) {
            const socketInstance = io(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000', {
                withCredentials: true,
                transports: ['websocket'],
            });

            socketInstance.on('connect', () => {
                console.log('Connected to server');
                socketInstance.emit('user_online', session.user.id);
            });

            socketInstance.on('disconnect', () => {
                console.log('Disconnected from server');
            });

            // Handle user status changes
            socketInstance.on('user_status_changed', (_data) => {
                console.log('User status changed:');
            });

            setSocket(socketInstance);

            // Set up heartbeat for user activity
            const heartbeat = setInterval(() => {
                if (socketInstance.connected && session?.user?.id) {
                    socketInstance.emit('user_activity', session.user.id);
                }
            }, 30000);

            return () => {
                clearInterval(heartbeat);
                if (session?.user?.id) {
                    socketInstance.emit('user_offline', session.user.id);
                }
                socketInstance.disconnect();
            };
        }
    }, [session?.user?.id]);

    return socket;
};