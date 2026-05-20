import { ProductUseCases, productUpdateSchema } from "@/application/use-cases/products";
import { requireAdmin } from "@/infrastructure/api/auth/session";
import { PrismaProductRepository } from "@/infrastructure/repositories/PrismaProductRepository";
import {
  jsonBadRequest,
  jsonForbidden,
  jsonNotFound,
  jsonOk,
  jsonUnauthorized
} from "@/shared/utils/http";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await new ProductUseCases(new PrismaProductRepository()).getById(id);
  if (!product) return jsonNotFound("Product not found");
  return jsonOk({ product });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    const body = await req.json();
    const input = productUpdateSchema.parse(body);
    const product = await new ProductUseCases(new PrismaProductRepository()).update(id, input);
    return jsonOk({ product });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid request";
    if (message === "Unauthorized") return jsonUnauthorized();
    if (message === "Forbidden") return jsonForbidden();
    return jsonBadRequest(message);
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await params;
    await new ProductUseCases(new PrismaProductRepository()).delete(id);
    return jsonOk({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid request";
    if (message === "Unauthorized") return jsonUnauthorized();
    if (message === "Forbidden") return jsonForbidden();
    return jsonBadRequest(message);
  }
}
