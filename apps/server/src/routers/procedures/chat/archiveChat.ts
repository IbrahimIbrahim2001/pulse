import { protectedProcedure } from "@/lib/trpc"
import prisma from "@/prisma";
import { TRPCError } from "@trpc/server";
import z from "zod";
import { randomUUID } from "crypto";

export const archiveChat = () => {
    return protectedProcedure.input(
        z.object({
            roomId: z.string(),
        })
    ).mutation(async opts => {
        const { roomId } = opts.input;
        const { id: userId } = opts.ctx.session.user;
        try {
            const isRoomMember = await prisma.roomMember.findFirst({
                where: {
                    roomId: roomId,
                    userId
                }
            })
            if (!isRoomMember) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You are not a room member to this specif chat"
                })
            }
            const res = await prisma.archivedChats.create({
                data: {
                    id: randomUUID(),
                    userId,
                    roomId
                }
            })
            if (res) {
                return {
                    success: true,
                    message: "Chat archived successfully"
                }
            }
        } catch {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "failed to archive chat"
            })
        }
    })
}