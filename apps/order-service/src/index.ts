import Fastify from "fastify";
import Clerk from "@clerk/fastify";
import { shouldBeUser } from "./middleware/authMiddleware.js";
import { connectOrderDb } from "@repo/order-db";
import { orderRoute } from "./routes/order.js";

const fastify = Fastify();

fastify.register(Clerk.clerkPlugin, {});
fastify.register(orderRoute);

// ✅ Protected route using Clerk authentication
fastify.get("/test", { preHandler: shouldBeUser }, async (request, reply) => {
  return reply.status(200).send({
    message: "Order service is authenticated and is working",
    userId: request.userId,
  });
});

const start = async () => {
  try {
    await connectOrderDb();
    await fastify.listen({ port: 8001 });
    console.log("Order service is runnign on port 8001");
  } catch (error) {
    fastify.log.error(error);
    console.log(error);
    process.exit(1);
  }
};

start();
