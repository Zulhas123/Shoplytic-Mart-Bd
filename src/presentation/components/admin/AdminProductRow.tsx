"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminProductRow(props: {
  product: {
    id: string;
    name: string;
    priceCents: number;
    description: string;
    imageUrl: string | null;
  };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-4">
      <div className="min-w-0">
        <div className="truncate font-medium">{props.product.name}</div>
        <div className="text-sm text-slate-600">${(props.product.priceCents / 100).toFixed(2)}</div>
      </div>
      <div className="flex items-center gap-2">
        <Link
          className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-medium"
          href={`/admin/products/${props.product.id}/edit`}
        >
          Edit
        </Link>
        <button
          className="rounded-md border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-700 disabled:opacity-60"
          disabled={loading}
          onClick={async () => {
            if (!confirm("Delete this product?")) return;
            setLoading(true);
            try {
              const res = await fetch(`/api/products/${props.product.id}`, { method: "DELETE" });
              const data = await res.json();
              if (!res.ok) throw new Error(data?.error ?? "Delete failed");
              router.refresh();
            } finally {
              setLoading(false);
            }
          }}
        >
          {loading ? "Deleting…" : "Delete"}
        </button>
      </div>
    </div>
  );
}

