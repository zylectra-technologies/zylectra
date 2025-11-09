import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import withPrisma from "../lib/prisma";
import { authMiddleware } from "../middlewars/authMiddleware";

const tripsRouter = new Hono();

tripsRouter.get(
	"/",
	withPrisma,
	describeRoute({
		summary: "Get Trips",
		tags: ["Trips"],
		description: "Retrieve a list of trips",
		responses: {
			200: {
				description: "A list of trips",
			},
		},
	}),
	async (c) => {
		const prisma = c.get("prisma");
		const trips = await prisma.trip.findMany({
			include: {
				driver: true,
			},
		});
		return c.json({ trips });
	},
);

// TODO: Add auth
tripsRouter.get(
	"/:id",
	withPrisma,
	describeRoute({
		summary: "Get Trip by ID",
		tags: ["Trips"],
	}),
	async (c) => {
		const prisma = c.get("prisma");
		const { id } = c.req.param();

		const trip = await prisma.trip.findUnique({
			where: { id: Number(id) },
			include: {
				driver: true,
				vehicle: true,
				route: true,
			},
		});

		if (!trip) {
			return c.json({ message: "Trip not found" }, 404);
		}
		return c.json(trip, 200);
	},
);

tripsRouter.get(
	"/driver",
	withPrisma,
	authMiddleware,
	describeRoute({
		summary: "Get Driver's Trips",
		tags: ["Trips"],
		description: "Retrieve driver information",
		responses: {
			200: {
				description: "Driver information retrieved successfully",
			},
		},
	}),
	async (c) => {
		const prisma = c.get("prisma");
		const user = c.get("user");

		const username = user.username;
		const trips = await prisma.trip.findMany({
			where: { driver: { username } },
			include: {
				route: true,
			},
		});
		return c.json({ trips });
	},
);

tripsRouter.post(
	"/",
	withPrisma,
	describeRoute({
		summary: "Create Trip",
		tags: ["Trips"],
		description: "Create a new trip",
		responses: {
			200: {
				description: "Trip created successfully",
			},
		},
	}),
	async (c) => {
		const prisma = c.get("prisma");
		const body = await c.req.json();

		if (
			!body.vehicleId ||
			!body.driverId ||
			!body.startLocation ||
			!body.endLocation
		) {
			return c.json({ message: "Missing required fields" }, 400);
		}
		const newTrip = await prisma.trip.create({
			data: {
				vehicleId: body.vehicleId,
				driverId: body.driverId,
				startLocation: body.startLocation,
				endLocation: body.endLocation,
				distance: body.distance,
				duration: body.duration,
				status: body.status,
				startTime: body.startTime ? new Date(body.startTime) : null,
			},
		});

		return c.json(newTrip, 200);
	},
);

// tripsRouter.patch(
// 	"/:id",
// 	withPrisma,
// 	describeRoute({
// 		summary: "Update Trip",
// 		tags: ["Trips"],
// 		description: "Update an existing trip",
// 		responses: {
// 			200: {
// 				description: "Trip updated successfully",
// 			},
// 			404: {
// 				description: "Trip not found",
// 			},
// 		},
// 	}),
// 	async (c) => {
// 		const prisma = c.get("prisma");
// 		const { id } = c.req.param();
//
// 		const body = await c.req.json();
// 		const updatedTrip = await prisma.trip.update({
// 			where: { id: Number(id) },
// 			data: {
// 				vehicleId: body.vehicleId,
// 				driverId: body.driverId,
// 				startLocation: body.startLocation,
// 				endLocation: body.endLocation,
// 				distance: body.distance,
// 				duration: body.duration,
// 				status: body.status,
// 				startTime: body.startTime ? new Date(body.startTime) : null,
// 			},
// 		});
//
// 		if (!updatedTrip) {
// 			return c.json({ message: "Trip not found" }, 404);
// 		}
//
// 		return c.json(updatedTrip, 200);
// 	},
// );

// tripsRouter.delete( "/:id",
// 	withPrisma,
// 	describeRoute({
// 		summary: "Delete Trip by ID",
// 		tags: ["Trips"],
// 		description: "Delete a trip by its ID",
// 	}),
// 	async (c) => {
// 		const prisma = c.get("prisma");
// 		const { id } = c.req.param();
// 		const trip = prisma.trip.findUnique({
// 			where: { id: Number(id) },
// 		});
// 		if (!trip) {
// 			return c.json({ message: "Trip not found" }, 404);
// 		}
// 		await prisma.trip.delete({
// 			where: { id: Number(id) },
// 		});
//
// 		return c.json({ message: "Trip deleted successfully" });
// 	},
// );

tripsRouter.get(
	"/last-7-days/:driverId",
	withPrisma,
	describeRoute({
		summary: "Get Drivers' last 7 days",
		tags: ["Trips"],
		description: "Retrieve trips for a specific driver in the last 7 days",
		responses: {
			200: {
				description: "A list of trips for the driver in the last 7 days",
			},
		},
	}),
	async (c) => {
		const prisma = c.get("prisma");
		const { driverId } = c.req.param();

		const sevenDaysAgo = new Date();
		sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

		const trips = await prisma.trip.findMany({
			where: {
				driverId: Number(driverId),
				startTime: {
					gte: sevenDaysAgo,
				},
			},
		});

		return c.json({ trips });
	},
);

