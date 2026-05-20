"use client";

import { useState } from "react";

export default function AdminSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-slate-600">Change the admin password.</p>
      </div>

      {error ? <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      {success ? <p className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-700">{success}</p> : null}

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <form
          className="grid gap-3"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            setSuccess(null);
            setLoading(true);
            try {
              const res = await fetch("/api/admin/settings/password", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword })
              });
              const data = await res.json();
              if (!res.ok) throw new Error(data?.error ?? "Update failed");
              setCurrentPassword("");
              setNewPassword("");
              setSuccess("Password updated.");
            } catch (err) {
              setError(err instanceof Error ? err.message : "Update failed");
            } finally {
              setLoading(false);
            }
          }}
        >
          <label className="block space-y-1">
            <span className="text-sm font-medium">Current password</span>
            <input
              className="w-full rounded-md border border-slate-200 px-3 py-2"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
              required
              minLength={8}
            />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium">New password</span>
            <input
              className="w-full rounded-md border border-slate-200 px-3 py-2"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
            />
          </label>
          <button
            className="mt-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            disabled={loading}
            type="submit"
          >
            {loading ? "Updating..." : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}

