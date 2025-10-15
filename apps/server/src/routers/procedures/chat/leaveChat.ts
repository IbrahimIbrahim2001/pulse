import { protectedProcedure } from "@/lib/trpc"
import prisma from "@/prisma";
import { TRPCError } from "@trpc/server";
import z from "zod"

export const leaveChat = () => {
    return protectedProcedure.input(
        z.object({
            user_id: z.string(),
            room_id: z.string()
        })
    ).mutation(async opts => {
        const { user_id, room_id } = opts.input;
        const room = await prisma.room.findFirst({
            where: {
                id: room_id,
                members: {
                    some: {
                        userId: user_id
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
                message: 'Room not found or you are not a member'
            });
        }
        if (room.type === "DIRECT") {
            await prisma.room.delete({
                where: {
                    id: room_id
                }
            });
            return { success: true, message: "Chat deleted successfully" };
        } else {
            await prisma.roomMember.deleteMany({
                where: {
                    roomId: room_id,
                    userId: user_id
                }
            });
            return { success: true, message: "Left group successfully" };
        }
    });
}