import { getAuth, clerkClient } from "@clerk/express";
import { Request, Response, NextFunction } from "express";

import type { CustomJwtSessionClaims } from "@repo/types";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const shouldBeUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const auth = getAuth(req);
  const userId = auth.userId;

  if (!userId) {
    return res.status(401).json({ message: "You are not logged in" });
  }

  req.userId = userId;

  return next();
};
export const shouldBeAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { isAuthenticated, userId } = getAuth(req);

  if (!isAuthenticated) {
    return res.status(401).json({ message: "You are not logged in" });
  }

  const user = (await clerkClient.users.getUser(
    userId
  )) as CustomJwtSessionClaims;

  const role = user.publicMetadata.role;

  if (role !== "admin") {
    return res.status(403).json({ message: "You are not an admin" });
  }

  req.userId = userId;

  return next();
};
