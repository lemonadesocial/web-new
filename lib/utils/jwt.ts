import jwt from "jsonwebtoken";

export const decodeJwt = <T>(token: string) => {
  return jwt.decode(token) as T;
};
