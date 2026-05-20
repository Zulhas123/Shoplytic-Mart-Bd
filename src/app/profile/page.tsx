"use client";

import { useEffect, useState } from "react";

type Profile = {
  id: string;
  email: string | null;
  name: string;
  address: string | null;
  role: "USER" | "ADMIN";
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let canceled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/auth/me", { cache: "no-store" });
        const data = await res.json();
        if (!canceled) {
          setProfile(data.user ?? null);
          setName(data.user?.name ?? "");
          setAddress(data.user?.address ?? "");
        }
      } finally {
        if (!canceled) setLoading(false);
      }
    })();
    return () => {
      canceled = true;
    };
  }, []);

  if (loading) return <div className="text-sm text-slate-600">Loading...</div>;
  if (!profile) return <div className="text-sm text-slate-600">Not logged in.</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="text-sm text-slate-600">
          Signed in as <span className="font-medium text-slate-900">{profile.name}</span> ({profile.role})
        </div>

        {error ? (
          <p className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>
        ) : null}

        <form
          className="mt-4 grid gap-3"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            setSaving(true);
            try {
              const res = await fetch("/api/profile", {
                method: "PUT",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ name, address: address.trim() ? address : null })
              });
              const data = await res.json();
              if (!res.ok) throw new Error(data?.error ?? "Save failed");
              setProfile(data.user);
            } catch (err) {
              setError(err instanceof Error ? err.message : "Save failed");
            } finally {
              setSaving(false);
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
            <span className="text-sm font-medium">Address</span>
            <input
              className="w-full rounded-md border border-slate-200 px-3 py-2"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Street, city..."
            />
          </label>
          <button
            className="mt-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            disabled={saving}
            type="submit"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
