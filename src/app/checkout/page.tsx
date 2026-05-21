"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/presentation/stores/cartStore";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);

  const totalCents = useMemo(
    () => items.reduce((sum, it) => sum + it.priceCents * it.quantity, 0),
    [items]
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [postal, setPostal] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Checkout</h1>

      {items.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600">
          Your cart is empty.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="text-base font-semibold">Shipping information</h2>
            {error ? (
              <p className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>
            ) : null}
            <form
              className="mt-4 grid gap-3"
              onSubmit={async (e) => {
                e.preventDefault();
                setError(null);
                setLoading(true);
                try {
                  const res = await fetch("/api/orders", {
                    method: "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({
                      shipping: {
                        name,
                        email: email.trim() ? email : null,
                        phone: phone.trim() ? phone : null,
                        address1,
                        address2: address2 || null,
                        city,
                        postal
                      },
                      items: items.map((it) => ({
                        productId: it.productId,
                        name: it.name,
                        priceCents: it.priceCents,
                        quantity: it.quantity
                      }))
                    })
                  });
                  const data = await res.json();
                  if (!res.ok) throw new Error(data?.error ?? "Order failed");
                  clear();
                  router.push(`/orders/${data.order.id}`);
                } catch (err) {
                  setError(err instanceof Error ? err.message : "Order failed");
                } finally {
                  setLoading(false);
                }
              }}
            >
              <label className="block space-y-1">
                <span className="text-sm font-medium">Full name</span>
                <input
                  className="w-full rounded-md border border-slate-200 px-3 py-2"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </label>
              <label className="block space-y-1">
                <span className="text-sm font-medium">Email (optional)</span>
                <input
                  className="w-full rounded-md border border-slate-200 px-3 py-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                />
              </label>
              <label className="block space-y-1">
                <span className="text-sm font-medium">Phone (optional)</span>
                <input
                  className="w-full rounded-md border border-slate-200 px-3 py-2"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="e.g. +8801XXXXXXXXX"
                />
              </label>
              <label className="block space-y-1">
                <span className="text-sm font-medium">Address line 1</span>
                <input
                  className="w-full rounded-md border border-slate-200 px-3 py-2"
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                  required
                />
              </label>
              <label className="block space-y-1">
                <span className="text-sm font-medium">Address line 2 (optional)</span>
                <input
                  className="w-full rounded-md border border-slate-200 px-3 py-2"
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block space-y-1">
                  <span className="text-sm font-medium">City</span>
                  <input
                    className="w-full rounded-md border border-slate-200 px-3 py-2"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  />
                </label>
                <label className="block space-y-1">
                  <span className="text-sm font-medium">Postal</span>
                  <input
                    className="w-full rounded-md border border-slate-200 px-3 py-2"
                    value={postal}
                    onChange={(e) => setPostal(e.target.value)}
                    required
                  />
                </label>
              </div>
              <button
                className="mt-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
                disabled={loading}
                type="submit"
              >
                {loading ? "Placing order..." : "Place order"}
              </button>
            </form>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="text-base font-semibold">Order summary</h2>
            <div className="mt-4 space-y-3">
              {items.map((it) => (
                <div key={it.productId} className="flex items-center justify-between text-sm">
                  <div className="min-w-0">
                    <div className="truncate font-medium">{it.name}</div>
                    <div className="text-slate-600">Qty: {it.quantity}</div>
                  </div>
                  <div className="font-medium">
                    ${((it.priceCents * it.quantity) / 100).toFixed(2)}
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
                <span className="text-slate-600">Total</span>
                <span className="text-base font-semibold">${(totalCents / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
