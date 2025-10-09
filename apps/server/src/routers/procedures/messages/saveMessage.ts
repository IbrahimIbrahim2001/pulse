import { protectedProcedure } from "@/lib/trpc";
import prisma from "@/prisma";
import { randomUUID } from "crypto";
import { MessageType } from "prisma/generated/enums";
import z from "zod";
export const saveMessage = () => {
    return protectedProcedure.input(
        z.object({
            roomId: z.string(),
            content: z.string(),
            senderId: z.string(),
            type: z.enum(MessageType)
        })
    ).mutation(async (opts) => {
        const { roomId, content, senderId, type } = opts.input;
        return await prisma.message.create({
            data: {
                id: randomUUID(),
                content,
                senderId,
                roomId,
                type
            },
        })
    })
}
