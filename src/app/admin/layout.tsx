import Link from "next/link";
import { requireAdmin } from "@/infrastructure/api/auth/session";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false }
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
          <p className="text-sm text-slate-600">Minimal dashboard.</p>
        </div>
        <nav className="flex flex-wrap gap-2 text-sm">
          <Link className="rounded-md border border-slate-200 bg-white px-3 py-2" href="/admin">
            Overview
          </Link>
          <Link
            className="rounded-md border border-slate-200 bg-white px-3 py-2"
            href="/admin/products"
          >
            Products
          </Link>
          <Link
            className="rounded-md border border-slate-200 bg-white px-3 py-2"
            href="/admin/categories"
          >
            Categories
          </Link>
          <Link
            className="rounded-md border border-slate-200 bg-white px-3 py-2"
            href="/admin/orders"
          >
            Orders
          </Link>
          <Link
            className="rounded-md border border-slate-200 bg-white px-3 py-2"
            href="/admin/users"
          >
            Users
          </Link>
          <Link
            className="rounded-md border border-slate-200 bg-white px-3 py-2"
            href="/admin/customer-logs"
          >
            Customer logs
          </Link>
          <Link
            className="rounded-md border border-slate-200 bg-white px-3 py-2"
            href="/admin/delivery-agents"
          >
            Delivery agents
          </Link>
          <Link
            className="rounded-md border border-slate-200 bg-white px-3 py-2"
            href="/admin/deliveries"
          >
            Deliveries
          </Link>
          <Link
            className="rounded-md border border-slate-200 bg-white px-3 py-2"
            href="/admin/delivery-reports"
          >
            Delivery reports
          </Link>
        </nav>
      </div>
      {children}
    </div>
  );
}
