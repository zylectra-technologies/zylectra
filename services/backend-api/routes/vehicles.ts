import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import withPrisma from "../lib/prisma";
import { authMiddleware } from "../middlewars/authMiddleware";

const vehiclesRouter = new Hono();

vehiclesRouter.use("*", withPrisma);
vehiclesRouter.use("*", authMiddleware);

vehiclesRouter.get(
	"/",
	describeRoute({
		summary: "Get Vehicles",
		tags: ["Vehicles"],
		description: "Retrieve a list of vehicles",
		responses: {
			200: {
				description: "A list of vehicles",
			},
		},
	}),
	withPrisma,
	async (c) => {
		const prisma = c.get("prisma");
		const vehicles = await prisma.vehicle.findMany();
		return c.json({ vehicles });
	},
);

vehiclesRouter.get(
	"/:id",
	withPrisma,
	describeRoute({
		summary: "Get Vehicle by ID",
		tags: ["Vehicles"],
		description: "Retrieve a vehicle by its ID",
		responses: {
			200: {
				description: "Vehicle details",
			},
			404: {
				description: "Vehicle not found",
			},
		},
	}),
	async (c) => {
		const prisma = c.get("prisma");
		const { id } = c.req.param();
		const vehicle = await prisma.vehicle.findUnique({
			where: { id: Number(id) },
		});
		if (!vehicle) {
			return c.json({ message: "Vehicle not found" }, 404);
		}
		return c.json({ vehicle });
	},
);

vehiclesRouter.delete(
	"/:id",
	withPrisma,
	describeRoute({
		summary: "Delete Vehicle by ID",
		tags: ["Vehicles"],
		description: "Delete a vehicle by its ID",
		responses: {
			200: {
				description: "Vehicle deleted successfully",
			},
			404: {
				description: "Vehicle not found",
			},
		},
	}),
	async (c) => {
		const prisma = c.get("prisma");
		const { id } = c.req.param();
		const vehicle = await prisma.vehicle.delete({
			where: { id: Number(id) },
		});
		if (!vehicle) {
			return c.json({ message: "Vehicle not found" }, 404);
		}
		return c.json({ message: "Vehicle deleted successfully" });
	},
);

vehiclesRouter.patch(
	"/:id",
	withPrisma,
	describeRoute({
		summary: "Update Vehicle",
		tags: ["Vehicles"],
		description: "Update an existing vehicle",
	}),
	async (c) => {
		const prisma = c.get("prisma");
		const { id } = c.req.param();
		const body = await c.req.json();
		const updatedVehicle = await prisma.vehicle.update({
			where: { id: Number(id) },
			data: {
				make: body.make,
				model: body.model,
				year: body.year,
				vin: body.vin,
				licensePlate: body.licensePlate,
				status: body.status,
			},
		});
		if (!updatedVehicle) {
			return c.json({ message: "Vehicle not found" }, 404);
		}
		return c.json({ updatedVehicle }, 200);
	},
);

vehiclesRouter.post(
	"/upload-csv",
	describeRoute({
		summary: "Upload Vehicles via CSV",
		tags: ["Vehicles"],
		description: "Bulk upload vehicles from a CSV file",
		responses: {
			200: {
				description: "Vehicles uploaded successfully",
			},
			400: {
				description: "Invalid CSV format or data",
			},
			500: {
				description: "Server error during upload",
			},
		},
	}),
	withPrisma,
	async (c) => {
		try {
			const prisma = c.get("prisma");

			const body = await c.req.parseBody();
			const csvFile = body.csv as File;

			if (!csvFile) {
				return c.json({ error: "No CSV file provided" }, 400);
			}

			const csvText = await csvFile.text();

			const lines = csvText.split("\n").filter((line) => line.trim());
			if (lines.length < 2) {
				return c.json(
					{
						error: "CSV file must contain headers and at least one row of data",
					},
					400,
				);
			}

			// Extract headers and data rows
			const headers = lines[0].split(",").map((h) => h.trim());
			const dataRows = lines
				.slice(1)
				.map((line) => line.split(",").map((cell) => cell.trim()));

			// Expected headers based on the Vehicle model
			const expectedHeaders = [
				"vehicleType",
				"licensePlate",
				"status",
				"batteryLevel",
				"latitude",
				"longitude",
				"nextStop",
				"temperature",
				"odometerReading",
				"driverId",
				"fleetId",
			];

			// Validate headers
			const missingHeaders = expectedHeaders.filter(
				(header) => !headers.includes(header),
			);
			if (missingHeaders.length > 0) {
				return c.json(
					{ error: `Missing required headers: ${missingHeaders.join(", ")}` },
					400,
				);
			}

			// Process each row and create vehicles
			const vehicles = [];
			const errors = [];

			for (let i = 0; i < dataRows.length; i++) {
				try {
					const rowData = dataRows[i];
					if (rowData.length !== headers.length) {
						errors.push(`Row ${i + 2}: Invalid number of columns`);
						continue;
					}

					// Create an object from the row data
					const vehicleData: any = {};
					headers.forEach((header, index) => {
						const value = rowData[index];

						if (
							header === "batteryLevel" ||
							header === "odometerReading" ||
							header === "driverId" ||
							header === "fleetId"
						) {
							vehicleData[header] = value ? parseInt(value, 10) : null;
						} else if (
							header === "latitude" ||
							header === "longitude" ||
							header === "temperature"
						) {
							vehicleData[header] = value ? parseFloat(value) : null;
						} else if (header === "nextStop" && (!value || value === "")) {
							// Skip empty optional fields
							return;
						} else {
							vehicleData[header] = value;
						}
					});

					const vehicle = await prisma.vehicle.create({
						data: vehicleData,
					});

					vehicles.push(vehicle);
				} catch (error) {
					errors.push(
						`Row ${i + 2}: ${error instanceof Error ? error.message : "Unknown error"}`,
					);
				}
			}

			return c.json(
				{
					message: "CSV upload completed",
					vehiclesCreated: vehicles.length,
					errors: errors.length > 0 ? errors : null,
				},
				200,
			);
		} catch (error) {
			console.error("Error uploading CSV:", error);
			return c.json({ error: "Failed to process CSV file" }, 500);
		}
	},
);

export default vehiclesRouter;
