import { ProductUseCases } from "@/application/use-cases/products";
import { PrismaProductRepository } from "@/infrastructure/repositories/PrismaProductRepository";
import { ProductForm } from "@/presentation/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function AdminEditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await new ProductUseCases(new PrismaProductRepository()).getById(id);

  if (!product) return <div className="text-sm text-slate-600">Product not found.</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Edit product</h2>
      <ProductForm
        mode="edit"
        product={{
          id: product.id,
          name: product.name,
          description: product.description,
          priceCents: product.priceCents,
          imageUrl: product.imageUrl ?? null,
          categoryId: product.categoryId ?? null
        }}
      />
    </div>
  );
}
