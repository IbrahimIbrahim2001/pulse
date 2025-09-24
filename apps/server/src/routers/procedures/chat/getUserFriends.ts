import { protectedProcedure } from "@/lib/trpc";
import prisma from "@/prisma";

export const getUserFriends = () => {
    return protectedProcedure.query(async (opts) => {
        const userId = opts.ctx.session.user.id;
        // Find all rooms where the user is a member
        const rooms = await prisma.room.findMany({
            where: {
                members: {
                    some: {
                        userId: userId
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
                }
            }
        });
        // Extract friends (other members in the rooms)
        const friends = rooms.flatMap(room =>
            room.members
                .filter(member => member.userId !== userId)
                .map(member => member.user)
        );
        return friends;
    })
}