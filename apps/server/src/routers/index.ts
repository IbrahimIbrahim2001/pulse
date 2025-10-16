import { protectedProcedure, publicProcedure, router } from "../lib/trpc";
import { messagesRouter } from "./procedures/messages/messages";
import { chatRouter } from "./procedures/chat";
import { imagesRouter } from "./procedures/images/imagesRouter";

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
	messages: messagesRouter,
	images: imagesRouter

});
export type AppRouter = typeof appRouter;
