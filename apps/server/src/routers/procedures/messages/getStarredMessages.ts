import { protectedProcedure } from "@/lib/trpc"
import prisma from "@/prisma";

export const getStarredMessage = () => {
    return protectedProcedure.query(async opts => {
        const { id: userId } = opts.ctx.session.user;
        return await prisma.starredMessage.findMany({
            where: {
                userId
            },
            include: {
                message: true,
                user: true
            }
        })
    })
}