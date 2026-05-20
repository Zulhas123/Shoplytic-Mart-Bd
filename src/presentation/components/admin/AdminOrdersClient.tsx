"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type OrderRow = {
  id: string;
  status: "PENDING" | "CONFIRMED" | "REJECTED" | "PAID" | "SHIPPED" | "DELIVERED" | "CANCELED";
  shippingName: string;
  shippingEmail: string | null;
  totalCents: number;
  createdAt: string | Date;
  items: Array<{ id: string }>;
};

function StatusPill({ status }: { status: OrderRow["status"] }) {
  const tone =
    status === "CONFIRMED"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : status === "REJECTED"
        ? "bg-red-50 text-red-700 border-red-200"
        : status === "PENDING"
          ? "bg-amber-50 text-amber-700 border-amber-200"
          : "bg-slate-50 text-slate-700 border-slate-200";

  return (
    <span className={["inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold", tone].join(" ")}>
      {status}
    </span>
  );
}

export function AdminOrdersClient(props: {
  initialOrders: OrderRow[];
  initialFilter?: "ALL" | "PENDING" | "CONFIRMED" | "REJECTED";
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filter, setFilter] = useState<"ALL" | "PENDING" | "CONFIRMED" | "REJECTED">(
    props.initialFilter ?? "PENDING"
  );
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const orders = useMemo(() => props.initialOrders, [props.initialOrders]);
  const filtered = useMemo(() => {
    if (filter === "ALL") return orders;
    return orders.filter((o) => o.status === filter);
  }, [filter, orders]);

  function setFilterAndUrl(next: typeof filter) {
    setFilter(next);
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("status", next);
    router.push(`/admin/orders?${sp.toString()}`);
  }

  async function updateStatus(orderId: string, status: "PENDING" | "CONFIRMED" | "REJECTED") {
    setError(null);
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Update failed");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Orders</h2>
          <p className="text-sm text-slate-600">Confirm, reject, and review order history.</p>
        </div>

        <div className="flex flex-wrap gap-2 text-sm">
          {(["PENDING", "CONFIRMED", "REJECTED", "ALL"] as const).map((v) => (
            <button
              key={v}
              type="button"
              className={[
                "rounded-md border px-3 py-2 font-medium",
                filter === v ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              ].join(" ")}
              onClick={() => setFilterAndUrl(v)}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {error ? <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

      <div className="rounded-lg border border-slate-200 bg-white">
        <div className="divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="p-6 text-sm text-slate-600">No orders found.</div>
          ) : (
            filtered.map((o) => (
              <div key={o.id} className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="font-medium">Order {o.id.slice(0, 8).toUpperCase()}</div>
                    <StatusPill status={o.status} />
                  </div>
                  <div className="text-slate-600">
                    {new Date(o.createdAt).toLocaleString()} - {o.items.length} items
                  </div>
                  <div className="text-slate-600">
                    {o.shippingName}
                    {o.shippingEmail ? ` - ${o.shippingEmail}` : ""}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-semibold">${(o.totalCents / 100).toFixed(2)}</div>
                    <div className="text-xs text-slate-500">Total</div>
                  </div>

                  {o.status === "PENDING" ? (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="rounded-md bg-emerald-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
                        disabled={updatingId === o.id}
                        onClick={() => updateStatus(o.id, "CONFIRMED")}
                      >
                        Confirm
                      </button>
                      <button
                        type="button"
                        className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                        disabled={updatingId === o.id}
                        onClick={() => updateStatus(o.id, "REJECTED")}
                      >
                        Reject
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
