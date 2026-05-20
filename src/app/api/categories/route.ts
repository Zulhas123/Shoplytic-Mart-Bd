import { CategoryUseCases, createCategorySchema } from "@/application/use-cases/categories";
import { requireAdmin } from "@/infrastructure/api/auth/session";
import { PrismaCategoryRepository } from "@/infrastructure/repositories/PrismaCategoryRepository";
import { prisma } from "@/infrastructure/database/prisma/client";
import { jsonBadRequest, jsonCreated, jsonForbidden, jsonOk, jsonUnauthorized } from "@/shared/utils/http";

const defaultCategoryNames = [
  "Electronics",
  "Fashion",
  "Home & Kitchen",
  "Beauty & Personal Care",
  "Sports & Outdoors",
  "Books",
  "Toys & Games",
  "Grocery",
  "Health & Wellness",
  "Automotive",
  "Office Supplies",
  "Accessories"
];

export async function GET() {
  const repo = new PrismaCategoryRepository();
  let categories = await new CategoryUseCases(repo).list();

  if (categories.length === 0) {
    await prisma.category.createMany({
      data: defaultCategoryNames.map((name) => ({ name })),
      skipDuplicates: true
    });
    categories = await new CategoryUseCases(repo).list();
  }

  return jsonOk({ categories });
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const input = createCategorySchema.parse(body);
    const category = await new CategoryUseCases(new PrismaCategoryRepository()).create(input);
    return jsonCreated({ category });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid request";
    if (message === "Unauthorized") return jsonUnauthorized();
    if (message === "Forbidden") return jsonForbidden();
    return jsonBadRequest(message);
  }
}
