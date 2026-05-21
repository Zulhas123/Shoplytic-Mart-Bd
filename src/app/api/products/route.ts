import { ProductUseCases, productCreateSchema } from "@/application/use-cases/products";
import { requireAdmin } from "@/infrastructure/api/auth/session";
import { PrismaProductRepository } from "@/infrastructure/repositories/PrismaProductRepository";
import { jsonBadRequest, jsonCreated, jsonOk, jsonUnauthorized, jsonForbidden } from "@/shared/utils/http";
import { errorMessageFromUnknown } from "@/shared/utils/errors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q");
  const categoryId = searchParams.get("categoryId");
  const products = await new ProductUseCases(new PrismaProductRepository()).list({
    q,
    categoryId
  });
  return jsonOk({ products });
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const input = productCreateSchema.parse(body);
    const product = await new ProductUseCases(new PrismaProductRepository()).create(input);
    return jsonCreated({ product });
  } catch (e) {
    const message = errorMessageFromUnknown(e);
    if (message === "Unauthorized") return jsonUnauthorized();
    if (message === "Forbidden") return jsonForbidden();
    return jsonBadRequest(message);
  }
}
