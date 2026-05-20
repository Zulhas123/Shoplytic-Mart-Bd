import Link from "next/link";
import { ProductUseCases } from "@/application/use-cases/products";
import { PrismaProductRepository } from "@/infrastructure/repositories/PrismaProductRepository";
import { AdminProductRow } from "@/presentation/components/admin/AdminProductRow";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await new ProductUseCases(new PrismaProductRepository()).list();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Products</h2>
        <Link className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white" href="/admin/products/new">
          Add product
        </Link>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white">
        <div className="divide-y divide-slate-100">
          {products.length === 0 ? (
            <div className="p-6 text-sm text-slate-600">No products yet.</div>
          ) : (
            products.map((p) => <AdminProductRow key={p.id} product={p} />)
          )}
        </div>
      </div>
    </div>
  );
}
