import { authCookie } from "@/infrastructure/api/auth/session";
import { jsonOk } from "@/shared/utils/http";

export async function POST() {
  const res = jsonOk({ ok: true });
  res.cookies.set(authCookie.name, "", { ...authCookie.options, maxAge: 0 });
  return res;
}

