import { Hono } from "hono";
import {
	describeResponse,
	describeRoute,
	resolver,
	validator,
} from "hono-openapi";
import withPrisma from "../lib/prisma";
import { authMiddleware } from "../middlewars/authMiddleware";

const fleetRouter = new Hono();
fleetRouter.use("*", withPrisma);
fleetRouter.use("*", authMiddleware);

fleetRouter.get(
	"/",
	withPrisma,
	describeRoute({
		tags: ["Fleets"],
		summary: "Get Fleets",
		description: "Retrieve a list of all fleets",
	}),
	async (c) => {
		const prisma = c.get("prisma");
		const fleets = await prisma.fleet.findMany({});
		return c.json(fleets);
	},
);

fleetRouter.get(
	"/drivers",
	withPrisma,
	authMiddleware,
	describeRoute({
		summary: "Get Drivers in User's Fleet",
		tags: ["Fleets"],
		description: "Retrieve a list of drivers associated with the user's fleet",
	}),
	async (c) => {
		const prisma = c.get("prisma");
		const user = c.get("user");
		const adminEmail = user.email;
		const userFleetId = await prisma.user.findUnique({
			where: { email: adminEmail },
		});
		const drivers = await prisma.driver.findMany({
			where: { fleetId: userFleetId?.fleetId },
		});
		return c.json({ drivers });
	},
);

fleetRouter.get(
	"/drivers/available",
	withPrisma,
	authMiddleware,
	describeRoute({
		summary: "Get Available Drivers",
		tags: ["Fleets"],
		description:
			"Retrieve a list of available drivers associated with the user's fleet",
	}),
	async (c) => {
		const prisma = c.get("prisma");
		const user = c.get("user");
		const adminEmail = user.email;
		const userFleetId = await prisma.user.findUnique({
			where: { email: adminEmail },
		});
		const availableDrivers = await prisma.driver.findMany({
			where: {
				fleetId: userFleetId?.fleetId,
				status: "AVAILABLE",
			},
		});
		return c.json({ availableDrivers });
	},
);

fleetRouter.post(
	"/",
	withPrisma,
	authMiddleware,
	describeRoute({
		summary: "Create Fleet",
		tags: ["Fleets"],
		description: "Create a new fleet",
		requestBody: {
			required: true,
			content: {
				"application/json": {
					schema: {
						properties: {
							name: { type: "string" },
						},
						required: ["name"],
					},
				},
			},
		},
		responses: {
			201: {
				description: "Fleet created successfully",
			},
		},
	}),
	async (c) => {
		const prisma = c.get("prisma");
		const user = c.get("user");
		const body = await c.req.json();
		if (!body.name) {
			return c.json({ message: "Name is required" }, 400);
		}
		const newFleet = await prisma.fleet.create({
			data: {
				name: body.name,
			},
		});
		return c.json({ newFleet, user }, 201);
	},
);

fleetRouter.patch(
	"/:id",
	withPrisma,
	describeRoute({
		summary: "Update Fleet",
		description: "Update an existing fleet using its ID",
		tags: ["Fleets"],
	}),
	async (c) => {
		const prisma = c.get("prisma");
		const { id } = c.req.param();
		const body = await c.req.json();
		const updatedFleet = await prisma.fleet.update({
			where: { id: Number(id) },
			data: {
				name: body.name,
			},
		});
		return c.json(updatedFleet);
	},
);
export default fleetRouter;
