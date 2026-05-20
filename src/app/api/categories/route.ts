import { CategoryUseCases, createCategorySchema } from "@/application/use-cases/categories";
import { requireAdmin } from "@/infrastructure/api/auth/session";
import { PrismaCategoryRepository } from "@/infrastructure/repositories/PrismaCategoryRepository";
import { jsonBadRequest, jsonCreated, jsonForbidden, jsonOk, jsonUnauthorized } from "@/shared/utils/http";

export async function GET() {
  const categories = await new CategoryUseCases(new PrismaCategoryRepository()).list();
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
