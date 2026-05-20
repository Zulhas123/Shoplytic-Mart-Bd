import { ProductForm } from "@/presentation/components/admin/ProductForm";

export default function AdminNewProductPage() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">New product</h2>
      <ProductForm mode="create" />
    </div>
  );
}

