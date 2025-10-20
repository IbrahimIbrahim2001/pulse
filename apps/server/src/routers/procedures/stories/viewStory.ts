"use client";
import { protectedProcedure } from "@/lib/trpc";
import prisma from "@/prisma";
import { randomUUID } from "crypto";
import z from "zod";

export const viewStory = () => {
    return protectedProcedure.input(
        z.object({
            storyId: z.string(),
        })
    ).mutation(async opts => {
        const { storyId } = opts.input;
        const { id: userId } = opts.ctx.session.user;
        try {
            await prisma.storyView.create({
                data: {
                    id: randomUUID(),
                    storyId,
                    userId,
                }
            })
        } catch (error) {
            console.log(error)
        }

    })
}