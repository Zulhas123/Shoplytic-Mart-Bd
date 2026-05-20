import { requireAdmin } from "@/infrastructure/api/auth/session";
import { PrismaOrderRepository } from "@/infrastructure/repositories/PrismaOrderRepository";
import { OrderUseCases } from "@/application/use-cases/orders";
import { jsonBadRequest, jsonForbidden, jsonOk, jsonUnauthorized } from "@/shared/utils/http";

export async function GET() {
  try {
    await requireAdmin();
    const orders = await new OrderUseCases(new PrismaOrderRepository()).listAll();
    return jsonOk({ orders });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid request";
    if (message === "Unauthorized") return jsonUnauthorized();
    if (message === "Forbidden") return jsonForbidden();
    return jsonBadRequest(message);
  }
}
