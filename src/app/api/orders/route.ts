import { OrderUseCases, createOrderSchema } from "@/application/use-cases/orders";
import { getGuestKey, setGuestKey } from "@/infrastructure/api/guest/session";
import { PrismaOrderRepository } from "@/infrastructure/repositories/PrismaOrderRepository";
import { jsonBadRequest, jsonOk } from "@/shared/utils/http";
import { NextResponse } from "next/server";
import { errorMessageFromUnknown } from "@/shared/utils/errors";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const guestKey = await getGuestKey();
    const orders = guestKey
      ? await new OrderUseCases(new PrismaOrderRepository()).listByGuestKey(guestKey)
      : [];
    return jsonOk({ orders });
  } catch (e) {
    return jsonBadRequest(errorMessageFromUnknown(e));
  }
}

export async function POST(req: Request) {
  try {
    const currentGuestKey = await getGuestKey();
    const body = await req.json();
    const input = createOrderSchema.parse(body);

    const guestKey = currentGuestKey ?? crypto.randomUUID();
    const order = await new OrderUseCases(new PrismaOrderRepository()).createGuest(guestKey, input);
    const res = NextResponse.json({ order }, { status: 201 });
    if (!currentGuestKey) setGuestKey(res, guestKey);
    return res;
  } catch (e) {
    return jsonBadRequest(errorMessageFromUnknown(e));
  }
}
