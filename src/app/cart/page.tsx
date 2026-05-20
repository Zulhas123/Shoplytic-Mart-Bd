"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useCartStore } from "@/presentation/stores/cartStore";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const totalCents = useMemo(
    () => items.reduce((sum, it) => sum + it.priceCents * it.quantity, 0),
    [items]
  );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Cart</h1>

      {items.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600">
          Your cart is empty.{" "}
          <Link className="underline" href="/products">
            Browse products
          </Link>
          .
        </div>
      ) : (
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white">
            <div className="divide-y divide-slate-100">
              {items.map((it) => (
                <div key={it.productId} className="flex items-center gap-4 p-4">
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{it.name}</div>
                    <div className="text-sm text-slate-600">
                      ${(it.priceCents / 100).toFixed(2)}
                    </div>
                  </div>
                  <input
                    className="w-20 rounded-md border border-slate-200 px-2 py-1 text-sm"
                    type="number"
                    min={0}
                    max={99}
                    value={it.quantity}
                    onChange={(e) => setQuantity(it.productId, Number(e.target.value))}
                  />
                  <button
                    className="text-sm text-red-700 hover:underline"
                    onClick={() => removeItem(it.productId)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-4">
            <div className="text-sm text-slate-600">Total</div>
            <div className="text-base font-semibold">${(totalCents / 100).toFixed(2)}</div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <Link className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium" href="/products">
              Continue shopping
            </Link>
            <Link className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white" href="/checkout">
              Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

