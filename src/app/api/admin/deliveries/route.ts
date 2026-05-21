import { requireAdmin } from "@/infrastructure/api/auth/session";
import { PrismaDeliveryRepository } from "@/infrastructure/repositories/PrismaDeliveryRepository";
import { DeliveryUseCases } from "@/application/use-cases/delivery";
import { jsonBadRequest, jsonForbidden, jsonOk, jsonUnauthorized } from "@/shared/utils/http";
import { errorMessageFromUnknown } from "@/shared/utils/errors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await requireAdmin();
    const url = new URL(req.url);
    const status = url.searchParams.get("status")?.toUpperCase() || "";
    const agentId = url.searchParams.get("agentId")?.trim() || "";
    const deliveries = await new DeliveryUseCases(new PrismaDeliveryRepository()).listDeliveries({
      status:
        status === "ASSIGNED" || status === "PENDING" || status === "COMPLETED" || status === "CANCELED"
          ? (status as any)
          : undefined,
      agentId: agentId || undefined
    });
    return jsonOk({ deliveries });
  } catch (e) {
    const message = errorMessageFromUnknown(e);
    if (message === "Unauthorized") return jsonUnauthorized();
    if (message === "Forbidden") return jsonForbidden();
    return jsonBadRequest(message);
  }
}
