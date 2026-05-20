import { OrderUseCases } from "@/application/use-cases/orders";
import { getGuestKey } from "@/infrastructure/api/guest/session";
import { PrismaOrderRepository } from "@/infrastructure/repositories/PrismaOrderRepository";
import { jsonBadRequest, jsonNotFound, jsonOk } from "@/shared/utils/http";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const guestKey = await getGuestKey();
    const { id } = await params;
    const order = guestKey
      ? await new OrderUseCases(new PrismaOrderRepository()).getByIdForGuestKey(id, guestKey)
      : null;
    if (!order) return jsonNotFound("Order not found");
    return jsonOk({ order });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid request";
    return jsonBadRequest(message);
  }
}
