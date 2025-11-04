import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { use } from "hono/jsx";
import { shouldBeUser } from "./middleware/authMiddleware.js";

const app = new Hono();

app.use("*", clerkMiddleware());

app.get("/test", shouldBeUser, (c) => {
  return c.json({ message: "Payment service works", userId: c.get("userId") });
});

app.get("/test", (user) => {
  return user.json({
    message: "You are logged in and payment service is authenticated ",
  });
});
const start = async () => {
  try {
    serve(
      {
        fetch: app.fetch,
        port: 8002,
      },
      (info) => {
        console.log(
          `Payment service is running on http://localhost:${info.port}`
        );
      }
    );
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

start();
