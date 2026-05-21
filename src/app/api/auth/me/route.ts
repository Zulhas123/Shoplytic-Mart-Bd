import { PrismaUserRepository } from "@/infrastructure/repositories/PrismaUserRepository";
import { getSession } from "@/infrastructure/api/auth/session";
import { jsonOk, jsonUnauthorized } from "@/shared/utils/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) return jsonUnauthorized();
  const user = await new PrismaUserRepository().findById(session.userId);
  return jsonOk({ user });
}
