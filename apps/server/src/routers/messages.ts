import { protectedProcedure, router } from "@/lib/trpc";
import { randomUUID } from "crypto";
import z from "zod";
import prisma from "../../prisma";
export const messagesRouter = router({
    saveMessage: protectedProcedure.input(
        z.object({
            roomId: z.string(),
            content: z.string(),
            senderId: z.string(),
        })
    ).mutation(async (opts) => {
        const { roomId, content, senderId } = opts.input;
        return await prisma.message.create({
            data: {
                id: randomUUID(),
                content,
                senderId,
                roomId
            },
        })
    })
})