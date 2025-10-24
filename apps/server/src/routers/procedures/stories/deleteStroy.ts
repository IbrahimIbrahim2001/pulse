import { protectedProcedure } from "@/lib/trpc"
import prisma from "@/prisma";
import z from "zod"

export const deleteStory = () => {
    return protectedProcedure.input(
        z.object({
            id: z.string()
        })
    ).mutation(async (opts) => {
        const { id } = opts.input;
        await prisma.story.deleteMany({
            where: {
                id
            }
        })
    })
}