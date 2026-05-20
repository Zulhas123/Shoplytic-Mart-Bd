import { OrderUseCases, createOrderSchema } from "@/application/use-cases/orders";
import { requireSession } from "@/infrastructure/api/auth/session";
import { PrismaOrderRepository } from "@/infrastructure/repositories/PrismaOrderRepository";
import { jsonBadRequest, jsonCreated, jsonOk, jsonUnauthorized } from "@/shared/utils/http";

export async function GET() {
  try {
    const session = await requireSession();
    const orders = await new OrderUseCases(new PrismaOrderRepository()).listByUser(session.userId);
    return jsonOk({ orders });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid request";
    if (message === "Unauthorized") return jsonUnauthorized();
    return jsonBadRequest(message);
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireSession();
    const body = await req.json();
    const input = createOrderSchema.parse(body);
    const order = await new OrderUseCases(new PrismaOrderRepository()).create(session.userId, input);
    return jsonCreated({ order });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid request";
    if (message === "Unauthorized") return jsonUnauthorized();
    return jsonBadRequest(message);
  }
}
