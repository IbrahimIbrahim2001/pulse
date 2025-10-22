// lib/socket-handlers.ts
import prisma from "@/prisma";
import { Server } from "socket.io";

// Store user ID to socket ID mapping (for multiple connections per user)
const userSockets = new Map<string, Set<string>>();

export function setupSocketHandlers(io: Server) {
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        // User comes online
        socket.on("user_online", async (userId: string) => {
            try {
                // Add socket to user's connection set
                if (!userSockets.has(userId)) {
                    userSockets.set(userId, new Set());
                }
                userSockets.get(userId)!.add(socket.id);

                // If this is the first connection for this user, update status
                if (userSockets.get(userId)!.size === 1) {
                    // Update user as online in database
                    await prisma.user.update({
                        where: { id: userId },
                        data: {
                            isOnline: true,
                            lastSeenAt: new Date()
                        }
                    });

                    // Notify all clients that user is online
                    io.emit("user_status_changed", {
                        userId,
                        isOnline: true,
                        lastSeenAt: new Date()
                    });

                    console.log(`User ${userId} is now online`);
                }
            } catch (error) {
                console.error("Error setting user online:", error);
            }
        });

        // User activity (updates lastSeenAt)
        socket.on("user_activity", async (userId: string) => {
            try {
                await prisma.user.update({
                    where: { id: userId },
                    data: {
                        lastSeenAt: new Date()
                    }
                });

                // Optionally broadcast activity to relevant rooms
                socket.broadcast.emit("user_activity", {
                    userId,
                    lastSeenAt: new Date()
                });
            } catch (error) {
                console.error("Error updating user activity:", error);
            }
        });

        // Message handling - ONLY BROADCASTING, NO DATABASE SAVING
        socket.on("send", async (messageData) => {
            // console.log("Message received for broadcasting:", messageData);
            try {
                io.to(messageData.roomId).emit("message", {
                    ...messageData,
                    id: messageData.id || Date.now().toString(),
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    type: messageData.type || "TEXT",
                });
                // Still update room's updatedAt and user's lastSeenAt
                await prisma.room.update({
                    where: { id: messageData.roomId },
                    data: { updatedAt: new Date() }
                });
                await prisma.user.update({
                    where: { id: messageData.senderId },
                    data: { lastSeenAt: new Date() }
                });
                // Notify room members about the update
                io.to(messageData.roomId).emit("room_updated", {
                    roomId: messageData.roomId,
                    updatedAt: new Date().toISOString()
                });

            } catch (error) {
                console.error("Error broadcasting message:", error);
                socket.emit("message_error", {
                    error: "Failed to broadcast message",
                    originalData: messageData
                });
            }
        });
        // Add this with your other socket event handlers, right after the "send" handler or with the other message-related handlers:

        // Message status updates
        socket.on("message_status_update", (data: {
            messageIds: string[];
            status: "DELIVERED" | "SEEN";
            roomId: string;
        }) => {
            // console.log("Message status update received:", data);

            try {
                // Broadcast the status update to everyone in the room
                io.to(data.roomId).emit("message_status_updated", {
                    messageIds: data.messageIds,
                    status: data.status,
                    updatedAt: new Date().toISOString()
                });

                console.log(`Broadcasted status update for ${data.messageIds.length} messages in room ${data.roomId}`);
            } catch (error) {
                console.error("Error broadcasting message status update:", error);
                socket.emit("message_status_error", {
                    error: "Failed to update message status",
                    originalData: data
                });
            }
        });
        // Room handling
        socket.on("join-room", (roomId) => {
            socket.join(roomId);
            console.log(`Socket ${socket.id} joined room ${roomId}`);

            // Notify others in the room that user joined
            socket.to(roomId).emit("user_joined_room", {
                roomId,
                userId: socket.id // You might want to pass actual user ID here
            });
        });

        socket.on("leave-room", (roomId) => {
            socket.leave(roomId);
            console.log(`Socket ${socket.id} left room ${roomId}`);

            // Notify others in the room that user left
            socket.to(roomId).emit("user_left_room", {
                roomId,
                userId: socket.id // You might want to pass actual user ID here
            });
        });

        // User goes offline manually
        socket.on("user_offline", async (userId: string) => {
            try {
                const userSocketSet = userSockets.get(userId);
                if (userSocketSet) {
                    userSocketSet.delete(socket.id);

                    if (userSocketSet.size === 0) {
                        userSockets.delete(userId);

                        await prisma.user.update({
                            where: { id: userId },
                            data: {
                                isOnline: false,
                                lastSeenAt: new Date()
                            }
                        });

                        io.emit("user_status_changed", {
                            userId,
                            isOnline: false,
                            lastSeenAt: new Date()
                        });

                        console.log(`User ${userId} is now offline`);
                    }
                }
            } catch (error) {
                console.error("Error setting user offline:", error);
            }
        });

        // Typing indicators
        socket.on("typing_start", (data: { roomId: string, userId: string, userName: string }) => {
            socket.to(data.roomId).emit("user_typing", {
                userId: data.userId,
                userName: data.userName,
                roomId: data.roomId
            });
        });

        socket.on("typing_stop", (data: { roomId: string, userId: string }) => {
            socket.to(data.roomId).emit("user_stopped_typing", {
                userId: data.userId,
                roomId: data.roomId
            });
        });

        // Message reactions
        socket.on("message_reaction", (data: {
            messageId: string;
            roomId: string;
            userId: string;
            reaction: string;
        }) => {
            socket.to(data.roomId).emit("message_reacted", data);
        });

        // Handle disconnect
        socket.on("disconnect", async () => {
            console.log("User disconnected:", socket.id);

            // Find which user this socket belonged to and remove it
            for (const [userId, socketSet] of userSockets.entries()) {
                if (socketSet.has(socket.id)) {
                    socketSet.delete(socket.id);

                    // If no more sockets for this user, set offline
                    if (socketSet.size === 0) {
                        userSockets.delete(userId);

                        try {
                            await prisma.user.update({
                                where: { id: userId },
                                data: {
                                    isOnline: false,
                                    lastSeenAt: new Date()
                                }
                            });

                            io.emit("user_status_changed", {
                                userId,
                                isOnline: false,
                                lastSeenAt: new Date()
                            });

                            console.log(`User ${userId} is now offline due to disconnect`);
                        } catch (error) {
                            console.error("Error updating user status on disconnect:", error);
                        }
                    }
                    break;
                }
            }
        });
    });
}

// Utility function to get online users
export function getOnlineUsers(): string[] {
    return Array.from(userSockets.keys());
}

// Utility function to check if a user is online
export function isUserOnline(userId: string): boolean {
    return userSockets.has(userId) && (userSockets.get(userId)?.size || 0) > 0;
}