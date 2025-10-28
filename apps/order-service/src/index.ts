import Clerk from "@clerk/fastify";
import Fastify from "fastify";
import * as dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const fastify = Fastify();

// Initialize Clerk with your API keys
fastify.register(Clerk.clerkPlugin, {
  publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY,
});

fastify.get("/", (request, reply) => {
  return reply.send({
    message: "order service works",
    envCheck: {
      hasPublishableKey: !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
      hasSecretKey: !!process.env.CLERK_SECRET_KEY,
    },
  });
});

fastify.get("/test", async (request, reply) => {
  const auth = Clerk.getAuth(request);
  console.log("Auth details:", {
    auth,
    headers: request.headers,
    env: {
      publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
        ? "set"
        : "not set",
      secretKey: process.env.CLERK_SECRET_KEY ? "set" : "not set",
    },
  });

  const { isAuthenticated, userId } = auth;
  if (isAuthenticated) {
    return reply.send({
      message: `Welcome to RIto. Order Service is up and running for user ${userId}`,
    });
  }

  return reply.send({ message: "You are not logged in ORDER SERVICE" });
});

const start = async () => {
  try {
    await fastify.listen({ port: 8001 });
    console.log("Order Service is up and running on 8001");
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();
