import { protectedProcedure } from "@/lib/trpc"
import prisma from "@/prisma";

export const getStories = () => {
    return protectedProcedure.query(async opts => {
        const { id: userId } = opts.ctx.session.user;
        const rooms = await prisma.room.findMany({
            where: {
                type: "DIRECT",
                members: {
                    some: {
                        userId
                    }
                }
            },
            select: {
                members: {
                    where: {
                        userId: { not: userId }
                    },
                    select: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                            }
                        }
                    }
                }
            }
        })
        const friendsIds = rooms.flatMap(room => room.members.flatMap(member => member.user.id));
        const friendStories = await prisma.story.findMany({
            where: {
                userId: { in: friendsIds }
            },
            select: {
                id: true,
                title: true,
                fileUrl: true,
                createdAt: true,
                user: true
            }
        })
        return friendStories;
    })
}