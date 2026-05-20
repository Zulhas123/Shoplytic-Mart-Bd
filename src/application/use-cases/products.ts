import { z } from "zod";
import type { ProductRepository } from "@/domain/repositories/ProductRepository";

const imageUrlSchema = z
  .string()
  .trim()
  .refine(
    (value) => {
      if (!value) return true;
      if (value.startsWith("/")) return true; // local uploads like /uploads/...
      try {
        new URL(value);
        return true;
      } catch {
        return false;
      }
    },
    { message: "Invalid image URL" }
  );

export const productCreateSchema = z.object({
  name: z.string().min(1).max(120),
  description: z.string().min(1).max(2000),
  priceCents: z.number().int().min(0),
  imageUrl: imageUrlSchema.optional().nullable(),
  categoryId: z.string().optional().nullable()
});

export const productUpdateSchema = productCreateSchema.partial();

export class ProductUseCases {
  constructor(private readonly products: ProductRepository) {}

  list(input?: { categoryId?: string | null; q?: string | null }) {
    return this.products.list(input);
  }

  getById(id: string) {
    return this.products.getById(id);
  }

  create(input: z.infer<typeof productCreateSchema>) {
    return this.products.create(input);
  }

  update(id: string, input: z.infer<typeof productUpdateSchema>) {
    return this.products.update(id, input);
  }

  delete(id: string) {
    return this.products.delete(id);
  }
}
