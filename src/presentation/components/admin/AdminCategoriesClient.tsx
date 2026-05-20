"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export function AdminCategoriesClient(props: { initialCategories: Array<{ id: string; name: string }> }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const categories = useMemo(() => props.initialCategories, [props.initialCategories]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Categories</h2>

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        {error ? <p className="mb-3 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
        <form
          className="flex flex-wrap items-end gap-3"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);
            setLoading(true);
            try {
              const res = await fetch("/api/categories", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ name })
              });
              const data = await res.json();
              if (!res.ok) throw new Error(data?.error ?? "Create failed");
              setName("");
              router.refresh();
            } catch (err) {
              setError(err instanceof Error ? err.message : "Create failed");
            } finally {
              setLoading(false);
            }
          }}
        >
          <label className="block flex-1 space-y-1">
            <span className="text-sm font-medium">New category</span>
            <input
              className="w-full rounded-md border border-slate-200 px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Shoes"
              required
            />
          </label>
          <button
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
            disabled={loading}
            type="submit"
          >
            {loading ? "Creating…" : "Create"}
          </button>
        </form>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white">
        <div className="divide-y divide-slate-100">
          {categories.length === 0 ? (
            <div className="p-6 text-sm text-slate-600">No categories yet.</div>
          ) : (
            categories.map((c) => (
              <div key={c.id} className="p-4 text-sm">
                <div className="font-medium">{c.name}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

