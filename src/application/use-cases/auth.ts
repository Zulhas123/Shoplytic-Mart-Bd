import { z } from "zod";
import type { UserRepository } from "@/domain/repositories/UserRepository";
import { hashPassword, verifyPassword } from "@/shared/utils/password";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(72),
  name: z.string().min(1).max(80),
  address: z.string().max(200).optional().nullable()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(72)
});

export class AuthUseCases {
  constructor(private readonly users: UserRepository) {}

  async register(input: z.infer<typeof registerSchema>) {
    const existing = await this.users.findByEmail(input.email);
    if (existing) throw new Error("Email already in use");

    const passwordHash = await hashPassword(input.password);
    return this.users.create({
      email: input.email,
      passwordHash,
      name: input.name,
      address: input.address ?? null
    });
  }

  async login(input: z.infer<typeof loginSchema>) {
    const user = await this.users.findByEmail(input.email);
    if (!user) throw new Error("Invalid credentials");
    const ok = await verifyPassword(input.password, user.passwordHash);
    if (!ok) throw new Error("Invalid credentials");
    const { passwordHash: _pw, ...safeUser } = user;
    return safeUser;
  }
}

