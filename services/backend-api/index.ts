import { Scalar } from "@scalar/hono-api-reference";
import { serve } from "bun";
import type { PrismaClient } from "./generated/prisma/client.js";
import { cors } from "hono/cors";
import {
	describeResponse,
	describeRoute,
	openAPIRouteHandler,
} from "hono-openapi";
import { prettyJSON } from "hono/pretty-json";
import { Hono } from "hono";
import { logger } from "hono/logger";
import authRouter from "./routes/auth";
import vehiclesRouter from "./routes/vehicles";
import fleetRouter from "./routes/fleets.js";
import tripsRouter from "./routes/trips.js";

type ContextWithPrisma = {
	Variables: {
		prisma: PrismaClient;
	};
};

const app = new Hono<ContextWithPrisma>();
app.use(prettyJSON());
app.use("*", cors());

app.get(
	"/openapi",
	openAPIRouteHandler(app, {
		documentation: {
			info: {
				title: "Zylectra Fleet Dashboard API",
				version: "1.0.0",
				description: "Zylectra Fleet Dashboard API Documentation",
			},
			servers: [{ url: "http://localhost:3000", description: "Local Server" }],
		},
	}),
);
app.get(
	"/scalar",
	Scalar({ url: "/openapi", theme: "fastify", defaultOpenAllTags: true }),
);
app.use(logger());

app.route("/auth", authRouter);
app.route("/vehicles", vehiclesRouter);
app.route("/fleets", fleetRouter);
app.route("/trips", tripsRouter);

serve({
	fetch: app.fetch,
	port: 3000,
	hostname: "0.0.0.0",
});
console.log("Server is running on http://localhost:3000");
