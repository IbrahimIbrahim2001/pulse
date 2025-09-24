import { protectedProcedure } from "@/lib/trpc";
import prisma from "@/prisma";
import z from "zod";
import { randomUUID } from "crypto";

export const newChat = () => {
    return protectedProcedure
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
        })
}