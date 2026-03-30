import Fastify from "fastify";
import cors from "@fastify/cors";
import { db } from "./db/database.js";

console.log("here");

const fastify = Fastify({
  logger: true,
});

await fastify.register(cors, {
  origin: "*", // Allow all origins for now
});

fastify.get("/api/users/:handle/links", async function handler(request, reply) {
  const { handle } = request.params as { handle: string };
  console.log("handle", handle);

  const user = await db
    .selectFrom("users")
    .selectAll()
    .where("handle", "=", handle)
    .executeTakeFirst();

  if (!user) {
    return reply.status(404).send({ error: "User not found" });
  }

  const links = await db
    .selectFrom("links")
    .selectAll()
    .where("user_id", "=", user.id)
    .orderBy("order_index", "asc")
    .execute();

  return { user, links };
});

try {
  const port = parseInt(process.env.PORT || "3000", 10);
  const host = process.env.HOST || "0.0.0.0";
  await fastify.listen({ port, host });
} catch (err) {
  fastify.log.error(err);
  process.exit(1);
}
