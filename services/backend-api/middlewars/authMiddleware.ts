import { verify } from "hono/jwt";
import { Context, Next } from "hono";

const JWT_SECRET = process.env.JWT_SECRET || "helloworld";

export const authMiddleware = async (c: Context, next: Next) => {
	try {
		const authHeader = c.req.header("Authorization");
		if (!authHeader || !authHeader.startsWith("Bearer ")) {
			return c.json(
				{ message: "Missing or invalid Authorization header" },
				401,
			);
		}

		const token = authHeader.split(" ")[1];
		const decoded = await verify(token, JWT_SECRET);
		console.table(decoded);

		c.set("user", decoded);

		await next();
	} catch (err) {
		console.error("JWT verification failed:", err);
		return c.json({ message: "Invalid or expired token" }, 401);
	}
};
