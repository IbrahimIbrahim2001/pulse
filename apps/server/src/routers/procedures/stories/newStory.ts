import { protectedProcedure } from "@/lib/trpc";
import prisma from "@/prisma";
import z from "zod";
import { randomUUID } from "crypto";
import { TRPCError } from "@trpc/server";

export const newStory = () => {
    return protectedProcedure.input(
        z.object({
            title: z.string().optional(),
            fileUrl: z.string(),
            fileName: z.string(),
            fileSize: z.number()
        })
    ).mutation(async (opts) => {
        const { title, fileUrl, fileName, fileSize } = opts.input;
        const { id: userId } = opts.ctx.session.user;
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
        try {
            await prisma.story.create({
                data: {
                    id: randomUUID(),
                    userId,
                    title,
                    fileUrl,
                    fileName,
                    fileSize,
                    expiresAt
                }
            })
        } catch (error) {
            return new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
                message: "INTERNAL_SERVER_ERROR",
            })
        }
    })
}