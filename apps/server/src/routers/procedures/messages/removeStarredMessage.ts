import { protectedProcedure } from "@/lib/trpc"
import z from "zod";
import prisma from "@/prisma";
export const removeStarredMessage = () => {
    return protectedProcedure.input(
        z.object({
            messageId: z.string()
        })
    ).mutation(async opts => {
        const { id: userId } = opts.ctx.session.user;
        const { messageId } = opts.input;
        await prisma.starredMessage.deleteMany({
            where: {
                userId,
                messageId
            }
        })
    })
}