import { z } from "zod";
import type { UserRepository } from "@/domain/repositories/UserRepository";
import { hashPassword, verifyPassword } from "@/shared/utils/password";

export const registerSchema = z.object({
  name: z.string().min(1).max(80),
  password: z.string().min(8).max(72),
  email: z.string().email().optional().nullable(),
  address: z.string().max(200).optional().nullable()
});

export const loginSchema = z.object({
  password: z.string().min(8).max(72)
});

export const adminLoginSchema = z.object({
  name: z.string().min(1).max(80),
  password: z.string().min(8).max(72)
});

export const adminRegisterSchema = z.object({
  password: z.string().min(8).max(72)
});

export class AuthUseCases {
  constructor(private readonly users: UserRepository) {}

  async register(input: z.infer<typeof registerSchema>) {
    const name = input.name.trim();
    if (name.toLowerCase() === "admin") throw new Error("Username not available");

    const existingByName = await this.users.findByName(name);
    if (existingByName) throw new Error("Username already in use");

    const passwordHash = await hashPassword(input.password);
    return this.users.create({
      email: input.email ?? null,
      passwordHash,
      name,
      address: input.address ?? null
    });
  }

  async loginAdmin(input: z.infer<typeof adminLoginSchema>) {
    if (input.name.trim().toLowerCase() !== "admin") throw new Error("Invalid credentials");
    if (input.password !== "admin123") throw new Error("Invalid credentials");

    const existingAdmin = await this.users.findByName("admin");
    if (!existingAdmin) {
      const created = await this.users.create({
        name: "admin",
        email: null,
        passwordHash: await hashPassword("admin123"),
        role: "ADMIN"
      });
      return created;
    }

    const ok = await verifyPassword("admin123", existingAdmin.passwordHash);
    if (!ok) throw new Error("Invalid credentials");
    const { passwordHash: _pw, ...safeAdmin } = existingAdmin;
    return safeAdmin;
  }

  async changeAdminPassword(input: { currentPassword: string; newPassword: string }) {
    if (input.newPassword.length < 8 || input.newPassword.length > 72) {
      throw new Error("Invalid new password");
    }

    const admin = await this.users.findByName("admin");
    if (!admin) throw new Error("Admin not found");

    const ok = await verifyPassword(input.currentPassword, admin.passwordHash);
    if (!ok) throw new Error("Invalid credentials");

    const passwordHash = await hashPassword(input.newPassword);
    await this.users.updatePassword(admin.id, passwordHash);
  }
}
