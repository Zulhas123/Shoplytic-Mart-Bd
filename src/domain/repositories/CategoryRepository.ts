import type { Category } from "@/domain/entities/Category";

export interface CategoryRepository {
  list(): Promise<Category[]>;
  create(input: { name: string }): Promise<Category>;
}

