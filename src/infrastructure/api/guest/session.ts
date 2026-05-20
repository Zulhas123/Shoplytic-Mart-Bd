import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const guestCookie = {
  name: "shoplytic_guest",
  options: {
    httpOnly: true as const,
    sameSite: "lax" as const,
    path: "/"
  }
};

export async function getGuestKey() {
  const jar = await cookies();
  return jar.get(guestCookie.name)?.value ?? null;
}

export function ensureGuestKey(res: NextResponse, current: string | null) {
  if (current) return current;
  const created = crypto.randomUUID();
  res.cookies.set(guestCookie.name, created, guestCookie.options);
  return created;
}

export function setGuestKey(res: NextResponse, guestKey: string) {
  res.cookies.set(guestCookie.name, guestKey, guestCookie.options);
}
