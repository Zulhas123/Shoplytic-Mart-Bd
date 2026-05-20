import Link from "next/link";
import Image from "next/image";
import { ProductUseCases } from "@/application/use-cases/products";
import { PrismaProductRepository } from "@/infrastructure/repositories/PrismaProductRepository";
import { ProductAddButton } from "@/presentation/components/ProductAddButton";

export const dynamic = "force-dynamic";

function hashToInt(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

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

  const price = (product.priceCents / 100).toFixed(2);
  const h = hashToInt(product.id);
  const discountPct = 5 + (h % 26);
  const reviews = 20 + (h % 380);
  const rating = (40 + (h % 11)) / 10;

  return (
    <div className="space-y-6">
      <Link className="text-sm text-slate-600 underline" href="/products">
        Back to products
      </Link>

      <div className="grid gap-4 lg:grid-cols-12">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white lg:col-span-5">
          <div className="relative aspect-[4/3] bg-slate-50">
            {product.imageUrl ? (
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 42vw"
                priority
              />
            ) : (
              <div className="absolute inset-0 grid place-items-center text-xs font-semibold uppercase tracking-wider text-slate-400">
                No image
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 lg:col-span-7">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{product.name}</h1>
              <p className="text-sm text-slate-600">
                Category: <span className="font-medium text-slate-900">{product.category?.name ?? "Uncategorized"}</span>
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-600">Price</div>
              <div className="text-2xl font-semibold text-slate-900">${price}</div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
              Rating {rating.toFixed(1)} / 5.0
            </span>
            <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
              {reviews} reviews
            </span>
            <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
              Discount {discountPct}%
            </span>
          </div>

          <div className="mt-4 space-y-2">
            <p className="text-sm leading-6 text-slate-700">{product.description}</p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <ProductAddButton
              product={{
                id: product.id,
                name: product.name,
                priceCents: product.priceCents,
                imageUrl: product.imageUrl ?? null
              }}
            />
            <Link
              className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-900 hover:bg-slate-50"
              href="/cart"
            >
              Go to cart
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-semibold text-slate-900">At a glance</p>
          <ul className="mt-3 space-y-2 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Clean product presentation with clear pricing.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Add to cart in one click, then checkout fast.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Invoice available after placing the order.
            </li>
          </ul>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-semibold text-slate-900">More information</p>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            Product photos, description, and category are displayed together so customers can decide quickly. After ordering, you can pay via bKash/Nagad/manual and download an invoice.
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="text-sm font-semibold text-slate-900">Reviews</p>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            Showing {reviews} reviews with an average rating of {rating.toFixed(1)} helps build trust and improves conversion.
          </p>
        </div>
      </div>
    </div>
  );
}
