import jwt from "jsonwebtoken";
import { env } from "@/shared/utils/env";

export type AuthTokenPayload = {
  sub: string;
  role: "USER" | "ADMIN";
};

export function signAuthToken(payload: AuthTokenPayload) {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
}

export function verifyAuthToken(token: string) {
  return jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
}

