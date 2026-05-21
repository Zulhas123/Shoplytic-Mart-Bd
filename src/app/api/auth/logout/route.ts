import { authCookie } from "@/infrastructure/api/auth/session";
import { jsonOk } from "@/shared/utils/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const res = jsonOk({ ok: true });
  res.cookies.set(authCookie.name, "", { ...authCookie.options, maxAge: 0 });
  return res;
}
