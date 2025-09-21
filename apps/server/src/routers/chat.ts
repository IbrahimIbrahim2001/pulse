import { protectedProcedure, publicProcedure, router } from "@/lib/trpc";
import prisma from "../../prisma";
import z from "zod";
import { randomUUID } from "crypto";

export const chatRouter = router({
    getAllChats: protectedProcedure.query(async (opts) => {
        const currentUser = opts.ctx.session.user.id;
        return await prisma.room.findMany({
            where: {
                members: {
                    some: {
                        userId: currentUser
                    }
                }
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                image: true,
                            }
                        }
                    }
                },
                messages: {
                    take: 1,
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });
    }),
    getChatDetails: protectedProcedure.input(
        z.object({
            room_id: z.string()
        })
    ).query(async (opts) => { //specific recipient details
        const roomId = opts.input?.room_id;
        const chat = await prisma.room.findUnique({
            where: {
                id: roomId
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                image: true,
                            }
                        }
                    }
                },
                messages: {
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        })
        return chat

    }),
    newChat: protectedProcedure
        .input(
            z.object({
                email: z.email(),
            }),
        )
        .mutation(async (opts) => {
            const { email } = opts.input;
            const currentUser = opts.ctx.session.user;

            // Find recipient user
            const recipientUser = await prisma.user.findFirst({
                where: { email },
            });

            if (!recipientUser) {
                throw new Error("Could not find a user with this email");
            }

            // Prevent self-chat
            if (currentUser.id === recipientUser.id) {
                throw new Error("Cannot create chat with yourself");
            }

            // Generate consistent room ID using user IDs
            const roomId = [currentUser.id, recipientUser.id]
                .sort()
                .join('_');

            // Check if room already exists
            const existingRoom = await prisma.room.findUnique({
                where: { id: roomId },
                include: { members: true },
            });

            if (existingRoom) {
                throw new Error("The chat already exists");

            }

            // Create new room and members
            return await prisma.room.create({
                data: {
                    id: roomId,
                    name: `Chat between ${currentUser.name} and ${recipientUser.name}`,
                    type: "DIRECT",
                    members: {
                        create: [
                            {
                                id: randomUUID(),
                                userId: currentUser.id,
                                role: "MEMBER",
                            },
                            {
                                id: randomUUID(),
                                userId: recipientUser.id,
                                role: "MEMBER",
                            },
                        ],
                    },
                },
                include: {
                    members: {
                        include: {
                            user: true,
                        },
                    },
                },
            });
        }),
});