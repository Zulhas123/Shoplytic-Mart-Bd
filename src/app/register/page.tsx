"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="mx-auto max-w-md space-y-4 rounded-lg border border-slate-200 bg-white p-6">
      <h1 className="text-xl font-semibold">Create account</h1>
      <p className="text-sm text-slate-600">
        Already have an account?{" "}
        <Link className="underline" href="/login">
          Login
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
            const res = await fetch("/api/auth/register", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                name,
                email,
                address: address.trim() ? address : null,
                password
              })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error ?? "Registration failed");
            router.push("/products");
            router.refresh();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Registration failed");
          } finally {
            setLoading(false);
          }
        }}
      >
        <label className="block space-y-1">
          <span className="text-sm font-medium">Name</span>
          <input
            className="w-full rounded-md border border-slate-200 px-3 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
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
          <span className="text-sm font-medium">Address (optional)</span>
          <input
            className="w-full rounded-md border border-slate-200 px-3 py-2"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Street, city…"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Password</span>
          <input
            className="w-full rounded-md border border-slate-200 px-3 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            minLength={8}
            required
          />
        </label>
        <button
          className="w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          disabled={loading}
          type="submit"
        >
          {loading ? "Creating…" : "Create account"}
        </button>
      </form>
    </div>
  );
}

