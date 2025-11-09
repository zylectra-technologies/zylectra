import { PrismaClient } from "../generated/prisma/client.ts";
const prisma = new PrismaClient();

async function main() {
	console.log("Start seeding...");

	// --- Cleanup: Delete existing data to start fresh ---
	// The order is important due to foreign key constraints
	await prisma.trip.deleteMany();
	await prisma.vehicle.deleteMany();
	await prisma.driver.deleteMany();
	await prisma.route.deleteMany();
	await prisma.fleetAdmin.deleteMany();
	await prisma.fleet.deleteMany();
	await prisma.user.deleteMany();
	console.log("Cleared existing data.");

	// --- 1. Create Users ---
	// Creating two users: one ADMIN and one regular USER
	const userAdmin = await prisma.user.create({
		data: {
			email: "vikram.singh@example.com",
			passwordHash: "hashed_password_admin_123", // In a real app, this would be a bcrypt hash
			role: "ADMIN",
		},
	});

	const userRegular = await prisma.user.create({
		data: {
			email: "priya.sharma@example.com",
			passwordHash: "hashed_password_user_456",
			role: "USER",
		},
	});
	console.log("Created users.");

	// --- 2. Create Fleets ---
	const mumbaiFleet = await prisma.fleet.create({
		data: {
			name: "Mumbai Express Fleet",
		},
	});

	const delhiFleet = await prisma.fleet.create({
		data: {
			name: "Delhi Capital Fleet",
		},
	});
	console.log("Created fleets.");

	// --- 3. Create FleetAdmin ---
	// Link the admin user to the Mumbai fleet
	const fleetAdmin = await prisma.fleetAdmin.create({
		data: {
			name: "Vikram Singh",
			contactInfo: "+91 98201 12345",
			fleetId: mumbaiFleet.id,
			userId: userAdmin.id, // This creates the link to the User model
		},
	});
	console.log("Created fleet admin.");

	// --- 4. Create Routes ---
	const route1 = await prisma.route.create({
		data: {
			name: "Mumbai to Pune Express",
			stops: JSON.stringify([
				"Gateway of India, Mumbai",
				"Lonavala",
				"Pune Station",
			]),
			distance: 150.5,
		},
	});

	const route2 = await prisma.route.create({
		data: {
			name: "Delhi to Gurgaon Shuttle",
			stops: JSON.stringify([
				"India Gate, New Delhi",
				"Dhaula Kuan",
				"Cyber City, Gurgaon",
			]),
			distance: 30.2,
		},
	});
	console.log("Created routes.");

	// --- 5. Create Drivers ---
	const driver1 = await prisma.driver.create({
		data: {
			name: "Rohan Patel",
			username: "rohan.p",
			passwordHash: "hashed_driver_789",
			contactInfo: "+91 88791 54321",
			status: "AVAILABLE",
			fleetId: mumbaiFleet.id,
			currentLocationLat: 19.076,
			currentLocationLong: 72.8777,
		},
	});

	const driver2 = await prisma.driver.create({
		data: {
			name: "Anjali Reddy",
			username: "anjali.r",
			passwordHash: "hashed_driver_101",
			contactInfo: "+91 99882 67890",
			status: "ON_DUTY",
			fleetId: delhiFleet.id,
			currentLocationLat: 28.6139,
			currentLocationLong: 77.209,
		},
	});
	console.log("Created drivers.");

	// --- 6. Create Vehicles ---
	const vehicle1 = await prisma.vehicle.create({
		data: {
			vehicleType: "Electric Sedan",
			licensePlate: "MH12CD5678",
			status: "IDLE",
			batteryLevel: 95,
			latitude: 19.076,
			longitude: 72.8777,
			temperature: 28.5,
			odometerReading: 15234,
			fleet: {
				connect: { id: mumbaiFleet.id }, // Corrected line
			},
			driver: {
				connect: { id: driver1.id },
			},
		},
	});

	const vehicle2 = await prisma.vehicle.create({
		data: {
			vehicleType: "Electric SUV",
			licensePlate: "DL01GH9012",
			status: "EN_ROUTE",
			batteryLevel: 60,
			latitude: 28.6304,
			longitude: 77.2177,
			nextStop: "Dhaula Kuan",
			temperature: 31.0,
			odometerReading: 8900,
			fleet: {
				connect: { id: delhiFleet.id }, // Corrected line
			},
			driver: {
				connect: { id: driver2.id },
			},
		},
	});
	console.log("Created vehicles.");

	// --- 7. Create Trips ---
	// A planned trip for the Mumbai fleet
	await prisma.trip.create({
		data: {
			vehicleId: vehicle1.id,
			driverId: driver1.id,
			routeId: route1.id,
			startLocation: "Gateway of India, Mumbai",
			endLocation: "Pune Station",
			distance: 150.5,
			duration: 180, // in minutes
			status: "PLANNED",
		},
	});

	// An in-progress trip for the Delhi fleet
	await prisma.trip.create({
		data: {
			vehicleId: vehicle2.id,
			driverId: driver2.id,
			routeId: route2.id,
			startLocation: "India Gate, New Delhi",
			endLocation: "Cyber City, Gurgaon",
			distance: 30.2,
			duration: 60, // in minutes
			status: "IN_PROGRESS",
			startTime: new Date(), // Trip started now
		},
	});

	// A completed trip for historical data
	await prisma.trip.create({
		data: {
			vehicleId: vehicle1.id,
			driverId: driver1.id,
			startLocation: "Bandra, Mumbai",
			endLocation: "Marine Drive, Mumbai",
			distance: 12.5,
			duration: 35,
			status: "COMPLETED",
			startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // Started 2 hours ago
			endTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // Ended 1 hour ago
		},
	});
	console.log("Created trips.");

	console.log("Seeding finished.");
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
