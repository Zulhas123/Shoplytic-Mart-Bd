import { requireAdmin } from "@/infrastructure/api/auth/session";
import { PrismaDeliveryRepository } from "@/infrastructure/repositories/PrismaDeliveryRepository";
import { DeliveryUseCases, createDeliveryAgentSchema } from "@/application/use-cases/delivery";
import { jsonBadRequest, jsonForbidden, jsonNotFound, jsonOk, jsonUnauthorized } from "@/shared/utils/http";

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await ctx.params;
    const body = await req.json();
    const input = createDeliveryAgentSchema.partial().parse(body);
    const agent = await new DeliveryUseCases(new PrismaDeliveryRepository()).updateAgent(id, input);
    return jsonOk({ agent });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid request";
    if (message === "Unauthorized") return jsonUnauthorized();
    if (message === "Forbidden") return jsonForbidden();
    if (message.includes("Record to update not found")) return jsonNotFound("Delivery agent not found");
    return jsonBadRequest(message);
  }
}

export async function DELETE(_: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await ctx.params;
    await new DeliveryUseCases(new PrismaDeliveryRepository()).deleteAgent(id);
    return jsonOk({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Invalid request";
    if (message === "Unauthorized") return jsonUnauthorized();
    if (message === "Forbidden") return jsonForbidden();
    if (message.includes("Record to delete does not exist")) return jsonNotFound("Delivery agent not found");
    return jsonBadRequest(message);
  }
}

