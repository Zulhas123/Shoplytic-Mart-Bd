import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold tracking-tight">Shoplytic</h1>
      <p className="text-slate-600">
        Simple Commerce. Fast Shopping. Clean Experience.
      </p>
      <div className="flex flex-wrap gap-3">
        <Link
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
          href="/products"
        >
          Browse products
        </Link>
        <Link
          className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-medium"
          href="/cart"
        >
          View cart
        </Link>
      </div>
    </div>
  );
}

