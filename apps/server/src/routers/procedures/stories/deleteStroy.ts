import { protectedProcedure } from "@/lib/trpc"
import z from "zod"

export const deleteStory = () => {
    return protectedProcedure.input(
        z.object({
            id: z.string()
        })
    ).mutation((opts) => {
        const { id: user_id } = opts.ctx.session.user
        const { id } = opts.input;
    })
}