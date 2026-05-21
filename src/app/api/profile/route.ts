import { z } from "zod";
import { PrismaUserRepository } from "@/infrastructure/repositories/PrismaUserRepository";
import { requireSession } from "@/infrastructure/api/auth/session";
import { jsonBadRequest, jsonOk, jsonUnauthorized } from "@/shared/utils/http";
import { errorMessageFromUnknown } from "@/shared/utils/errors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const profileSchema = z.object({
  name: z.string().min(1).max(80),
  address: z.string().max(200).optional().nullable()
});

export async function PUT(req: Request) {
  try {
    const session = await requireSession();
    const body = await req.json();
    const input = profileSchema.parse(body);
    const user = await new PrismaUserRepository().updateProfile(session.userId, input);
    return jsonOk({ user });
  } catch (e) {
    const message = errorMessageFromUnknown(e);
    if (message === "Unauthorized") return jsonUnauthorized();
    return jsonBadRequest(message);
  }
}
