import { AuthUseCases, adminLoginSchema } from "@/application/use-cases/auth";
import { PrismaUserRepository } from "@/infrastructure/repositories/PrismaUserRepository";
import { authCookie } from "@/infrastructure/api/auth/session";
import { signAuthToken } from "@/shared/utils/jwt";
import { jsonBadRequest, jsonOk } from "@/shared/utils/http";
import { errorMessageFromUnknown } from "@/shared/utils/errors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = adminLoginSchema.parse(body);
    const usersRepo = new PrismaUserRepository();
    const useCases = new AuthUseCases(usersRepo);

    const user = await useCases.loginAdmin(input);
    const token = signAuthToken({ sub: user.id, role: user.role });

    const res = jsonOk({ user });
    res.cookies.set(authCookie.name, token, authCookie.options);
    return res;
  } catch (e) {
    return jsonBadRequest(errorMessageFromUnknown(e));
  }
}
