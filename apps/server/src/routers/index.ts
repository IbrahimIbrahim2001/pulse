import { protectedProcedure, publicProcedure, router } from "../lib/trpc";
import { messagesRouter } from "./procedures/messages/messages";
import { chatRouter } from "./procedures/chat";
import { imagesRouter } from "./procedures/images/imagesRouter";
import { storiesRouter } from "./procedures/stories/stories";

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
	images: imagesRouter,
	stories: storiesRouter

});
export type AppRouter = typeof appRouter;
