import { protectedProcedure } from "@/lib/trpc";
import z from "zod";

export const addGroupMember = () => {
    return protectedProcedure.input(
        z.object({
            email: z.email(),
            group_name: z.string().min(2).max(100),
        })
    ).mutation(async (opts) => {
        // addGroupMembers
        //check admin
        console.log(opts.input);
    })
}