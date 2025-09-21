import { io } from "socket.io-client";

export const socketClient = () => io(process.env.NEXT_PUBLIC_SERVER_URL, {
    withCredentials: true,
    transports: ['websocket'],
})