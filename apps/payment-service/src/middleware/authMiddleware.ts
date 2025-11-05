import { getAuth, ClerkAuthVariables } from "@hono/clerk-auth";
import { createMiddleware } from "hono/factory";
import type { CustomJwtSessionClaims } from "@repo/types";
import { use } from "hono/jsx";

export const shouldBeUser = createMiddleware<{ Variables: { userId: string } }>(
  async (c, next) => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      return c.json({
        message: "You are not logged in",
      });
    }

    c.set("userId", auth.userId);

    await next();
  }
);
export const shouldBeAdmin = createMiddleware<{
  Variables: { userId: string };
}>(async (c, next) => {
  const auth = getAuth(c);
  const userId = auth?.userId;

  if (!userId) {
    return c.json(
      {
        message: "You are not logged in",
      },
      401
    );
  }

  const clerkAuth: ClerkAuthVariables = {} as ClerkAuthVariables;

  const user = (await clerkAuth.clerk.users.getUser(
    userId
  )) as CustomJwtSessionClaims;

  if (user.publicMetadata.role !== "admin") {
    return c.json({ message: "User is not an admin" }, 403);
  }

  c.set("userId", auth.userId);

  await next();
});
