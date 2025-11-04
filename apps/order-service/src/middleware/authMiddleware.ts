import { FastifyReply, FastifyRequest } from "fastify";
import Clerk from "@clerk/fastify";
import type { CustomJwtSessionClaims } from "@repo/types";
declare module "fastify" {
  interface FastifyRequest {
    userId?: string;
  }
}

export const shouldBeUser = async (req: FastifyRequest, rep: FastifyReply) => {
  const { userId } = Clerk.getAuth(req);

  if (!userId) {
    return rep.status(401).send({
      message: "User is not logged in for order service+++++",
    });
  }

  req.userId = userId;
};

export const shouldBeAdmin = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const auth = Clerk.getAuth(request);
  if (!auth.userId) {
    return reply.status(401).send({ message: "You are not logged in!" });
  }

  const user = (await Clerk.clerkClient.users.getUser(
    auth.userId
  )) as CustomJwtSessionClaims;

  const role = user.publicMetadata.role;

  if (role !== "admin") {
    reply.status(403).send({ message: "not an admin", role });
  }

  request.userId = auth.userId;
};
