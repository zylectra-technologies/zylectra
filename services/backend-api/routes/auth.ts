import { Hono } from "hono";
import {
	describeResponse,
	describeRoute,
	resolver,
	validator,
} from "hono-openapi";
import { sign } from "hono/jwt";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import withPrisma from "../lib/prisma";
import { authMiddleware } from "../middlewars/authMiddleware";

dotenv.config();

const authRouter = new Hono();

authRouter.post(
	"/driver/register",
	withPrisma,
	authMiddleware,
	describeRoute({
		summary: "Register Driver",
		tags: ["Authentication"],
		description:
			"Register a new driver. Must be called by an authenticated fleet admin. Automatically associates the driver with the admin's fleet.",
		requestBody: {
			required: true,
			content: {
				"application/json": {
					schema: {
						properties: {
							username: { type: "string", minLength: 3 },
							password: { type: "string", minLength: 6 },
							name: { type: "string" },
							phoneNumber: { type: "string" },
						},
						required: ["username", "password", "name", "phoneNumber"],
					},
				},
			},
		},
		responses: {
			201: {
				description: "Driver successfully registered",
				content: {
					"application/json": {
						schema: {
							properties: {
								message: { type: "string" },
								driverId: { type: "number" },
							},
							required: ["message", "driverId"],
						},
					},
				},
			},
			400: {
				description: "Validation or duplicate error",
				content: {
					"application/json": {
						schema: {
							properties: {
								message: { type: "string" },
							},
							required: ["message"],
						},
					},
				},
			},
			403: {
				description: "Unauthorized (non-admin user)",
				content: {
					"application/json": {
						schema: {
							properties: { message: { type: "string" } },
							required: ["message"],
						},
					},
				},
			},
		},
	}),
	async (c) => {
		const prisma = c.get("prisma");
		const user = c.get("user"); // from authMiddleware
		const { username, password, name, phoneNumber } = await c.req.json();

		// Ensure authenticated user is an admin
		if (user.role !== "ADMIN") {
			return c.json({ message: "Only admins can register drivers" }, 403);
		}

		// Find admin’s fleetId using their userId from JWT
		const admin = await prisma.fleetAdmin.findUnique({
			where: { userId: user.sub },
			select: { fleetId: true },
		});

		if (!admin || !admin.fleetId) {
			return c.json({ message: "Admin has no assigned fleet" }, 400);
		}

		// Check for duplicate username
		const existing = await prisma.driver.findUnique({ where: { username } });
		if (existing) {
			return c.json({ message: "Username already taken" }, 400);
		}

		// Hash password
		const passwordHash = await bcrypt.hash(password, 10);

		// Create driver linked to the admin’s fleet
		const driver = await prisma.driver.create({
			data: {
				username,
				passwordHash,
				name,
				contactInfo: phoneNumber,
				fleetId: admin.fleetId,
				currentLocationLat: 0,
				currentLocationLong: 0,
			},
		});

		return c.json(
			{
				message: "Driver registered successfully",
				driverId: driver.id,
			},
			201,
		);
	},
);

authRouter.post(
	"/driver/login",
	withPrisma,
	describeRoute({
		summary: "Driver Login",
		tags: ["Authentication"],
		description: "Login endpoint for drivers using username and password",
		requestBody: {
			required: true,
			content: {
				"application/json": {
					schema: {
						properties: {
							username: { type: "string" },
							password: { type: "string", minLength: 6 },
						},
						required: ["username", "password"],
					},
				},
			},
		},
		responses: {
			200: {
				description: "Successful driver login",
				content: {
					"application/json": {
						schema: {
							properties: {
								accessToken: { type: "string" },
								message: { type: "string" },
							},
							required: ["accessToken", "message"],
						},
					},
				},
			},
			401: {
				description: "Invalid credentials",
				content: {
					"application/json": {
						schema: {
							properties: {
								message: { type: "string" },
							},
							required: ["message"],
						},
					},
				},
			},
		},
	}),
	async (c) => {
		const { username, password } = await c.req.json();
		const prisma = c.get("prisma");

		const driver = await prisma.driver.findUnique({ where: { username } });
		if (!driver) {
			return c.json({ message: "Invalid credentials" }, 401);
		}

		const passwordMatch = await bcrypt.compare(password, driver.passwordHash);
		if (!passwordMatch) {
			return c.json({ message: "Invalid credentials" }, 401);
		}

		const token = await sign(
			{ sub: driver.id, username: driver.username, role: "DRIVER" },
			process.env.JWT_SECRET || "fallback_secret",
		);

		return c.json(
			{
				message: "Driver login successful",
				accessToken: token,
			},
			200,
		);
	},
);

