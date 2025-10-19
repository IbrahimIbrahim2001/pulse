import { protectedProcedure } from "@/lib/trpc";
import prisma from "@/prisma";
import z from "zod";

export const getStory = () => {
    return protectedProcedure.input(
        z.object({
            reel_id: z.string()
        })
    ).query(async opts => {
        const { reel_id } = opts.input;
        const { id: userId } = opts.ctx.session.user;

        const story = await prisma.story.findUnique({
            where: { id: reel_id },
            select: {
                userId: true,
            }
        });

        if (!story) {
            throw new Error("Story not found");
        }

        const directRoom = await prisma.room.findFirst({
            where: {
                type: "DIRECT",
                AND: [
                    {
                        members: {
                            some: { userId: userId }
                        }
                    },
                    {
                        members: {
                            some: { userId: story.userId }
                        }
                    }
                ]
            }
        });

        if (!directRoom) {
            throw new Error("You don't have access to view this story");
        }
        const fullStory = await prisma.story.findUnique({
            where: { id: reel_id },
            select: {
                id: true,
                title: true,
                fileUrl: true,
                createdAt: true,
                user: true
            }
        });

        return fullStory;
    })
}