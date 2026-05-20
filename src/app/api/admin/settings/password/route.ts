import { z } from "zod";
import { requireAdmin } from "@/infrastructure/api/auth/session";
import { PrismaUserRepository } from "@/infrastructure/repositories/PrismaUserRepository";
import { AuthUseCases } from "@/application/use-cases/auth";
import { jsonBadRequest, jsonForbidden, jsonOk, jsonUnauthorized } from "@/shared/utils/http";

const schema = z.object({
  currentPassword: z.string().min(8).max(72),
  newPassword: z.string().min(8).max(72)
});

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const input = schema.parse(body);
    await new AuthUseCases(new PrismaUserRepository()).changeAdminPassword(input);
    return jsonOk({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid request";
    if (message === "Unauthorized") return jsonUnauthorized();
    if (message === "Forbidden") return jsonForbidden();
    return jsonBadRequest(message);
  }
}