authRouter.get(
	"/me",
	withPrisma,
	authMiddleware,
	describeRoute({
		summary: "Get the current user's details",
		tags: ["Authentication"],
	}),
	async (c) => {
		const prisma = c.get("prisma");
		const user = c.get("user");
		console.table(user);

		if (user.role === "ADMIN") {
			const adminDetails = await prisma.fleetAdmin.findUnique({
				where: { userId: user.sub },
			});
			return c.json({ user: adminDetails }, 200);
		} else if (user.role === "DRIVER") {
			const driverDetails = await prisma.driver.findUnique({
				where: { username: user.username },
			});
			return c.json({ user: driverDetails }, 200);
		} else {
			const generalUserDetails = await prisma.user.findUnique({
				where: { id: user.sub },
			});
			return c.json({ user: generalUserDetails }, 200);
		}
	},
);

authRouter.post(
	"/login",
	withPrisma,
	describeRoute({
		tags: ["Authentication"],
		summary: "Login Admin",
		description: "Login endpoint",
		requestBody: {
			required: true,
			content: {
				"application/json": {
					schema: {
						properties: {
							email: { type: "string", format: "email" },
							password: { type: "string", minLength: 6 },
						},
						required: ["email", "password"],
					},
				},
			},
		},
		responses: {
			200: {
				description: "Successful login",
				content: {
					"application/json": {
						schema: {
							properties: {
								accessToken: { type: "string" },
								message: { type: "string" },
							},
							required: ["accessToken"],
						},
					},
				},
			},
			401: {
				description: "Invalid credentials",
				content: {
					"application/json": {
						schema: {
							properties: {
								message: { type: "string" },
							},
							required: ["message"],
						},
					},
				},
			},
		},
	}),
	async (c) => {
		const { email, password } = await c.req.json();
		const prisma = c.get("prisma");
		const user = await prisma.user.findUnique({ where: { email } });

		if (!user) {
			return c.json({ message: "Invalid credentials" }, 401);
		}

		const passwordMatch = await bcrypt.compare(password, user.passwordHash);
		if (!passwordMatch) {
			return c.json({ message: "Invalid credentials" }, 401);
		}

		// TODO: Setup expiry
		const token = await sign(
			{ sub: user.id, email: user.email, role: user.role },
			process.env.JWT_SECRET || "fallback_secret",
		);

		return c.json(
			{
				message: "Login successful",
				accessToken: token,
			},
			200,
		);
	},
);

authRouter.post(
	"/register",
	withPrisma,
	describeRoute({
		summary: "Register Admin",
		tags: ["Authentication"],
		description: "Register endpoint (can optionally register as an admin)",
		requestBody: {
			required: true,
			content: {
				"application/json": {
					schema: {
						properties: {
							email: { type: "string", format: "email" },
							password: { type: "string", minLength: 6 },
							role: {
								type: "string",
								enum: ["USER", "ADMIN"],
								default: "USER",
							},
							name: { type: "string" },
							contactInfo: { type: "string" },
						},
						required: ["email", "password"],
					},
				},
			},
		},
		responses: {
			200: {
				description: "Successful registration",
				content: {
					"application/json": {
						schema: {
							properties: {
								message: { type: "string" },
								email: { type: "string" },
								role: { type: "string" },
							},
							required: ["message", "email", "role"],
						},
					},
				},
			},
		},
	}),
	async (c) => {
		const {
			email,
			password,
			role = "USER",
			name,
			contactInfo,
		} = await c.req.json();
		const prisma = c.get("prisma");

		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser) {
			return c.json({ message: "User already exists" }, 400);
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		// --- Create user first ---
		const newUser = await prisma.user.create({
			data: {
				email,
				passwordHash: hashedPassword,
				role,
			},
		});

		// --- If Admin, also create Fleet + FleetAdmin ---
		if (role === "ADMIN") {
			if (!name || !contactInfo) {
				return c.json(
					{
						message:
							"Name and contactInfo are required for admin registration.",
					},
					400,
				);
			}

			// Check if a default fleet exists, or create one
			let fleet = await prisma.fleet.findFirst({
				where: { name: "Default Fleet" },
			});

			if (!fleet) {
				fleet = await prisma.fleet.create({
					data: { name: "Default Fleet" },
				});
			}

			await prisma.fleetAdmin.create({
				data: {
					name,
					contactInfo,
					fleetId: fleet.id,
					userId: newUser.id,
				},
			});
		}

		return c.json(
			{
				message:
					role === "ADMIN"
						? "Admin registered successfully"
						: "User registered successfully",
				email: newUser.email,
				role,
			},
			200,
		);
	},
);

export default authRouter;
