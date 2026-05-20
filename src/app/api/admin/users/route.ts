import { requireAdmin } from "@/infrastructure/api/auth/session";
import { PrismaUserRepository } from "@/infrastructure/repositories/PrismaUserRepository";
import { jsonBadRequest, jsonForbidden, jsonOk, jsonUnauthorized } from "@/shared/utils/http";

export async function GET() {
  try {
    await requireAdmin();
    const users = await new PrismaUserRepository().list();
    return jsonOk({ users });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid request";
    if (message === "Unauthorized") return jsonUnauthorized();
    if (message === "Forbidden") return jsonForbidden();
    return jsonBadRequest(message);
  }
}
