import { protectedProcedure } from "@/lib/trpc";
import prisma from "@/prisma";
import z from "zod";

export const getChatDetails = () => {
    return protectedProcedure.input(
        z.object({
            room_id: z.string()
        })
    ).query(async (opts) => { //specific recipient details
        const roomId = opts.input?.room_id;
        const chat = await prisma.room.findUnique({
            where: {
                id: roomId
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
                    orderBy: {
                        createdAt: 'desc'
                    }
                },
            }
        })
        return chat

    })
}