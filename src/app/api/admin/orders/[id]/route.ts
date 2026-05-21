import { z } from "zod";
import { requireAdmin } from "@/infrastructure/api/auth/session";
import { PrismaOrderRepository } from "@/infrastructure/repositories/PrismaOrderRepository";
import { OrderUseCases } from "@/application/use-cases/orders";
import { jsonBadRequest, jsonForbidden, jsonOk, jsonUnauthorized } from "@/shared/utils/http";
import { errorMessageFromUnknown } from "@/shared/utils/errors";

const updateStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "REJECTED"])
});

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin();
    const { id } = await ctx.params;
    const body = await req.json();
    const input = updateStatusSchema.parse(body);

    const order = await new OrderUseCases(new PrismaOrderRepository()).updateStatus(id, input.status);
    return jsonOk({ order });
  } catch (e) {
    const message = errorMessageFromUnknown(e);
    if (message === "Unauthorized") return jsonUnauthorized();
    if (message === "Forbidden") return jsonForbidden();
    return jsonBadRequest(message);
  }
}
