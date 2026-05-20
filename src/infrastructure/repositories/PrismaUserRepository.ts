import type { UserRepository, CreateUserInput } from "@/domain/repositories/UserRepository";
import { prisma } from "@/infrastructure/database/prisma/client";

export class PrismaUserRepository implements UserRepository {
  async create(input: CreateUserInput) {
    const user = await prisma.user.create({
      data: {
        email: input.email ?? null,
        passwordHash: input.passwordHash,
        name: input.name,
        address: input.address ?? null,
        role: input.role ?? "USER"
      },
      select: {
        id: true,
        email: true,
        name: true,
        address: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
    return user;
  }

  async findByName(name: string) {
    return prisma.user.findUnique({
      where: { name },
      select: {
        id: true,
        email: true,
        name: true,
        address: true,
        role: true,
        passwordHash: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        address: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async list() {
    return prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        address: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async updateProfile(userId: string, input: { name: string; address?: string | null }) {
    return prisma.user.update({
      where: { id: userId },
      data: { name: input.name, address: input.address ?? null },
      select: {
        id: true,
        email: true,
        name: true,
        address: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async updatePassword(userId: string, passwordHash: string) {
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash }
    });
  }
}
