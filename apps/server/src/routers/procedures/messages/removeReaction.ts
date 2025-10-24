import { protectedProcedure } from "@/lib/trpc"
import prisma from "@/prisma";
import { TRPCError } from "@trpc/server";
import z from "zod"

export const removeReaction = () => {
    return protectedProcedure.input(
        z.object({
            reactionId: z.string()
        })
    ).mutation(async opts => {
        const { reactionId } = opts.input;
        try {
            await prisma.reaction.deleteMany({
                where: {
                    id: reactionId,
                }
            })
        } catch {
            return new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "Error removing reaction"
            })
        }
    })
}