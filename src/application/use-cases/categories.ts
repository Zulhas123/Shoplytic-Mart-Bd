import { z } from "zod";
import type { CategoryRepository } from "@/domain/repositories/CategoryRepository";

export const createCategorySchema = z.object({
  name: z.string().min(1).max(60)
});

export class CategoryUseCases {
  constructor(private readonly categories: CategoryRepository) {}
  list() {
    return this.categories.list();
  }
  create(input: z.infer<typeof createCategorySchema>) {
    return this.categories.create(input);
  }
}

