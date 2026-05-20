"use client";

import Link from "next/link";
import { useCartStore } from "@/presentation/stores/cartStore";
import { useMe } from "@/presentation/hooks/useMe";

export function Navbar() {
  const itemsCount = useCartStore((s) =>
    s.items.reduce((sum, it) => sum + it.quantity, 0)
  );
  const { user, loading } = useMe();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link className="font-semibold tracking-tight" href="/">
          Shoplytic
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link className="text-slate-700 hover:text-slate-900" href="/products">
            Products
          </Link>
          <Link className="text-slate-700 hover:text-slate-900" href="/cart">
            Cart ({itemsCount})
          </Link>
          <Link className="text-slate-700 hover:text-slate-900" href="/orders">
            Orders
          </Link>
          <Link className="text-slate-700 hover:text-slate-900" href="/login">
            Login
          </Link>
          <Link className="text-slate-700 hover:text-slate-900" href="/register">
            Register
          </Link>

          {loading ? (
            <span className="text-slate-400">Loading...</span>
          ) : user ? (
            <>
              <Link className="text-slate-700 hover:text-slate-900" href="/profile">
                Profile
              </Link>
              {user.role === "ADMIN" ? (
                <details className="relative">
                  <summary className="cursor-pointer list-none text-slate-700 hover:text-slate-900">
                    Settings
                  </summary>
                  <div className="absolute right-0 z-50 mt-2 w-64 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
                    <Link
                      className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      href="/admin/products/new"
                    >
                      Add product
                    </Link>
                    <Link
                      className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      href="/admin/users"
                    >
                      Users / Customer history
                    </Link>
                    <Link
                      className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      href="/admin/orders"
                    >
                      Order history
                    </Link>
                    <div className="my-1 border-t border-slate-100" />
                    <Link
                      className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      href="/admin/orders?status=PENDING"
                    >
                      Pending orders
                    </Link>
                    <Link
                      className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      href="/admin/orders?status=CONFIRMED"
                    >
                      Confirmed orders
                    </Link>
                    <Link
                      className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      href="/admin/orders?status=REJECTED"
                    >
                      Rejected orders
                    </Link>
                    <Link
                      className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      href="/admin/settings"
                    >
                      Settings (password)
                    </Link>
                  </div>
                </details>
              ) : null}
            </>
          ) : (
            null
          )}

          <button
            className="rounded-md border border-slate-200 bg-white px-2 py-1 text-slate-700 hover:text-slate-900"
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = "/";
            }}
          >
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
