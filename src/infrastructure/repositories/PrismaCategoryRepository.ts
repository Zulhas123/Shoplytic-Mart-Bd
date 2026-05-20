import type { CategoryRepository } from "@/domain/repositories/CategoryRepository";
import { prisma } from "@/infrastructure/database/prisma/client";

export class PrismaCategoryRepository implements CategoryRepository {
  list() {
    return prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, createdAt: true, updatedAt: true }
    });
  }

  create(input: { name: string }) {
    return prisma.category.create({
      data: { name: input.name },
      select: { id: true, name: true, createdAt: true, updatedAt: true }
    });
  }
}

