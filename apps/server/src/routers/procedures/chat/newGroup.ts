import { protectedProcedure } from "@/lib/trpc";
import prisma from "@/prisma";
import { randomUUID } from "crypto";
import z from "zod";
export const newGroup = () => {
    return protectedProcedure.input(
        z.object({
            name: z.string(),
            members: z.string().array().min(1)
        })).mutation(async (opts) => {
            const { name, members } = opts.input;
            const groupAdmin = opts.ctx.session.user;
            const groupMembers = members.map(member_id => {
                return {
                    id: randomUUID(),
                    userId: member_id,
                    role: "MEMBER" as any
                }
            })
            return await prisma.room.create({
                data: {
                    id: randomUUID(),
                    name,
                    type: "GROUP",
                    members: {
                        create: [
                            {
                                id: randomUUID(),
                                userId: groupAdmin.id,
                                role: "ADMIN",
                            },
                            ...groupMembers
                        ],
                    },
                },
                include: {
                    members: {
                        include: {
                            user: true,
                        },
                    },
                },
            })
        })
}