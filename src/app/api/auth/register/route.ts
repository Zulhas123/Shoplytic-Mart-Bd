import { registerSchema } from "@/application/use-cases/auth";
import { authCookie } from "@/infrastructure/api/auth/session";
import { prisma } from "@/infrastructure/database/prisma/client";
import { PrismaUserRepository } from "@/infrastructure/repositories/PrismaUserRepository";
import { hashPassword } from "@/shared/utils/password";
import { signAuthToken } from "@/shared/utils/jwt";
import { jsonBadRequest, jsonCreated } from "@/shared/utils/http";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const input = registerSchema.parse(body);

    const usersRepo = new PrismaUserRepository();
    const existingCount = await prisma.user.count();
    const role = existingCount === 0 ? "ADMIN" : "USER";

    const user = await usersRepo.create({
      email: input.email,
      passwordHash: await hashPassword(input.password),
      name: input.name,
      address: input.address ?? null,
      role
    });

    const token = signAuthToken({ sub: user.id, role: user.role });
    const res = jsonCreated({ user });
    res.cookies.set(authCookie.name, token, authCookie.options);
    return res;
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid request";
    return jsonBadRequest(message);
  }
}
