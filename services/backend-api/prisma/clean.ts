import { PrismaClient } from "../generated/prisma/client.ts";
const prisma = new PrismaClient();

async function main() {
	// clear all models
	await prisma.trip.deleteMany({});
	await prisma.driver.deleteMany({});
	await prisma.vehicle.deleteMany({});
	await prisma.fleetAdmin.deleteMany({});
	await prisma.fleet.deleteMany({});
	await prisma.user.deleteMany({});
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
	});
