import { protectedProcedure } from "@/lib/trpc"
import prisma from "@/prisma"
import z from "zod"

export const getUserData = () => {
    return protectedProcedure.input(
        z.object({
            userId: z.string()
        })
    ).query(async opts => {
        const id = opts.input.userId
        return await prisma.user.findFirst({
            where: {
                id
            }
        })
    })
}