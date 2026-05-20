"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

export function ProductForm(props:
  | { mode: "create" }
  | {
      mode: "edit";
      product: {
        id: string;
        name: string;
        description: string;
        priceCents: number;
        imageUrl: string | null;
        categoryId: string | null;
      };
    }) {
  const router = useRouter();
  const [name, setName] = useState(props.mode === "edit" ? props.product.name : "");
  const [description, setDescription] = useState(props.mode === "edit" ? props.product.description : "");
  const [price, setPrice] = useState(props.mode === "edit" ? (props.product.priceCents / 100).toFixed(2) : "0.00");
  const [imageUrl, setImageUrl] = useState(props.mode === "edit" ? props.product.imageUrl ?? "" : "");
  const [categoryId, setCategoryId] = useState(props.mode === "edit" ? props.product.categoryId ?? "" : "");
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let canceled = false;
    (async () => {
      try {
        const res = await fetch("/api/categories", { cache: "no-store" });
        const data = await res.json();
        if (!canceled) setCategories(data.categories ?? []);
      } catch {
        if (!canceled) setCategories([]);
      }
    })();
    return () => {
      canceled = true;
    };
  }, []);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      {error ? <p className="mb-3 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      <form
        className="grid gap-3"
        onSubmit={async (e) => {
          e.preventDefault();
          setError(null);
          setLoading(true);
          try {
            const priceCents = Math.round(Number(price) * 100);
            const payload = {
              name,
              description,
              priceCents,
              imageUrl: imageUrl.trim() ? imageUrl : null,
              categoryId: categoryId || null
            };
            const url = props.mode === "edit" ? `/api/products/${props.product.id}` : "/api/products";
            const method = props.mode === "edit" ? "PUT" : "POST";
            const res = await fetch(url, {
              method,
              headers: { "content-type": "application/json" },
              body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error ?? "Save failed");
            router.push("/admin/products");
            router.refresh();
          } catch (err) {
            setError(err instanceof Error ? err.message : "Save failed");
          } finally {
            setLoading(false);
          }
        }}
      >
        <label className="block space-y-1">
          <span className="text-sm font-medium">Name</span>
          <input className="w-full rounded-md border border-slate-200 px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label className="block space-y-1">
          <span className="text-sm font-medium">Description</span>
          <textarea className="min-h-28 w-full rounded-md border border-slate-200 px-3 py-2" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </label>
        <label className="block space-y-1">
          <span className="flex items-center justify-between gap-2 text-sm font-medium">
            <span>Category</span>
            <Link className="text-xs underline" href="/admin/categories">
              Manage
            </Link>
          </span>
          <select
            className="w-full rounded-md border border-slate-200 bg-white px-3 py-2"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Uncategorized</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block space-y-1">
            <span className="text-sm font-medium">Price</span>
            <input className="w-full rounded-md border border-slate-200 px-3 py-2" value={price} onChange={(e) => setPrice(e.target.value)} inputMode="decimal" required />
          </label>
          <label className="block space-y-1">
            <span className="text-sm font-medium">Image URL (optional)</span>
            <input className="w-full rounded-md border border-slate-200 px-3 py-2" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://…" />
          </label>
        </div>
        <button className="mt-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60" disabled={loading} type="submit">
          {loading ? "Saving…" : "Save"}
        </button>
      </form>
    </div>
  );
}
