"use client";

import { useCartStore } from "@/presentation/stores/cartStore";

export function ProductAddButton(props: {
  product: { id: string; name: string; priceCents: number; imageUrl: string | null };
}) {
  const addItem = useCartStore((s) => s.addItem);
  return (
    <button
      className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
      onClick={() =>
        addItem({
          productId: props.product.id,
          name: props.product.name,
          priceCents: props.product.priceCents,
          imageUrl: props.product.imageUrl
        })
      }
    >
      Add to cart
    </button>
  );
}

