import { protectedProcedure } from "@/lib/trpc";
import prisma from "@/prisma";

export const deleteUserRooms = () => {
    return protectedProcedure.mutation(async opts => {
        const { id: userId } = opts.ctx.session.user;
        const userRooms = await prisma.roomMember.findMany({
            where: { userId },
            include: { room: true }
        });
        for (const userRoom of userRooms) {
            if (userRoom.room.type === 'DIRECT') {
                await prisma.room.delete({ where: { id: userRoom.roomId } });
            } else {
                const remainingMembers = await prisma.roomMember.count({
                    where: { roomId: userRoom.roomId }
                });

                if (remainingMembers === 1) {
                    await prisma.room.delete({ where: { id: userRoom.roomId } });
                }
            }
        }
    })
}