import "dotenv/config";
import { trpcServer } from "@hono/trpc-server";
import { createContext } from "./lib/context";
import { appRouter } from "./routers/index";
import { auth } from "./lib/auth";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { engine, io, websocket } from "./lib/socket";
import prisma from "@/prisma";
import { setupSocketHandlers } from "./lib/socket-handlers";

const app = new Hono();


setupSocketHandlers(io)

app.use(logger());
app.use(
	"/*",
	cors({
		origin: process.env.CORS_ORIGIN || "",
		allowMethods: ["GET", "POST", "OPTIONS"],
		allowHeaders: ["Content-Type", "Authorization"],
		credentials: true,
	}),
);

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

app.use(
	"/trpc/*",
	trpcServer({
		router: appRouter,
		createContext: (_opts, context) => {
			return createContext({ context });
		},
	}),
);

app.get("/", (c) => {
	return c.text("OK");
});

export default {
	port: 3000,
	idleTimeout: 30,
	fetch(req: Request, server: any) {
		const url = new URL(req.url);
		if (url.pathname === "/socket.io/") {
			return engine.handleRequest(req, server);
		} else {
			return app.fetch(req, server);
		}
	},
	websocket
}