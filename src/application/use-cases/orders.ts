import { z } from "zod";
import type { OrderRepository } from "@/domain/repositories/OrderRepository";

export const createOrderSchema = z.object({
  shipping: z.object({
    name: z.string().min(1).max(80),
    email: z.string().email(),
    address1: z.string().min(1).max(120),
    address2: z.string().max(120).optional().nullable(),
    city: z.string().min(1).max(80),
    postal: z.string().min(1).max(20)
  }),
  items: z
    .array(
      z.object({
        productId: z.string().min(1),
        name: z.string().min(1),
        priceCents: z.number().int().min(0),
        quantity: z.number().int().min(1).max(99)
      })
    )
    .min(1)
});

export class OrderUseCases {
  constructor(private readonly orders: OrderRepository) {}

  create(userId: string, input: z.infer<typeof createOrderSchema>) {
    return this.orders.create({ userId, shipping: input.shipping, items: input.items });
  }

  listByUser(userId: string) {
    return this.orders.listByUserId(userId);
  }

  getByIdForUser(orderId: string, userId: string) {
    return this.orders.getByIdForUser(orderId, userId);
  }

  listAll() {
    return this.orders.listAll();
  }
}

