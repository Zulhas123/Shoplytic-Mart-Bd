import type {
  CreateProductInput,
  ProductRepository,
  UpdateProductInput
} from "@/domain/repositories/ProductRepository";
import { prisma } from "@/infrastructure/database/prisma/client";

export class PrismaProductRepository implements ProductRepository {
  async list(input?: { categoryId?: string | null; q?: string | null }) {
    const q = input?.q?.trim();
    return prisma.product.findMany({
      where: {
        categoryId: input?.categoryId ?? undefined,
        ...(q
          ? {
              OR: [
                { name: { contains: q, mode: "insensitive" } },
                { description: { contains: q, mode: "insensitive" } }
              ]
            }
          : {})
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        description: true,
        priceCents: true,
        imageUrl: true,
        categoryId: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async getById(id: string) {
    return prisma.product.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        priceCents: true,
        imageUrl: true,
        categoryId: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async create(input: CreateProductInput) {
    return prisma.product.create({
      data: {
        name: input.name,
        description: input.description,
        priceCents: input.priceCents,
        imageUrl: input.imageUrl ?? null,
        categoryId: input.categoryId ?? null
      },
      select: {
        id: true,
        name: true,
        description: true,
        priceCents: true,
        imageUrl: true,
        categoryId: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async update(id: string, input: UpdateProductInput) {
    return prisma.product.update({
      where: { id },
      data: {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.description !== undefined ? { description: input.description } : {}),
        ...(input.priceCents !== undefined ? { priceCents: input.priceCents } : {}),
        ...(input.imageUrl !== undefined ? { imageUrl: input.imageUrl } : {}),
        ...(input.categoryId !== undefined ? { categoryId: input.categoryId } : {})
      },
      select: {
        id: true,
        name: true,
        description: true,
        priceCents: true,
        imageUrl: true,
        categoryId: true,
        createdAt: true,
        updatedAt: true
      }
    });
  }

  async delete(id: string) {
    await prisma.product.delete({ where: { id } });
  }
}

