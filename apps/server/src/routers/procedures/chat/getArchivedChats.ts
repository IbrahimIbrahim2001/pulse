import { protectedProcedure } from "@/lib/trpc"
import prisma from "@/prisma";
import { TRPCError } from "@trpc/server";

export const getArchivedChats = () => {
    return protectedProcedure.query(async opts => {
        const { id: userId } = opts.ctx.session.user;
        try {
            return await prisma.archivedChats.findMany({
                where: { userId },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            image: true,
                            isOnline: true,
                            lastSeenAt: true
                        }
                    },
                    room: {
                        include: {
                            // All room fields are included by default
                            members: {
                                include: {
                                    user: {
                                        select: {
                                            id: true,
                                            name: true,
                                            image: true,
                                            isOnline: true,
                                            lastSeenAt: true,
                                        },
                                    }
                                }
                            },
                            messages: {
                                orderBy: { createdAt: 'desc' },
                                take: 10,
                                include: {
                                    sender: {
                                        select: {
                                            id: true,
                                            name: true,
                                            image: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        } catch (error) {
            console.error("Failed to fetch archived chats:", error);
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Failed to retrieve archived chats"
            });
        }
    });
};