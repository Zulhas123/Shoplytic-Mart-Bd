"use client";

import Link from "next/link";
import { useCartStore } from "@/presentation/stores/cartStore";
import { useMe } from "@/presentation/hooks/useMe";
import { useEffect, useRef, useState } from "react";

export function Navbar() {
  const itemsCount = useCartStore((s) =>
    s.items.reduce((sum, it) => sum + it.quantity, 0)
  );
  const { user, loading } = useMe();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onPointerDown(e: MouseEvent | TouchEvent) {
      if (!settingsOpen) return;
      const target = e.target as Node | null;
      if (!target) return;
      if (settingsRef.current && !settingsRef.current.contains(target)) {
        setSettingsOpen(false);
      }
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [settingsOpen]);

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
          <Link className="text-slate-700 hover:text-slate-900" href="/manual">
            User manual
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
                Profile ({user.name})
              </Link>
              {user.role === "ADMIN" ? (
                <div className="relative" ref={settingsRef}>
                  <button
                    type="button"
                    className="text-slate-700 hover:text-slate-900"
                    aria-haspopup="menu"
                    aria-expanded={settingsOpen}
                    onClick={() => setSettingsOpen((v) => !v)}
                  >
                    Settings
                  </button>
                  <div
                    className={[
                      "absolute right-0 z-50 mt-2 w-64 rounded-lg border border-slate-200 bg-white p-2 shadow-lg",
                      settingsOpen ? "block" : "hidden"
                    ].join(" ")}
                    role="menu"
                    aria-label="Admin settings"
                  >
                    <Link
                      className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      href="/admin/products/new"
                      onClick={() => setSettingsOpen(false)}
                    >
                      Add product
                    </Link>
                    <Link
                      className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      href="/admin/users"
                      onClick={() => setSettingsOpen(false)}
                    >
                      Users / Customer history
                    </Link>
                    <Link
                      className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      href="/admin/customer-logs"
                      onClick={() => setSettingsOpen(false)}
                    >
                      Customer logs
                    </Link>
                    <Link
                      className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      href="/admin/delivery-agents"
                      onClick={() => setSettingsOpen(false)}
                    >
                      Delivery agents
                    </Link>
                    <Link
                      className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      href="/admin/deliveries"
                      onClick={() => setSettingsOpen(false)}
                    >
                      Deliveries
                    </Link>
                    <Link
                      className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      href="/admin/delivery-reports"
                      onClick={() => setSettingsOpen(false)}
                    >
                      Delivery reports
                    </Link>
                    <Link
                      className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      href="/admin/orders"
                      onClick={() => setSettingsOpen(false)}
                    >
                      Order history
                    </Link>
                    <div className="my-1 border-t border-slate-100" />
                    <Link
                      className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      href="/admin/orders?status=PENDING"
                      onClick={() => setSettingsOpen(false)}
                    >
                      Pending orders
                    </Link>
                    <Link
                      className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      href="/admin/orders?status=CONFIRMED"
                      onClick={() => setSettingsOpen(false)}
                    >
                      Confirmed orders
                    </Link>
                    <Link
                      className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      href="/admin/orders?status=REJECTED"
                      onClick={() => setSettingsOpen(false)}
                    >
                      Rejected orders
                    </Link>
                    <Link
                      className="block rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                      href="/admin/settings"
                      onClick={() => setSettingsOpen(false)}
                    >
                      Settings (password)
                    </Link>
                  </div>
                </div>
              ) : null}
              <button
                className="rounded-md border border-slate-200 bg-white px-2 py-1 text-slate-700 hover:text-slate-900"
                onClick={async () => {
                  await fetch("/api/auth/logout", { method: "POST" });
                  window.location.href = "/";
                }}
              >
                Logout
              </button>
            </>
          ) : (
            null
          )}
        </nav>
      </div>
    </header>
  );
}
