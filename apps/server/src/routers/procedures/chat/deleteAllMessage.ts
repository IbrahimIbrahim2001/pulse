import { protectedProcedure } from "@/lib/trpc";
import prisma from "@/prisma";
import z from "zod";
export const deleteAllMessages = () => {
    return protectedProcedure.input(
        z.object({
            id: z.string()
        })
    ).mutation(async (opts) => {
        const { id } = opts.input;
        return await prisma.message.deleteMany({
            where: {
                roomId: id
            }
        })
    })
}