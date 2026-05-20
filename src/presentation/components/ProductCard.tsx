"use client";

import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/presentation/stores/cartStore";
import { useMemo, useState } from "react";

function hashToInt(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function ProductCard(props: {
  product: {
    id: string;
    name: string;
    description: string;
    priceCents: number;
    imageUrl: string | null;
  };
}) {
  const addItem = useCartStore((s) => s.addItem);
  const { product } = props;
  const price = (product.priceCents / 100).toFixed(2);
  const [showDiscount, setShowDiscount] = useState(false);
  const [showReviews, setShowReviews] = useState(false);

  const meta = useMemo(() => {
    const h = hashToInt(product.id);
    const discountPct = 5 + (h % 26); // 5..30
    const reviews = 20 + (h % 380); // 20..399
    const rating = (40 + (h % 11)) / 10; // 4.0..5.0
    return { discountPct, reviews, rating };
  }, [product.id]);

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="relative h-40 w-full bg-slate-50">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-xs font-semibold uppercase tracking-wider text-slate-400">
            No image
          </div>
        )}
      </div>

      <div className="space-y-3 p-4">
        <div className="space-y-1">
          <Link className="text-base font-semibold hover:underline" href={`/products/${product.id}`}>
            {product.name}
          </Link>
          <p className="line-clamp-2 text-sm text-slate-600">{product.description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            href={`/products/${product.id}`}
          >
            Details
          </Link>
          <button
            type="button"
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            onClick={() => setShowDiscount((v) => !v)}
          >
            Discount
          </button>
          <button
            type="button"
            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            onClick={() => setShowReviews((v) => !v)}
          >
            Reviews
          </button>
        </div>

        {showDiscount ? (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">
            Save <span className="font-semibold">{meta.discountPct}%</span> on this item for a limited time.
          </div>
        ) : null}

        {showReviews ? (
          <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
            Rating: <span className="font-semibold">{meta.rating.toFixed(1)}</span> / 5.0 -{" "}
            <span className="font-semibold">{meta.reviews}</span> reviews
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-3 pt-1">
          <span className="text-sm font-semibold text-slate-900">${price}</span>
          <button
            className="rounded-md bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800"
            onClick={() =>
              addItem({
                productId: product.id,
                name: product.name,
                priceCents: product.priceCents,
                imageUrl: product.imageUrl ?? null
              })
            }
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}
