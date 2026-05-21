import { requireAdmin } from "@/infrastructure/api/auth/session";
import { PrismaDeliveryRepository } from "@/infrastructure/repositories/PrismaDeliveryRepository";
import { DeliveryUseCases, assignDeliverySchema } from "@/application/use-cases/delivery";
import { jsonBadRequest, jsonForbidden, jsonOk, jsonUnauthorized } from "@/shared/utils/http";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await ctx.params;
    const body = await req.json();
    const input = assignDeliverySchema.parse(body);
    const delivery = await new DeliveryUseCases(new PrismaDeliveryRepository()).assignToOrder(id, input);
    return jsonOk({ delivery });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid request";
    if (message === "Unauthorized") return jsonUnauthorized();
    if (message === "Forbidden") return jsonForbidden();
    return jsonBadRequest(message);
  }
}

