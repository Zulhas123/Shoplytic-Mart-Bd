import type { CreateOrderInput, OrderRepository } from "@/domain/repositories/OrderRepository";
import { prisma } from "@/infrastructure/database/prisma/client";

export class PrismaOrderRepository implements OrderRepository {
  async create(input: CreateOrderInput) {
    const totalCents = input.items.reduce((sum, it) => sum + it.priceCents * it.quantity, 0);
    const order = await prisma.order.create({
      data: {
        userId: input.userId,
        shippingName: input.shipping.name,
        shippingEmail: input.shipping.email,
        shippingAddress1: input.shipping.address1,
        shippingAddress2: input.shipping.address2 ?? null,
        shippingCity: input.shipping.city,
        shippingPostal: input.shipping.postal,
        totalCents,
        items: {
          create: input.items.map((it) => ({
            productId: it.productId,
            name: it.name,
            priceCents: it.priceCents,
            quantity: it.quantity
          }))
        }
      },
      include: { items: true }
    });

    return {
      id: order.id,
      userId: order.userId,
      status: order.status,
      shippingName: order.shippingName,
      shippingEmail: order.shippingEmail,
      shippingAddress1: order.shippingAddress1,
      shippingAddress2: order.shippingAddress2,
      shippingCity: order.shippingCity,
      shippingPostal: order.shippingPostal,
      totalCents: order.totalCents,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: order.items
    };
  }

  async listByUserId(userId: string) {
    const orders = await prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { items: true }
    });

    return orders.map((o) => ({ ...o, items: o.items }));
  }

  async getByIdForUser(orderId: string, userId: string) {
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: { items: true }
    });
    if (!order) return null;
    return { ...order, items: order.items };
  }

  async listAll() {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: { items: true }
    });
    return orders.map((o) => ({ ...o, items: o.items }));
  }
}

