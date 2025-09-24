import { protectedProcedure, publicProcedure, router } from "../lib/trpc";
import { messagesRouter } from "./messages";
import { chatRouter } from "./procedures/chat";

export const appRouter = router({
	healthCheck: publicProcedure.query(() => {
		return "OK";
	}),
	privateData: protectedProcedure.query(({ ctx }) => {
		return {
			message: "This is private",
			user: ctx.session.user,
		};
	}),
	chat: chatRouter,
	messages: messagesRouter

});
export type AppRouter = typeof appRouter;
