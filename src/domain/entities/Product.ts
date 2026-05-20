export type Product = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  imageUrl: string | null;
  categoryId: string | null;
  category?: { name: string } | null;
  createdAt: Date;
  updatedAt: Date;
};
