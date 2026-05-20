import Link from "next/link";
import { OrderUseCases } from "@/application/use-cases/orders";
import { PrismaOrderRepository } from "@/infrastructure/repositories/PrismaOrderRepository";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await new OrderUseCases(new PrismaOrderRepository()).listAll();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Orders</h2>
      <div className="rounded-lg border border-slate-200 bg-white">
        <div className="divide-y divide-slate-100">
          {orders.length === 0 ? (
            <div className="p-6 text-sm text-slate-600">No orders yet.</div>
          ) : (
            orders.map((o) => (
              <div key={o.id} className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
                <div className="space-y-1">
                  <div className="font-medium">Order {o.id.slice(0, 8).toUpperCase()}</div>
                  <div className="text-slate-600">
                    {new Date(o.createdAt).toLocaleString()} • {o.items.length} items
                  </div>
                  <div className="text-slate-600">
                    {o.shippingName} • {o.shippingEmail}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${(o.totalCents / 100).toFixed(2)}</div>
                  <Link className="text-slate-700 underline" href={`/orders/${o.id}`}>
                    View as user
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
