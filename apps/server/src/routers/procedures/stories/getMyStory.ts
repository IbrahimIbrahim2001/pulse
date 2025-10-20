import { protectedProcedure } from "@/lib/trpc"
import prisma from "@/prisma";

export const getMyStory = () => {
    return protectedProcedure.query(async opts => {
        const { id: userId } = opts.ctx.session.user;
        return await prisma.story.findMany({
            where: {
                userId
            },
            include: {
                user: true,
                views: {
                    select: {
                        user: true
                    }
                }
            }
        })
    })
}