import { protectedProcedure } from "@/lib/trpc"
import prisma from "@/prisma";
import { TRPCError } from "@trpc/server";
import z from "zod"

export const deleteGroup = () => {
    return protectedProcedure.input(
        z.object({
            room_id: z.string()
        })
    ).mutation(async opts => {
        const { room_id } = opts.input;
        const user_id = opts.ctx.session.user.id;
        try {
            const room = await prisma.room.findFirst({
                where: {
                    id: room_id,
                    type: "GROUP",
                    members: {
                        some: {
                            userId: user_id,
                            role: "ADMIN"
                        }
                    }
                },
                include: {
                    members: true
                }
            });
            if (!room) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Group not found or you do not have admin permissions'
                });
            }
            await prisma.room.delete({
                where: {
                    id: room_id
                }
            });
            return {
                success: true,
                message: "Group deleted successfully"
            };
        } catch (error) {
            if (error instanceof TRPCError) {
                throw error;
            }
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to delete group'
            });
        }
    });
}