"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatMoneyFromCents } from "@/shared/utils/format";

export function AdminProductRow(props: {
  product: {
    id: string;
    name: string;
    priceCents: number;
    description: string;
    imageUrl: string | null;
    categoryId: string | null;
    category?: { name: string } | null;
  };
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <div className="grid gap-3 p-4 md:grid-cols-12 md:items-center">
      <div className="md:col-span-4">
        <div className="truncate font-medium">{props.product.name}</div>
        <div className="text-xs text-slate-500 line-clamp-2">{props.product.description}</div>
      </div>

      <div className="md:col-span-2">
        <div className="text-sm text-slate-700">{props.product.category?.name ?? "Uncategorized"}</div>
      </div>

      <div className="md:col-span-2">
        <div className="text-sm font-medium text-slate-900">{formatMoneyFromCents(props.product.priceCents)}</div>
      </div>

      <div className="md:col-span-2">
        {props.product.imageUrl ? (
          <Image
            src={props.product.imageUrl}
            alt={props.product.name}
            width={48}
            height={48}
            className="h-12 w-12 rounded-md border border-slate-100 object-cover"
          />
        ) : (
          <div className="h-12 w-12 rounded-md border border-slate-100 bg-slate-50" />
        )}
      </div>

      <div className="flex items-center gap-2 md:col-span-2 md:justify-end">
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
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}
