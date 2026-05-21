"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatDateTime, formatMoneyFromCents } from "@/shared/utils/format";

export type DeliveryAgentLite = {
  id: string;
  name: string;
  phone: string;
  status: "ACTIVE" | "INACTIVE";
};

export type DeliveryRow = {
  orderId: string;
  agentId: string;
  status: "ASSIGNED" | "PENDING" | "COMPLETED" | "CANCELED";
  paymentStatus: "UNPAID" | "PAID" | "COD";
  deliveryChargeCents: number;
  totalAmountCents: number;
  deliveryDate: string | Date | null;
  createdAt: string | Date;
  customerSnapshot: { name: string; phone: string | null; email: string | null };
};

export type OrderRow = {
  id: string;
  status: string;
  totalCents: number;
  createdAt: string | Date;
  shippingName: string;
  shippingPhone: string | null;
};

export function DeliveriesClient(props: {
  initialAgents: DeliveryAgentLite[];
  initialOrders: OrderRow[];
  initialDeliveries: DeliveryRow[];
  initialFilter?: "ALL" | "ASSIGNED" | "PENDING" | "COMPLETED" | "CANCELED";
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [workingId, setWorkingId] = useState<string | null>(null);

  const [filter, setFilter] = useState(props.initialFilter ?? "ALL");
  const agents = useMemo(() => props.initialAgents, [props.initialAgents]);
  const orders = useMemo(() => props.initialOrders, [props.initialOrders]);
  const deliveries = useMemo(() => props.initialDeliveries, [props.initialDeliveries]);

  const deliveriesByOrderId = useMemo(() => {
    const map = new Map<string, DeliveryRow>();
    for (const d of deliveries) map.set(d.orderId, d);
    return map;
  }, [deliveries]);

  const agentById = useMemo(() => {
    const map = new Map<string, DeliveryAgentLite>();
    for (const a of agents) map.set(a.id, a);
    return map;
  }, [agents]);

  const visibleOrders = useMemo(() => {
    const rows = orders.map((o) => ({ order: o, delivery: deliveriesByOrderId.get(o.id) ?? null }));
    if (filter === "ALL") return rows;
    return rows.filter((r) => r.delivery?.status === filter);
  }, [orders, deliveriesByOrderId, filter]);

  function setFilterAndUrl(next: typeof filter) {
    setFilter(next);
    const sp = new URLSearchParams(searchParams.toString());
    sp.set("status", next);
    router.push(`/admin/deliveries?${sp.toString()}`);
  }

  async function assign(orderId: string, agentId: string) {
    setError(null);
    setWorkingId(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/delivery`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ agentId, deliveryChargeCents: 0, status: "ASSIGNED", paymentStatus: "UNPAID", deliveryDate: null })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Assign failed");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Assign failed");
    } finally {
      setWorkingId(null);
    }
  }

  async function updateDelivery(orderId: string, patch: Partial<Pick<DeliveryRow, "status" | "paymentStatus" | "deliveryChargeCents" | "deliveryDate">>) {
    setError(null);
    setWorkingId(orderId);
    try {
      const existing = deliveriesByOrderId.get(orderId);
      if (!existing) throw new Error("Delivery not found");
      const res = await fetch(`/api/admin/orders/${orderId}/delivery`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          agentId: existing.agentId,
          deliveryChargeCents: patch.deliveryChargeCents ?? existing.deliveryChargeCents ?? 0,
          status: patch.status ?? existing.status ?? "ASSIGNED",
          paymentStatus: patch.paymentStatus ?? existing.paymentStatus ?? "UNPAID",
          deliveryDate: patch.deliveryDate ?? existing.deliveryDate ?? null
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Update failed");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    } finally {
      setWorkingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Deliveries</h2>
          <p className="text-sm text-slate-600">Assign orders to delivery agents and track delivery status.</p>
        </div>
        <div className="flex flex-wrap gap-2 text-sm">
          {(["ALL", "ASSIGNED", "PENDING", "COMPLETED", "CANCELED"] as const).map((v) => (
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
          {visibleOrders.length === 0 ? (
            <div className="p-6 text-sm text-slate-600">No deliveries found.</div>
          ) : (
            visibleOrders.map(({ order, delivery }) => {
              const agent = delivery ? agentById.get(delivery.agentId) : null;
              return (
                <div key={order.id} className="p-4 text-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="font-medium">Order {order.id.slice(0, 8).toUpperCase()}</div>
                      <div className="text-slate-600">{formatDateTime(order.createdAt)} • {formatMoneyFromCents(order.totalCents)}</div>
                      <div className="text-slate-600">Customer: {order.shippingName} • Phone: {order.shippingPhone ?? "—"}</div>

                      {delivery ? (
                        <div className="text-slate-700">
                          <div>
                            Agent: <span className="font-semibold">{agent ? `${agent.name} (${agent.phone})` : delivery.agentId}</span>
                          </div>
                          <div className="text-slate-600">
                            Delivery status: <span className="font-semibold text-slate-900">{delivery.status}</span> • Payment:{" "}
                            <span className="font-semibold text-slate-900">{delivery.paymentStatus}</span> • Delivery charge:{" "}
                            <span className="font-semibold text-slate-900">{formatMoneyFromCents(delivery.deliveryChargeCents)}</span> • Total:{" "}
                            <span className="font-semibold text-slate-900">{formatMoneyFromCents(delivery.totalAmountCents)}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="text-slate-600">Not assigned to any agent yet.</div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {!delivery ? (
                        <>
                          <select
                            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                            defaultValue=""
                            onChange={(e) => {
                              const val = e.target.value;
                              if (!val) return;
                              assign(order.id, val);
                              e.target.value = "";
                            }}
                            disabled={workingId === order.id || agents.length === 0}
                          >
                            <option value="">Assign agent...</option>
                            {agents
                              .filter((a) => a.status === "ACTIVE")
                              .map((a) => (
                                <option key={a.id} value={a.id}>
                                  {a.name} ({a.phone})
                                </option>
                              ))}
                          </select>
                        </>
                      ) : (
                        <>
                          <select
                            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                            value={delivery.status}
                            onChange={(e) => updateDelivery(order.id, { status: e.target.value as any })}
                            disabled={workingId === order.id}
                          >
                            <option value="ASSIGNED">ASSIGNED</option>
                            <option value="PENDING">PENDING</option>
                            <option value="COMPLETED">COMPLETED</option>
                            <option value="CANCELED">CANCELED</option>
                          </select>

                          <select
                            className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                            value={delivery.paymentStatus}
                            onChange={(e) => updateDelivery(order.id, { paymentStatus: e.target.value as any })}
                            disabled={workingId === order.id}
                          >
                            <option value="UNPAID">UNPAID</option>
                            <option value="PAID">PAID</option>
                            <option value="COD">COD</option>
                          </select>

                          <label className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm">
                            <span className="text-slate-600">Charge</span>
                            <input
                              className="w-24 bg-transparent outline-none"
                              type="number"
                              min={0}
                              step={1}
                              defaultValue={delivery.deliveryChargeCents}
                              onBlur={(e) => {
                                const next = Number(e.target.value);
                                if (Number.isFinite(next) && next !== delivery.deliveryChargeCents) updateDelivery(order.id, { deliveryChargeCents: next });
                              }}
                              disabled={workingId === order.id}
                            />
                          </label>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
