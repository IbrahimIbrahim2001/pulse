import { protectedProcedure } from "@/lib/trpc"
import z from "zod"
import prisma from "@/prisma";
import { TRPCError } from "@trpc/server";
import { randomUUID } from "crypto";

export const starMessage = () => {
    return protectedProcedure.input(
        z.object({
            messageId: z.string()
        })
    ).mutation(async opts => {
        const { id: userId } = opts.ctx.session.user;
        const { messageId } = opts.input;
        try {
            const res = await prisma.starredMessage.create({
                data: {
                    id: randomUUID(),
                    messageId,
                    userId,
                }
            })
            if (res) {
                return {
                    code: 200,
                    success: true,
                    message: "Message Starred"
                }
            } else {
                return {
                    code: 400,
                    success: false,
                    message: "Failed to star a message"
                }
            }
        } catch (error) {
            if (error instanceof TRPCError) {
                throw error;
            }
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to star a message'
            });
        }
    })
}