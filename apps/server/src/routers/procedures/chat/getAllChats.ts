import { protectedProcedure } from "@/lib/trpc";
import prisma from "@/prisma";

export const getAllChats = () => {
    return protectedProcedure.query(async (opts) => {
        const currentUser = opts.ctx.session.user.id;
        return await prisma.room.findMany({
            where: {
                members: {
                    some: {
                        userId: currentUser
                    }
                }
            },
            include: {
                members: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                image: true,
                            }
                        }
                    }
                },
                messages: {
                    take: 1,
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            }
        });
    })
}