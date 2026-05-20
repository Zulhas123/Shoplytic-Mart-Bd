import { CategoryUseCases } from "@/application/use-cases/categories";
import { PrismaCategoryRepository } from "@/infrastructure/repositories/PrismaCategoryRepository";
import { AdminCategoriesClient } from "@/presentation/components/admin/AdminCategoriesClient";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await new CategoryUseCases(new PrismaCategoryRepository()).list();
  return <AdminCategoriesClient initialCategories={categories} />;
}
