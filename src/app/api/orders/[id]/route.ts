import { OrderUseCases } from "@/application/use-cases/orders";
import { requireSession } from "@/infrastructure/api/auth/session";
import { PrismaOrderRepository } from "@/infrastructure/repositories/PrismaOrderRepository";
import { jsonBadRequest, jsonNotFound, jsonOk, jsonUnauthorized } from "@/shared/utils/http";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await requireSession();
    const { id } = await params;
    const order = await new OrderUseCases(new PrismaOrderRepository()).getByIdForUser(
      id,
      session.userId
    );
    if (!order) return jsonNotFound("Order not found");
    return jsonOk({ order });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid request";
    if (message === "Unauthorized") return jsonUnauthorized();
    return jsonBadRequest(message);
  }
}
