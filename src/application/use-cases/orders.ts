import { z } from "zod";
import type { OrderRepository } from "@/domain/repositories/OrderRepository";

export const createOrderSchema = z.object({
  shipping: z.object({
    name: z.string().min(1).max(80),
    email: z.string().email().optional().nullable(),
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

  createGuest(guestKey: string, input: z.infer<typeof createOrderSchema>) {
    return this.orders.create({ userId: null, guestKey, shipping: input.shipping, items: input.items });
  }

  listByUser(userId: string) {
    return this.orders.listByUserId(userId);
  }

  getByIdForUser(orderId: string, userId: string) {
    return this.orders.getByIdForUser(orderId, userId);
  }

  listByGuestKey(guestKey: string) {
    return this.orders.listByGuestKey(guestKey);
  }

  getByIdForGuestKey(orderId: string, guestKey: string) {
    return this.orders.getByIdForGuestKey(orderId, guestKey);
  }

  listAll() {
    return this.orders.listAll();
  }

  updateStatus(orderId: string, status: "PENDING" | "CONFIRMED" | "REJECTED") {
    return this.orders.updateStatus(orderId, status);
  }

  submitPayment(orderId: string, input: { paymentMethod: "BKASH" | "NAGAD" | "MANUAL"; paymentReference: string }) {
    return this.orders.submitPayment(orderId, input);
  }
}
