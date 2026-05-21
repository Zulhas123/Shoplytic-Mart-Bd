import { z } from "zod";
import { getGuestKey } from "@/infrastructure/api/guest/session";
import { PrismaOrderRepository } from "@/infrastructure/repositories/PrismaOrderRepository";
import { OrderUseCases } from "@/application/use-cases/orders";
import { jsonBadRequest, jsonForbidden, jsonNotFound, jsonOk } from "@/shared/utils/http";
import { errorMessageFromUnknown } from "@/shared/utils/errors";

const schema = z.object({
  paymentMethod: z.enum(["BKASH", "NAGAD", "MANUAL"]),
  paymentReference: z.string().min(3).max(120)
});

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const guestKey = await getGuestKey();
    if (!guestKey) return jsonForbidden("Forbidden");

    const { id } = await params;
    const contentType = req.headers.get("content-type") ?? "";
    const raw =
      contentType.includes("application/json")
        ? await req.json()
        : Object.fromEntries((await req.formData()).entries());
    const input = schema.parse(raw);

    const existing = await new OrderUseCases(new PrismaOrderRepository()).getByIdForGuestKey(id, guestKey);
    if (!existing) return jsonNotFound("Order not found");

    const order = await new OrderUseCases(new PrismaOrderRepository()).submitPayment(id, input);
    return jsonOk({ order });
  } catch (e) {
    return jsonBadRequest(errorMessageFromUnknown(e));
  }
}
