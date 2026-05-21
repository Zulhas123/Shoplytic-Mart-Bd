import { requireAdmin } from "@/infrastructure/api/auth/session";
import { PrismaDeliveryRepository } from "@/infrastructure/repositories/PrismaDeliveryRepository";
import { DeliveryUseCases, createDeliveryAgentSchema } from "@/application/use-cases/delivery";
import { jsonBadRequest, jsonCreated, jsonForbidden, jsonOk, jsonUnauthorized } from "@/shared/utils/http";
import { errorMessageFromUnknown } from "@/shared/utils/errors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireAdmin();
    const agents = await new DeliveryUseCases(new PrismaDeliveryRepository()).listAgents();
    return jsonOk({ agents });
  } catch (e) {
    const message = errorMessageFromUnknown(e);
    if (message === "Unauthorized") return jsonUnauthorized();
    if (message === "Forbidden") return jsonForbidden();
    return jsonBadRequest(message);
  }
}

export async function POST(req: Request) {
  try {
    await requireAdmin();
    const body = await req.json();
    const input = createDeliveryAgentSchema.parse(body);
    const agent = await new DeliveryUseCases(new PrismaDeliveryRepository()).createAgent(input);
    return jsonCreated({ agent });
  } catch (e) {
    const message = errorMessageFromUnknown(e);
    if (message === "Unauthorized") return jsonUnauthorized();
    if (message === "Forbidden") return jsonForbidden();
    return jsonBadRequest(message);
  }
}
