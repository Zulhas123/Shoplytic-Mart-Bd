import Link from "next/link";
import { OrderUseCases } from "@/application/use-cases/orders";
import { getGuestKey } from "@/infrastructure/api/guest/session";
import { PrismaOrderRepository } from "@/infrastructure/repositories/PrismaOrderRepository";
import { formatDateTime, formatMoneyFromCents } from "@/shared/utils/format";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const guestKey = await getGuestKey();
  const orders = guestKey
    ? await new OrderUseCases(new PrismaOrderRepository()).listByGuestKey(guestKey)
    : [];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>

      {orders.length === 0 ? (
        <div className="rounded-lg border border-slate-200 bg-white p-6 text-sm text-slate-600">
          No orders yet.
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white">
          <div className="divide-y divide-slate-100">
            {orders.map((o) => (
              <div key={o.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="space-y-1">
                  <Link className="font-medium hover:underline" href={`/orders/${o.id}`}>
                    Order {o.id.slice(0, 8).toUpperCase()}
                  </Link>
                  <div className="text-sm text-slate-600">
                    {formatDateTime(o.createdAt)} • {o.items.length} items
                  </div>
                  <div className="text-sm text-slate-600">Phone: {o.shippingPhone ?? "Not saved (run prisma migrate)"}</div>
                </div>
                <div className="text-sm font-semibold">{formatMoneyFromCents(o.totalCents)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
