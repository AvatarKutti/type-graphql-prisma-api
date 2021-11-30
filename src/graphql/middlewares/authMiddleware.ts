import { MyContext } from "src/types/MyContext";
import { MiddlewareFn } from "type-graphql";
import * as jwt from "jsonwebtoken";

export const AuthMiddleware: MiddlewareFn<MyContext> = async (
  { context },
  next
) => {
  const token = context.req.headers.authorization;

  if (!token) {
    throw new Error("Not Authorizied");
  }

  const user = jwt.verify(token, "jsiffsfagfmabgjwgahuaghaughaugauywgaehjgege");

  if (!user) {
    throw new Error("Not Authorizied");
  }

  return next();
};
