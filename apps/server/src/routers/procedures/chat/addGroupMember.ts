import { protectedProcedure } from "@/lib/trpc";
import prisma from "@/prisma";
import { TRPCError } from "@trpc/server";
import { randomUUID } from "crypto";
import z from "zod";

export const addGroupMember = () => {
    return protectedProcedure.input(
        z.object({
            email: z.string().email(), // Fixed: z.email() should be z.string().email()
            group_name: z.string().min(2).max(100),
        })
    ).mutation(async (opts) => {
        const { email, group_name } = opts.input;

        try {
            const user = await prisma.user.findUnique({
                where: { email },
                select: { id: true }
            });

            if (!user) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'User not found with this email address'
                });
            }

            const room = await prisma.room.findFirst({
                where: { name: group_name },
                select: { id: true }
            });

            if (!room) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Group not found'
                });
            }

            // Check if user is already a member
            const existingMember = await prisma.roomMember.findFirst({
                where: {
                    userId: user.id,
                    roomId: room.id
                }
            });

            if (existingMember) {
                throw new TRPCError({
                    code: 'CONFLICT',
                    message: 'User is already a member of this group'
                });
            }

            const newMember = await prisma.roomMember.create({
                data: {
                    id: randomUUID(),
                    userId: user.id,
                    roomId: room.id
                },
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true
                        }
                    }
                }
            });

            return {
                success: true,
                message: 'User added to group successfully',
                data: newMember
            };

        } catch (error) {
            if (error instanceof TRPCError) {
                throw error;
            }
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to add user to group'
            });
        }
    });
}