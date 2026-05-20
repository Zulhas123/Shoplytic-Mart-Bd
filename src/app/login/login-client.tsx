"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function LoginClient() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/products";

  const [name, setName] = useState("admin");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="mx-auto max-w-md space-y-4 rounded-lg border border-slate-200 bg-white p-6">
      <h1 className="text-xl font-semibold">Admin login</h1>
      <p className="text-sm text-slate-600">Customers do not need an account.</p>

      {error ? <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

      <form
        className="space-y-3"
        onSubmit={async (e) => {
          e.preventDefault();
          setError(null);
          setLoading(true);
          try {
            const res = await fetch("/api/auth/login", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ name, password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error ?? "Login failed");
            window.location.href = next;
          } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed");
          } finally {
            setLoading(false);
          }
        }}
      >
        <label className="block space-y-1">
          <span className="text-sm font-medium">Username</span>
          <input
            className="w-full rounded-md border border-slate-200 px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="username"
            required
            disabled={loading}
          />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Password</span>
          <input
            className="w-full rounded-md border border-slate-200 px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            autoComplete="current-password"
            required
            disabled={loading}
          />
        </label>
        <button
          className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          disabled={loading}
          type="submit"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>

      <p className="text-xs text-slate-500">
        Admin credentials: admin / admin123. Admin user is created automatically after the first
        successful login.
      </p>
    </div>
  );
}
