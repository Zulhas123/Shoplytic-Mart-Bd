"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export function LoginClient() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/products";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="mx-auto max-w-md space-y-4 rounded-lg border border-slate-200 bg-white p-6">
      <h1 className="text-xl font-semibold">Login</h1>
      <p className="text-sm text-slate-600">
        New here?{" "}
        <Link className="underline" href="/register">
          Create an account
        </Link>
        .
      </p>
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
              body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error ?? "Login failed");
            router.push(next);
            router.refresh();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed");
          } finally {
            setLoading(false);
          }
        }}
      >
        <label className="block space-y-1">
          <span className="text-sm font-medium">Email</span>
          <input
            className="w-full rounded-md border border-slate-200 px-3 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
          />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Password</span>
          <input
            className="w-full rounded-md border border-slate-200 px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
          />
        </label>
        <button
          className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          disabled={loading}
          type="submit"
        >
          {loading ? "Signing in…" : "Login"}
        </button>
      </form>
    </div>
  );
}

