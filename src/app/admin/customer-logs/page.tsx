import { OrderUseCases } from "@/application/use-cases/orders";
import { PrismaOrderRepository } from "@/infrastructure/repositories/PrismaOrderRepository";
import { formatDateTime, formatMoneyFromCents } from "@/shared/utils/format";

export const dynamic = "force-dynamic";

export default async function AdminCustomerLogsPage() {
  const orders = await new OrderUseCases(new PrismaOrderRepository()).listAll();

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Customer logs</h2>
        <p className="text-sm text-slate-600">Every order record with customer contact and product names.</p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white">
        <div className="divide-y divide-slate-100">
          {orders.length === 0 ? (
            <div className="p-6 text-sm text-slate-600">No customer logs yet.</div>
          ) : (
            orders.map((o) => {
              const productNames = Array.from(new Set(o.items.map((it) => it.name))).join(", ");
              return (
                <div key={o.id} className="p-4 text-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="font-medium">{o.shippingName}</div>
                      <div className="text-slate-600">
                        {o.shippingPhone ? `Phone: ${o.shippingPhone}` : "Phone: Not saved (run prisma migrate)"} 
                        {o.shippingEmail ? ` • Email: ${o.shippingEmail}` : " • Email: —"}
                      </div>
                      <div className="text-slate-600">Products: {productNames || "—"}</div>
                    </div>
                    <div className="text-right text-slate-600">
                      <div>{formatDateTime(o.createdAt)}</div>
                      <div className="font-semibold text-slate-900">{formatMoneyFromCents(o.totalCents)}</div>
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
