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
    }),
    // routers/messages.ts
    updateMessageStatus: protectedProcedure.input(
        z.object({
            message_ids: z.array(z.string()),
            status: z.enum(["DELIVERED", "SEEN"])
        })
    ).mutation(async (opts) => {
        const user_id = opts.ctx.session.user.id;
        const { message_ids, status } = opts.input;

        // Verify user has access to these messages
        const accessibleMessages = await prisma.message.findMany({
            where: {
                id: { in: message_ids },
                room: {
                    members: {
                        some: { userId: user_id }
                    }
                }
            },
            select: { id: true, senderId: true }
        });

        const accessibleMessageIds = accessibleMessages.map(msg => msg.id);

        if (accessibleMessageIds.length === 0) {
            return { updatedCount: 0, updatedMessageIds: [] };
        }

        // Determine which statuses to update from
        const statusConditions = status === "DELIVERED"
            ? ["SENT"]
            : ["SENT", "DELIVERED"];

        // Update messages
        const result = await prisma.message.updateMany({
            where: {
                id: { in: accessibleMessageIds },
                status: { in: statusConditions }
            },
            data: { status }
        });

        return {
            updatedCount: result.count,
            updatedMessageIds: accessibleMessageIds
        };
    })
})