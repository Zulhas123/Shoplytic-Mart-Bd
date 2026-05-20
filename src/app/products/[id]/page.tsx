import Link from "next/link";
import { ProductUseCases } from "@/application/use-cases/products";
import { PrismaProductRepository } from "@/infrastructure/repositories/PrismaProductRepository";
import { ProductAddButton } from "@/presentation/components/ProductAddButton";

export const dynamic = "force-dynamic";

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await new ProductUseCases(new PrismaProductRepository()).getById(id);

  if (!product) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">Product not found.</p>
        <Link className="underline" href="/products">
          Back to products
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Link className="text-sm text-slate-600 underline" href="/products">
        Back to products
      </Link>
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">{product.name}</h1>
          <p className="text-slate-600">{product.description}</p>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <span className="text-sm font-medium">${(product.priceCents / 100).toFixed(2)}</span>
          <ProductAddButton
            product={{
              id: product.id,
              name: product.name,
              priceCents: product.priceCents,
              imageUrl: product.imageUrl ?? null
            }}
          />
        </div>
      </div>
    </div>
  );
}
