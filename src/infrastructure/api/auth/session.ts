import { cookies } from "next/headers";
import { verifyAuthToken } from "@/shared/utils/jwt";

export type Session = { userId: string; role: "USER" | "ADMIN" };

const COOKIE_NAME = "shoplytic_token";

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const payload = verifyAuthToken(token);
    return { userId: payload.sub, role: payload.role };
  } catch {
    return null;
  }
}

export async function requireSession() {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function requireAdmin() {
  const session = await requireSession();
  if (session.role !== "ADMIN") throw new Error("Forbidden");
  return session;
}

export const authCookie = {
  name: COOKIE_NAME,
  options: {
    httpOnly: true as const,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production"
  }
};