tripsRouter.post(
	"/assign",
	authMiddleware,
	withPrisma,
	describeRoute({
		summary: "Assign Trip to Driver",
		description:
			"Assigns a trip to a driver and vehicle within the admin’s fleet. If no routeId is provided, a new Route is automatically created using the provided start and end locations.",
		tags: ["Trips"],
		requestBody: {
			required: true,
			content: {
				"application/json": {
					schema: {
						type: "object",
						properties: {
							driverId: { type: "integer" },
							vehicleId: { type: "integer" },
							startLocation: { type: "string" },
							endLocation: { type: "string" },
							distance: { type: "number" },
							duration: { type: "number" },
							stops: {
								type: "array",
								items: { type: "string" },
								description: "Optional list of stop names/addresses",
							},
							routeId: {
								type: "integer",
								nullable: true,
								description:
									"Optional existing route ID. If not provided, a new route will be created.",
							},
						},
						required: [
							"driverId",
							"vehicleId",
							"startLocation",
							"endLocation",
							"distance",
							"duration",
						],
					},
				},
			},
		},
		responses: {
			201: {
				description: "Trip successfully created and assigned",
				content: {
					"application/json": {
						schema: {
							properties: {
								message: { type: "string" },
								trip: { type: "object" },
							},
						},
					},
				},
			},
		},
	}),
	async (c) => {
		const {
			driverId,
			vehicleId,
			startLocation,
			endLocation,
			distance,
			duration,
			stops = [],
			routeId,
		} = await c.req.json();

		const prisma = c.get("prisma");
		const user = c.get("user");

		if (user.role !== "ADMIN") {
			return c.json({ message: "Only fleet admins can assign trips" }, 403);
		}

		const driver = await prisma.driver.findUnique({
			where: { id: driverId },
		});
		const vehicle = await prisma.vehicle.findUnique({
			where: { id: vehicleId },
		});

		if (!driver || !vehicle) {
			return c.json({ message: "Driver or vehicle not found" }, 400);
		}

		const adminFleet = await prisma.fleetAdmin.findUnique({
			where: { userId: user.sub },
		});

		if (
			!adminFleet ||
			adminFleet.fleetId !== driver.fleetId ||
			adminFleet.fleetId !== vehicle.fleetId
		) {
			return c.json(
				{ message: "Driver and vehicle must belong to your fleet" },
				403,
			);
		}

		// Auto-create route if none is provided
		let finalRouteId = routeId;
		if (!finalRouteId) {
			const route = await prisma.route.create({
				data: {
					name: `${startLocation} → ${endLocation}`,
					stops: stops,
					distance,
				},
			});
			finalRouteId = route.id;
		}

		const trip = await prisma.trip.create({
			data: {
				driverId,
				vehicleId,
				routeId: finalRouteId,
				startLocation,
				endLocation,
				distance,
				duration,
				status: "PLANNED",
			},
			include: {
				driver: { select: { name: true } },
				vehicle: { select: { licensePlate: true } },
				route: true,
			},
		});

		return c.json({ message: "Trip assigned successfully", trip }, 201);
	},
);

tripsRouter.patch(
	"/:id/add-stops",
	authMiddleware,
	withPrisma,
	describeRoute({
		summary: "Add Stops to Trip",
		description:
			"Appends or replaces stops for a trip’s assigned route. Must be called by an authenticated fleet admin.",
		tags: ["Trips"],
		parameters: [
			{
				name: "id",
				in: "path",
				required: true,
				schema: { type: "integer" },
				description: "Trip ID",
			},
		],
		requestBody: {
			required: true,
			content: {
				"application/json": {
					schema: {
						properties: {
							stops: {
								type: "array",
								items: { type: "string" },
								description: "List of stops to add or replace",
							},
							mode: {
								type: "string",
								enum: ["append", "replace"],
								default: "append",
								description:
									"Whether to append to or replace the existing stops array",
							},
						},
						required: ["stops"],
					},
				},
			},
		},
		responses: {
			200: {
				description: "Stops successfully updated",
			},
		},
	}),
	async (c) => {
		const prisma = c.get("prisma");
		const user = c.get("user");
		const id = Number(c.req.param("id"));
		const { stops, mode = "append" } = await c.req.json();

		if (user.role !== "ADMIN") {
			return c.json({ message: "Only admins can modify stops" }, 403);
		}

		const trip = await prisma.trip.findUnique({
			where: { id },
			include: { route: true },
		});

		if (!trip || !trip.routeId) {
			return c.json({ message: "Trip or route not found" }, 404);
		}

		const existingStops = (trip.route.stops as string[]) || [];
		const newStops = mode === "append" ? [...existingStops, ...stops] : stops;

		const updatedRoute = await prisma.route.update({
			where: { id: trip.routeId },
			data: { stops: newStops },
		});

		return c.json({
			message: "Stops updated successfully",
			route: updatedRoute,
		});
	},
);

export default tripsRouter;
