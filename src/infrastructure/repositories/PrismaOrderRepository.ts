import type { CreateOrderInput, OrderRepository } from "@/domain/repositories/OrderRepository";
import type { Order } from "@/domain/entities/Order";
import { prisma } from "@/infrastructure/database/prisma/client";

export class PrismaOrderRepository implements OrderRepository {
  private isMissingShippingPhoneColumnError(err: unknown) {
    if (!(err instanceof Error)) return false;
    const message = err.message;
    return (
      message.includes("does not exist") &&
      (message.includes("`Order.shippingPhone`") || message.includes("`shippingPhone`") || message.includes("Order.shippingPhone"))
    );
  }

  private orderSelect(includePhone: boolean) {
    return {
      id: true,
      userId: true,
      guestKey: true,
      status: true,
      paymentMethod: true,
      paymentReference: true,
      paidAt: true,
      shippingName: true,
      shippingEmail: true,
      ...(includePhone ? { shippingPhone: true } : {}),
      shippingAddress1: true,
      shippingAddress2: true,
      shippingCity: true,
      shippingPostal: true,
      totalCents: true,
      createdAt: true,
      updatedAt: true,
      items: true
    } as const;
  }

  async create(input: CreateOrderInput) {
    const totalCents = input.items.reduce((sum, it) => sum + it.priceCents * it.quantity, 0);

    const baseData = {
      userId: input.userId ?? null,
      guestKey: input.guestKey ?? null,
      shippingName: input.shipping.name,
      shippingEmail: input.shipping.email ?? null,
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
    } satisfies Parameters<typeof prisma.order.create>[0]["data"];

    const dataWithPhone = { ...baseData, shippingPhone: input.shipping.phone ?? null };

    const createArgs = (includePhone: boolean) =>
      ({
        data: includePhone ? dataWithPhone : baseData,
        select: this.orderSelect(includePhone)
      }) as const;

    let order: any;
    try {
      order = await prisma.order.create(createArgs(true));
    } catch (err) {
      if (!this.isMissingShippingPhoneColumnError(err)) throw err;
      order = await prisma.order.create(createArgs(false));
    }

    return {
      id: order.id,
      userId: order.userId,
      status: order.status,
      guestKey: order.guestKey ?? null,
      paymentMethod: order.paymentMethod ?? null,
      paymentReference: order.paymentReference ?? null,
      paidAt: order.paidAt ?? null,
      shippingName: order.shippingName,
      shippingEmail: order.shippingEmail,
      shippingPhone: order.shippingPhone ?? null,
      shippingAddress1: order.shippingAddress1,
      shippingAddress2: order.shippingAddress2 ?? null,
      shippingCity: order.shippingCity,
      shippingPostal: order.shippingPostal,
      totalCents: order.totalCents,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      items: order.items
    };
  }

  async listByUserId(userId: string) {
    const findArgs = (includePhone: boolean) =>
      ({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: this.orderSelect(includePhone)
      }) as const;

    let orders: any[];
    try {
      orders = await prisma.order.findMany(findArgs(true));
    } catch (err) {
      if (!this.isMissingShippingPhoneColumnError(err)) throw err;
      orders = await prisma.order.findMany(findArgs(false));
    }

    return orders.map((o) => ({ ...o, shippingPhone: o.shippingPhone ?? null, items: o.items }));
  }

  async getByIdForUser(orderId: string, userId: string) {
    const findArgs = (includePhone: boolean) =>
      ({
        where: { id: orderId, userId },
        select: this.orderSelect(includePhone)
      }) as const;

    let order: any;
    try {
      order = await prisma.order.findFirst(findArgs(true));
    } catch (err) {
      if (!this.isMissingShippingPhoneColumnError(err)) throw err;
      order = await prisma.order.findFirst(findArgs(false));
    }
    if (!order) return null;
    return { ...order, shippingPhone: order.shippingPhone ?? null, items: order.items };
  }

  async listByGuestKey(guestKey: string) {
    const findArgs = (includePhone: boolean) =>
      ({
        where: { guestKey },
        orderBy: { createdAt: "desc" },
        select: this.orderSelect(includePhone)
      }) as const;

    let orders: any[];
    try {
      orders = await prisma.order.findMany(findArgs(true));
    } catch (err) {
      if (!this.isMissingShippingPhoneColumnError(err)) throw err;
      orders = await prisma.order.findMany(findArgs(false));
    }

    return orders.map((o) => ({ ...o, shippingPhone: o.shippingPhone ?? null, items: o.items }));
  }

  async getByIdForGuestKey(orderId: string, guestKey: string) {
    const findArgs = (includePhone: boolean) =>
      ({
        where: { id: orderId, guestKey },
        select: this.orderSelect(includePhone)
      }) as const;

    let order: any;
    try {
      order = await prisma.order.findFirst(findArgs(true));
    } catch (err) {
      if (!this.isMissingShippingPhoneColumnError(err)) throw err;
      order = await prisma.order.findFirst(findArgs(false));
    }
    if (!order) return null;
    return { ...order, shippingPhone: order.shippingPhone ?? null, items: order.items };
  }

  async listAll() {
    const findArgs = (includePhone: boolean) =>
      ({
        orderBy: { createdAt: "desc" },
        select: this.orderSelect(includePhone)
      }) as const;

    let orders: any[];
    try {
      orders = await prisma.order.findMany(findArgs(true));
    } catch (err) {
      if (!this.isMissingShippingPhoneColumnError(err)) throw err;
      orders = await prisma.order.findMany(findArgs(false));
    }

    return orders.map((o) => ({ ...o, shippingPhone: o.shippingPhone ?? null, items: o.items }));
  }

  async updateStatus(orderId: string, status: Order["status"]) {
    const updateArgs = (includePhone: boolean) =>
      ({
        where: { id: orderId },
        data: { status },
        select: this.orderSelect(includePhone)
      }) as const;

    let order: any;
    try {
      order = await prisma.order.update(updateArgs(true));
    } catch (err) {
      if (!this.isMissingShippingPhoneColumnError(err)) throw err;
      order = await prisma.order.update(updateArgs(false));
    }

    return { ...order, shippingPhone: order.shippingPhone ?? null, items: order.items };
  }

  async submitPayment(
    orderId: string,
    input: { paymentMethod: NonNullable<Order["paymentMethod"]>; paymentReference: string }
  ) {
    const updateArgs = (includePhone: boolean) =>
      ({
        where: { id: orderId },
        data: {
          paymentMethod: input.paymentMethod,
          paymentReference: input.paymentReference,
          paidAt: new Date(),
          status: "PAID"
        },
        select: this.orderSelect(includePhone)
      }) as const;

    let order: any;
    try {
      order = await prisma.order.update(updateArgs(true));
    } catch (err) {
      if (!this.isMissingShippingPhoneColumnError(err)) throw err;
      order = await prisma.order.update(updateArgs(false));
    }

    return { ...order, shippingPhone: order.shippingPhone ?? null, items: order.items };
  }
}
