import Link from "next/link";
import { OrderUseCases } from "@/application/use-cases/orders";
import { getGuestKey } from "@/infrastructure/api/guest/session";
import { PrismaOrderRepository } from "@/infrastructure/repositories/PrismaOrderRepository";
import { InvoiceClientActions } from "@/app/orders/[id]/invoice/InvoiceClientActions";

export const dynamic = "force-dynamic";

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const guestKey = await getGuestKey();
  const { id } = await params;
  const order = guestKey
    ? await new OrderUseCases(new PrismaOrderRepository()).getByIdForGuestKey(id, guestKey)
    : null;

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

  const orderCode = order.id.slice(0, 8).toUpperCase();
  const created = new Date(order.createdAt).toLocaleString();

  return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 print:hidden">
          <Link className="text-sm text-slate-600 underline" href={`/orders/${order.id}`}>
            Back to order
          </Link>
          <InvoiceClientActions />
        </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 print:border-0 print:p-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-lg font-semibold tracking-tight">Invoice</div>
            <div className="text-sm text-slate-600">Order {orderCode}</div>
            <div className="text-sm text-slate-600">{created}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-600">Total</div>
            <div className="text-lg font-semibold">${(order.totalCents / 100).toFixed(2)}</div>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-md border border-slate-200 p-4 print:border-slate-300">
            <div className="text-sm font-semibold">Bill to</div>
            <div className="mt-2 text-sm text-slate-700">
              <div className="font-medium">{order.shippingName}</div>
              {order.shippingEmail ? <div className="text-slate-600">{order.shippingEmail}</div> : null}
              <div className="mt-2 text-slate-700">
                <div>{order.shippingAddress1}</div>
                {order.shippingAddress2 ? <div>{order.shippingAddress2}</div> : null}
                <div>
                  {order.shippingCity}, {order.shippingPostal}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-md border border-slate-200 p-4 print:border-slate-300">
            <div className="text-sm font-semibold">Payment</div>
            <div className="mt-2 text-sm text-slate-700">
              <div className="text-slate-600">Status: {order.status}</div>
              {order.paymentMethod ? (
                <div className="mt-2 text-slate-600">
                  Method: <span className="font-medium text-slate-900">{order.paymentMethod}</span>
                  {order.paymentReference ? (
                    <>
                      {" "}
                      - Ref: <span className="font-medium text-slate-900">{order.paymentReference}</span>
                    </>
                  ) : null}
                </div>
              ) : (
                <div className="mt-2 text-slate-600">
                  Pay via bKash or Nagad and submit your transaction/reference to get marked as paid.
                </div>
              )}

              {order.status !== "PAID" ? (
                <details className="mt-3 rounded-md border border-slate-200 bg-slate-50 p-3">
                  <summary className="cursor-pointer text-sm font-semibold text-slate-900">
                    Submit payment (bKash / Nagad / Manual)
                  </summary>
                  <form
                    className="mt-3 grid gap-3"
                    action={`/api/orders/${order.id}/payment`}
                    method="post"
                  >
                    <label className="grid gap-1 text-sm">
                      <span className="font-medium text-slate-900">Method</span>
                      <select
                        name="paymentMethod"
                        className="rounded-md border border-slate-200 bg-white px-3 py-2"
                        defaultValue="BKASH"
                      >
                        <option value="BKASH">bKash</option>
                        <option value="NAGAD">Nagad</option>
                        <option value="MANUAL">Manual</option>
                      </select>
                    </label>
                    <label className="grid gap-1 text-sm">
                      <span className="font-medium text-slate-900">Transaction / reference</span>
                      <input
                        name="paymentReference"
                        className="rounded-md border border-slate-200 bg-white px-3 py-2"
                        placeholder="e.g. TXN123456"
                        required
                      />
                    </label>
                    <button className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
                      Submit payment
                    </button>
                    <p className="text-xs text-slate-600">
                      After submission, this order will be marked as PAID.
                    </p>
                  </form>
                </details>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-md border border-slate-200 print:border-slate-300">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="px-4 py-3 font-semibold">Item</th>
                <th className="px-4 py-3 font-semibold">Qty</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 text-right font-semibold">Line total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items.map((it) => (
                <tr key={it.id}>
                  <td className="px-4 py-3 font-medium text-slate-900">{it.name}</td>
                  <td className="px-4 py-3 text-slate-700">{it.quantity}</td>
                  <td className="px-4 py-3 text-slate-700">
                    ${((it.priceCents / 100) as number).toFixed(2)}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-slate-900">
                    ${(((it.priceCents * it.quantity) / 100) as number).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex items-center justify-end gap-3 text-sm">
          <div className="text-slate-600">Total</div>
          <div className="text-base font-semibold text-slate-900">${(order.totalCents / 100).toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
}
