import type { Product } from "@/domain/entities/Product";

export type CreateProductInput = {
  name: string;
  description: string;
  priceCents: number;
  imageUrl?: string | null;
  categoryId?: string | null;
};

export type UpdateProductInput = Partial<CreateProductInput>;

export interface ProductRepository {
  list(input?: { categoryId?: string | null; q?: string | null }): Promise<Product[]>;
  getById(id: string): Promise<Product | null>;
  create(input: CreateProductInput): Promise<Product>;
  update(id: string, input: UpdateProductInput): Promise<Product>;
  delete(id: string): Promise<void>;
}

