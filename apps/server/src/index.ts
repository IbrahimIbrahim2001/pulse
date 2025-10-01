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

// io.on("connection", (socket) => {
// 	console.log("User connected:", socket.id);

// 	// Listen for messages from client
// 	socket.on("send", async (messageData) => {
// 		console.log("Message received:", messageData);

// 		// Create a proper message object
// 		const message = {
// 			id: Date.now().toString(),
// 			content: messageData.content,
// 			senderId: messageData.senderId,
// 			roomId: messageData.roomId,
// 			createdAt: new Date().toISOString(),
// 			updatedAt: new Date().toISOString(),
// 			type: "Text"
// 		};



// 		// Send only to the specific room
// 		io.to(messageData.roomId).emit("message", message);


// 		await prisma.room.update({
// 			where: { id: messageData.roomId },
// 			data: { updatedAt: new Date() }
// 		});

// 		await prisma.user.update({
// 			where: { id: messageData.senderId },
// 			data: { lastSeenAt: new Date() }
// 		});
// 	});

// 	socket.on("join-room", (roomId) => {
// 		socket.join(roomId);
// 		console.log(`Socket ${socket.id} joined room ${roomId}`);
// 	});

// 	socket.on("leave-room", (roomId) => {
// 		socket.leave(roomId);
// 		console.log(`Socket ${socket.id} left room ${roomId}`);
// 	});

// 	socket.on("disconnect", () => {
// 		console.log("User disconnected:", socket.id);
// 	});
// });

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