"use client";

import Link from "next/link";
import { useCartStore } from "@/presentation/stores/cartStore";

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

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="space-y-1">
        <Link className="text-base font-semibold hover:underline" href={`/products/${product.id}`}>
          {product.name}
        </Link>
        <p className="line-clamp-2 text-sm text-slate-600">{product.description}</p>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm font-medium">${price}</span>
        <button
          className="rounded-md bg-slate-900 px-3 py-2 text-xs font-medium text-white"
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
  );
}

