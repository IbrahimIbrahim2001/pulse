import { protectedProcedure } from "@/lib/trpc";
import prisma from "@/prisma";
import { TRPCError } from "@trpc/server";
import z from "zod";
export const removeGroupMember = () => {
    return protectedProcedure.input(
        z.object({
            email: z.string(),
            group_name: z.string().min(2).max(100),
        })
    ).mutation(async (opts) => {
        const { email, group_name } = opts.input;
        try {
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
            // Find the user by email
            const user = await prisma.user.findUnique({
                where: { email }
            });
            if (!user) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'User not found'
                });
            }
            const res = await prisma.roomMember.delete({
                where: {
                    userId_roomId: {
                        userId: user.id,
                        roomId: room.id
                    }
                }
            });
        } catch (error) {
            if (error instanceof TRPCError) {
                throw error;
            }
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to remove user from group'
            });
        }
    });
}