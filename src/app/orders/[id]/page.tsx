import Link from "next/link";
import { OrderUseCases } from "@/application/use-cases/orders";
import { requireSession } from "@/infrastructure/api/auth/session";
import { PrismaOrderRepository } from "@/infrastructure/repositories/PrismaOrderRepository";

export const dynamic = "force-dynamic";

export default async function OrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await requireSession();
  const { id } = await params;
  const order = await new OrderUseCases(new PrismaOrderRepository()).getByIdForUser(id, session.userId);

  if (!order) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-slate-600">Order not found.</p>
        <Link className="underline" href="/orders">
          Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Link className="text-sm text-slate-600 underline" href="/orders">
        Back to orders
      </Link>
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">Order {order.id.slice(0, 8).toUpperCase()}</h1>
            <p className="text-sm text-slate-600">{new Date(order.createdAt).toLocaleString()}</p>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-600">Total</div>
            <div className="text-lg font-semibold">${(order.totalCents / 100).toFixed(2)}</div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          <div className="rounded-md border border-slate-200 p-4">
            <h2 className="text-sm font-semibold">Shipping</h2>
            <div className="mt-2 text-sm text-slate-700">
              <div>{order.shippingName}</div>
              <div className="text-slate-600">{order.shippingEmail}</div>
              <div className="mt-2">
                <div>{order.shippingAddress1}</div>
                {order.shippingAddress2 ? <div>{order.shippingAddress2}</div> : null}
                <div>
                  {order.shippingCity}, {order.shippingPostal}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-slate-200 p-4">
            <h2 className="text-sm font-semibold">Items</h2>
            <div className="mt-3 space-y-3">
              {order.items.map((it) => (
                <div key={it.id} className="flex items-center justify-between text-sm">
                  <div className="min-w-0">
                    <div className="truncate font-medium">{it.name}</div>
                    <div className="text-slate-600">Qty: {it.quantity}</div>
                  </div>
                  <div className="font-medium">
                    ${((it.priceCents * it.quantity) / 100).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
