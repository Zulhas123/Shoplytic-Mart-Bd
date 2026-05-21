import type {
  CreateDeliveryAgentInput,
  CreateDeliveryForOrderInput,
  DeliveryRepository,
  UpdateDeliveryAgentInput
} from "@/domain/repositories/DeliveryRepository";
import type { Delivery, DeliveryAgent, DeliveryItemSnapshot } from "@/domain/entities/Delivery";
import { prisma } from "@/infrastructure/database/prisma/client";

function asDeliveryAgent(row: any): DeliveryAgent {
  return {
    id: row.id,
    name: row.name,
    phone: row.phone,
    address: row.address,
    vehicleType: row.vehicleType,
    deliveryZone: row.deliveryZone,
    status: row.status,
    joinedAt: row.joinedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  };
}

function asDelivery(row: any): Delivery {
  return {
    id: row.id,
    orderId: row.orderId,
    agentId: row.agentId,
    status: row.status,
    paymentStatus: row.paymentStatus,
    deliveryChargeCents: row.deliveryChargeCents,
    totalAmountCents: row.totalAmountCents,
    deliveredAt: row.deliveredAt,
    canceledAt: row.canceledAt,
    deliveryDate: row.deliveryDate,
    customerSnapshot: row.customerSnapshot,
    itemsSnapshot: row.itemsSnapshot,
    categoryBreakdown: row.categoryBreakdown,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  };
}

function computeCategoryBreakdown(items: DeliveryItemSnapshot[]) {
  const breakdown: Record<string, number> = {};
  for (const it of items) {
    const key = it.categoryName ?? "Uncategorized";
    breakdown[key] = (breakdown[key] ?? 0) + it.lineTotalCents;
  }
  return breakdown;
}

export class PrismaDeliveryRepository implements DeliveryRepository {
  async listAgents() {
    const agents = await prisma.deliveryAgent.findMany({ orderBy: { createdAt: "desc" } });
    return agents.map(asDeliveryAgent);
  }

  async getAgentById(id: string) {
    const agent = await prisma.deliveryAgent.findUnique({ where: { id } });
    return agent ? asDeliveryAgent(agent) : null;
  }

  async createAgent(input: CreateDeliveryAgentInput) {
    const agent = await prisma.deliveryAgent.create({
      data: {
        name: input.name,
        phone: input.phone,
        address: input.address,
        vehicleType: input.vehicleType,
        deliveryZone: input.deliveryZone,
        status: input.status ?? "ACTIVE",
        joinedAt: input.joinedAt ?? new Date()
      }
    });
    return asDeliveryAgent(agent);
  }

  async updateAgent(id: string, input: UpdateDeliveryAgentInput) {
    const agent = await prisma.deliveryAgent.update({
      where: { id },
      data: {
        name: input.name,
        phone: input.phone,
        address: input.address,
        vehicleType: input.vehicleType,
        deliveryZone: input.deliveryZone,
        status: input.status,
        joinedAt: input.joinedAt
      }
    });
    return asDeliveryAgent(agent);
  }

  async deleteAgent(id: string) {
    await prisma.deliveryAgent.delete({ where: { id } });
  }

  async listDeliveries(filter?: { status?: Delivery["status"]; agentId?: string }) {
    const deliveries = await prisma.delivery.findMany({
      where: {
        ...(filter?.status ? { status: filter.status } : {}),
        ...(filter?.agentId ? { agentId: filter.agentId } : {})
      },
      orderBy: { createdAt: "desc" }
    });
    return deliveries.map(asDelivery);
  }

  async getDeliveryByOrderId(orderId: string) {
    const delivery = await prisma.delivery.findUnique({ where: { orderId } });
    return delivery ? asDelivery(delivery) : null;
  }

  async createOrUpdateDeliveryForOrder(input: CreateDeliveryForOrderInput) {
    const order = await prisma.order.findUnique({
      where: { id: input.orderId },
      include: {
        items: {
          include: {
            product: { include: { category: true } }
          }
        }
      }
    });
    if (!order) throw new Error("Order not found");

    const customerSnapshot = {
      name: order.shippingName,
      phone: order.shippingPhone ?? null,
      email: order.shippingEmail ?? null,
      address1: order.shippingAddress1,
      address2: order.shippingAddress2 ?? null,
      city: order.shippingCity,
      postal: order.shippingPostal
    };

    const itemsSnapshot: DeliveryItemSnapshot[] = order.items.map((it) => ({
      productId: it.productId,
      productName: it.name,
      quantity: it.quantity,
      categoryId: it.product.categoryId ?? null,
      categoryName: it.product.category?.name ?? null,
      priceCents: it.priceCents,
      lineTotalCents: it.priceCents * it.quantity
    }));

    const categoryBreakdown = computeCategoryBreakdown(itemsSnapshot);
    const totalAmountCents = order.totalCents + input.deliveryChargeCents;

    const delivery = await prisma.delivery.upsert({
      where: { orderId: input.orderId },
      create: {
        orderId: input.orderId,
        agentId: input.agentId,
        status: input.status ?? "ASSIGNED",
        paymentStatus: input.paymentStatus ?? "UNPAID",
        deliveryChargeCents: input.deliveryChargeCents,
        totalAmountCents,
        deliveryDate: input.deliveryDate ?? null,
        customerSnapshot,
        itemsSnapshot,
        categoryBreakdown
      },
      update: {
        agentId: input.agentId,
        status: input.status ?? undefined,
        paymentStatus: input.paymentStatus ?? undefined,
        deliveryChargeCents: input.deliveryChargeCents,
        totalAmountCents,
        deliveryDate: input.deliveryDate ?? null,
        customerSnapshot,
        itemsSnapshot,
        categoryBreakdown
      }
    });

    return asDelivery(delivery);
  }

  async updateDelivery(
    orderId: string,
    input: Partial<Pick<Delivery, "status" | "paymentStatus" | "deliveryChargeCents" | "deliveryDate">>
  ) {
    const existing = await prisma.delivery.findUnique({ where: { orderId } });
    if (!existing) throw new Error("Delivery not found");

    const nextStatus = input.status ?? existing.status;
    const deliveredAt = nextStatus === "COMPLETED" ? new Date() : existing.deliveredAt;
    const canceledAt = nextStatus === "CANCELED" ? new Date() : existing.canceledAt;

    const delivery = await prisma.delivery.update({
      where: { orderId },
      data: {
        status: input.status,
        paymentStatus: input.paymentStatus,
        deliveryChargeCents: input.deliveryChargeCents,
        totalAmountCents:
          typeof input.deliveryChargeCents === "number"
            ? existing.totalAmountCents - existing.deliveryChargeCents + input.deliveryChargeCents
            : existing.totalAmountCents,
        deliveryDate: input.deliveryDate === undefined ? undefined : input.deliveryDate,
        deliveredAt,
        canceledAt
      }
    });
    return asDelivery(delivery);
  }
}

