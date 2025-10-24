import { protectedProcedure } from "@/lib/trpc";
import prisma from "@/prisma";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { randomUUID } from "crypto";

export const messageReaction = () => {
    return protectedProcedure
        .input(
            z.object({
                messageId: z.string(),
                reaction: z.string().min(1).max(10), // Add validation
            })
        )
        .mutation(async (opts) => {
            const { messageId, reaction } = opts.input;
            const { id: userId } = opts.ctx.session.user;

            try {
                // Single query to get message and check membership
                const messageWithRoom = await prisma.message.findUnique({
                    where: { id: messageId },
                    include: {
                        room: {
                            include: {
                                members: {
                                    where: { userId: userId },
                                    take: 1
                                }
                            }
                        }
                    }
                });

                if (!messageWithRoom) {
                    throw new TRPCError({
                        code: "NOT_FOUND",
                        message: 'Message not found'
                    });
                }

                if (messageWithRoom.room.members.length === 0) {
                    throw new TRPCError({
                        code: "FORBIDDEN",
                        message: 'User is not a member of this room'
                    });
                }

                const roomMember = messageWithRoom.room.members[0];

                const result = await prisma.reaction.upsert({
                    where: {
                        roomMemberId_messageId: {
                            roomMemberId: roomMember.id,
                            messageId: messageId
                        }
                    },
                    update: {
                        reaction: reaction
                    },
                    create: {
                        id: randomUUID(),
                        roomMemberId: roomMember.id,
                        messageId: messageId,
                        reaction: reaction
                    }
                });

                return {
                    action: result.createdAt.getTime() === result.updatedAt.getTime() ? 'added' : 'updated',
                    reaction
                };

            } catch (error) {
                if (error instanceof TRPCError) {
                    throw error;
                }
                console.error('Reaction error:', error);
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'Failed to add reaction to message'
                });
            }
        });
}