import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Link className="rounded-lg border border-slate-200 bg-white p-5 hover:border-slate-300" href="/admin/products">
        <div className="font-semibold">Product management</div>
        <div className="mt-1 text-sm text-slate-600">Add, edit, and delete products.</div>
      </Link>
      <Link className="rounded-lg border border-slate-200 bg-white p-5 hover:border-slate-300" href="/admin/orders">
        <div className="font-semibold">Orders</div>
        <div className="mt-1 text-sm text-slate-600">View incoming orders.</div>
      </Link>
      <Link className="rounded-lg border border-slate-200 bg-white p-5 hover:border-slate-300" href="/admin/users">
        <div className="font-semibold">Users</div>
        <div className="mt-1 text-sm text-slate-600">View registered users.</div>
      </Link>
    </div>
  );
}

