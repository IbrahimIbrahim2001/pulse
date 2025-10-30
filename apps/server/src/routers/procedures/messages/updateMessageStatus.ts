import { protectedProcedure } from "@/lib/trpc";
import prisma from "@/prisma";
import type { MessageStatusType } from "prisma/generated/enums";
import z from "zod";

export const updateMessageStatus = () => {
    return protectedProcedure.input(
        z.object({
            message_ids: z.array(z.string()),
            status: z.enum(["DELIVERED", "SEEN"])
        })
    ).mutation(async (opts) => {
        const user_id = opts.ctx.session.user.id;
        const { message_ids, status } = opts.input;

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

        const accessibleMessageIds = accessibleMessages.map((msg: { id: any; }) => msg.id);

        if (accessibleMessageIds.length === 0) {
            return { updatedCount: 0, updatedMessageIds: [] };
        }

        // Determine which statuses to update from
        const statusConditions: MessageStatusType[] = status === "DELIVERED"
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
}