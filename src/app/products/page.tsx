import { ProductUseCases } from "@/application/use-cases/products";
import { CategoryUseCases } from "@/application/use-cases/categories";
import { PrismaProductRepository } from "@/infrastructure/repositories/PrismaProductRepository";
import { PrismaCategoryRepository } from "@/infrastructure/repositories/PrismaCategoryRepository";
import { ProductCard } from "@/presentation/components/ProductCard";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse and search products available in Shoplytic."
};

export default async function ProductsPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; categoryId?: string }>;
}) {
  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const categoryId = sp.categoryId?.trim() || "";
  const effectiveCategoryId = categoryId.startsWith("preset:") ? "" : categoryId;
  const [products, categories] = await Promise.all([
    new ProductUseCases(new PrismaProductRepository()).list({
      q,
      categoryId: effectiveCategoryId || null
    }),
    new CategoryUseCases(new PrismaCategoryRepository()).list()
  ]);

  const presetCategories = [
    "Electronics",
    "Fashion",
    "Home & Kitchen",
    "Beauty & Personal Care",
    "Sports & Outdoors",
    "Books",
    "Toys & Games",
    "Grocery",
    "Health & Wellness",
    "Automotive",
    "Office Supplies",
    "Accessories"
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
          <p className="text-sm text-slate-600">Browse and search.</p>
        </div>
        <form className="flex flex-wrap items-center gap-2" action="/products">
          <input
            className="w-64 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
            name="q"
            defaultValue={q}
            placeholder="Search products..."
          />
          <select
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
            name="categoryId"
            defaultValue={categoryId}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
            {categories.length === 0
              ? presetCategories.map((name) => (
                  <option
                    key={`preset-${name}`}
                    value={`preset:${name.toLowerCase().replaceAll(" ", "-").replaceAll("&", "and")}`}
                  >
                    {name}
                  </option>
                ))
              : null}
          </select>
          <button className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium">
            Search
          </button>
        </form>
      </div>

      {products.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600">
          No products found.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={{
                id: p.id,
                name: p.name,
                description: p.description,
                priceCents: p.priceCents,
                imageUrl: p.imageUrl ?? null
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
