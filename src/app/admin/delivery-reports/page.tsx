import { DeliveryUseCases } from "@/application/use-cases/delivery";
import { PrismaDeliveryRepository } from "@/infrastructure/repositories/PrismaDeliveryRepository";
import { formatMoneyFromCents } from "@/shared/utils/format";

export const dynamic = "force-dynamic";

function dateKey(d: Date) {
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function monthKey(d: Date) {
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, "0");
  return `${year}-${month}`;
}

export default async function DeliveryReportsPage() {
  const useCases = new DeliveryUseCases(new PrismaDeliveryRepository());
  const [agents, deliveries] = await Promise.all([useCases.listAgents(), useCases.listDeliveries()]);

  const agentById = new Map(agents.map((a) => [a.id, a]));

  const agentSummary: Array<{
    agentId: string;
    agentName: string;
    phone: string;
    assigned: number;
    pending: number;
    completed: number;
    canceled: number;
    earningsCents: number;
  }> = [];

  for (const a of agents) {
    const ds = deliveries.filter((d) => d.agentId === a.id);
    const assigned = ds.filter((d) => d.status === "ASSIGNED").length;
    const pending = ds.filter((d) => d.status === "PENDING").length;
    const completed = ds.filter((d) => d.status === "COMPLETED").length;
    const canceled = ds.filter((d) => d.status === "CANCELED").length;
    const earningsCents = ds.filter((d) => d.status === "COMPLETED").reduce((sum, d) => sum + d.deliveryChargeCents, 0);
    agentSummary.push({ agentId: a.id, agentName: a.name, phone: a.phone, assigned, pending, completed, canceled, earningsCents });
  }

  agentSummary.sort((a, b) => b.completed - a.completed);

  const categorySalesCents: Record<string, number> = {};
  for (const d of deliveries) {
    const breakdown = d.categoryBreakdown ?? {};
    for (const [cat, amountCents] of Object.entries(breakdown)) {
      categorySalesCents[cat] = (categorySalesCents[cat] ?? 0) + (amountCents ?? 0);
    }
  }

  const topCategories = Object.entries(categorySalesCents)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const dailyCounts: Record<string, { total: number; completed: number }> = {};
  const monthlyCounts: Record<string, { total: number; completed: number }> = {};
  for (const d of deliveries) {
    const baseDate = d.deliveryDate ?? d.createdAt;
    const dk = dateKey(new Date(baseDate));
    dailyCounts[dk] = dailyCounts[dk] ?? { total: 0, completed: 0 };
    dailyCounts[dk].total += 1;
    if (d.status === "COMPLETED") dailyCounts[dk].completed += 1;

    const mk = monthKey(new Date(baseDate));
    monthlyCounts[mk] = monthlyCounts[mk] ?? { total: 0, completed: 0 };
    monthlyCounts[mk].total += 1;
    if (d.status === "COMPLETED") monthlyCounts[mk].completed += 1;
  }

  const daily = Object.entries(dailyCounts).sort((a, b) => (a[0] < b[0] ? 1 : -1)).slice(0, 14);
  const monthly = Object.entries(monthlyCounts).sort((a, b) => (a[0] < b[0] ? 1 : -1)).slice(0, 12);

  const totalDeliveries = deliveries.length;
  const completedDeliveries = deliveries.filter((d) => d.status === "COMPLETED").length;
  const totalEarningsCents = deliveries.filter((d) => d.status === "COMPLETED").reduce((sum, d) => sum + d.deliveryChargeCents, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Delivery reports</h2>
        <p className="text-sm text-slate-600">Agent-wise summaries, earnings, category-wise sales, and daily/monthly performance.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="text-xs text-slate-500">Total deliveries</div>
          <div className="text-xl font-semibold">{totalDeliveries}</div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="text-xs text-slate-500">Completed deliveries</div>
          <div className="text-xl font-semibold">{completedDeliveries}</div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="text-xs text-slate-500">Delivery charge earnings</div>
          <div className="text-xl font-semibold">{formatMoneyFromCents(totalEarningsCents)}</div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white">
        <div className="border-b border-slate-100 p-4">
          <div className="font-semibold">Agent-wise delivery summary</div>
        </div>
        <div className="divide-y divide-slate-100">
          {agentSummary.length === 0 ? (
            <div className="p-6 text-sm text-slate-600">No agents yet.</div>
          ) : (
            agentSummary.map((row) => (
              <div key={row.agentId} className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm">
                <div>
                  <div className="font-medium">{row.agentName}</div>
                  <div className="text-slate-600">{row.phone}</div>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-700">
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1">Assigned: {row.assigned}</span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1">Pending: {row.pending}</span>
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-emerald-700">Completed: {row.completed}</span>
                  <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1">Canceled: {row.canceled}</span>
                  <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2 py-1 text-indigo-700">Earnings: {formatMoneyFromCents(row.earningsCents)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white">
          <div className="border-b border-slate-100 p-4">
            <div className="font-semibold">Category-wise sales (top 10)</div>
            <div className="text-xs text-slate-500">Based on delivered order item totals.</div>
          </div>
          <div className="divide-y divide-slate-100">
            {topCategories.length === 0 ? (
              <div className="p-6 text-sm text-slate-600">No sales data yet.</div>
            ) : (
              topCategories.map(([cat, cents]) => (
                <div key={cat} className="flex items-center justify-between gap-3 p-4 text-sm">
                  <div className="font-medium">{cat}</div>
                  <div className="font-semibold">{formatMoneyFromCents(cents)}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white">
            <div className="border-b border-slate-100 p-4">
              <div className="font-semibold">Daily performance (last 14 days)</div>
            </div>
            <div className="divide-y divide-slate-100">
              {daily.length === 0 ? (
                <div className="p-6 text-sm text-slate-600">No delivery activity yet.</div>
              ) : (
                daily.map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between gap-3 p-4 text-sm">
                    <div className="font-medium">{k}</div>
                    <div className="text-slate-700">
                      Total: <span className="font-semibold">{v.total}</span> • Completed:{" "}
                      <span className="font-semibold">{v.completed}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white">
            <div className="border-b border-slate-100 p-4">
              <div className="font-semibold">Monthly performance (last 12 months)</div>
            </div>
            <div className="divide-y divide-slate-100">
              {monthly.length === 0 ? (
                <div className="p-6 text-sm text-slate-600">No delivery activity yet.</div>
              ) : (
                monthly.map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between gap-3 p-4 text-sm">
                    <div className="font-medium">{k}</div>
                    <div className="text-slate-700">
                      Total: <span className="font-semibold">{v.total}</span> • Completed:{" "}
                      <span className="font-semibold">{v.completed}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

