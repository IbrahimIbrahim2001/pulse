import { protectedProcedure } from "@/lib/trpc";
import z from "zod";

export const addGroupMember = () => {
    return protectedProcedure.input(
        z.object({
            // email: z. []
            // group_name
        })
    ).mutation(async (opts) => {
        // addGroupMembers
        //check admin
        console.log(opts.input);
    })
}