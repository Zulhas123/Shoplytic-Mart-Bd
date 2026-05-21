import { z } from "zod";
import type { DeliveryRepository } from "@/domain/repositories/DeliveryRepository";
import type { DeliveryAgentStatus, DeliveryPaymentStatus, DeliveryStatus } from "@/domain/entities/Delivery";

export const createDeliveryAgentSchema = z.object({
  name: z.string().trim().min(1).max(80),
  phone: z.string().trim().min(6).max(30),
  address: z.string().trim().min(1).max(200),
  vehicleType: z.string().trim().min(1).max(60),
  deliveryZone: z.string().trim().min(1).max(80),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  joinedAt: z.coerce.date().optional()
});

export const assignDeliverySchema = z.object({
  agentId: z.string().min(1),
  deliveryChargeCents: z.number().int().min(0).max(1_000_000),
  status: z.enum(["ASSIGNED", "PENDING", "COMPLETED", "CANCELED"]).optional(),
  paymentStatus: z.enum(["UNPAID", "PAID", "COD"]).optional(),
  deliveryDate: z.coerce.date().optional().nullable()
});

export class DeliveryUseCases {
  constructor(private readonly deliveries: DeliveryRepository) {}

  listAgents() {
    return this.deliveries.listAgents();
  }

  createAgent(input: z.infer<typeof createDeliveryAgentSchema>) {
    return this.deliveries.createAgent({
      name: input.name,
      phone: input.phone,
      address: input.address,
      vehicleType: input.vehicleType,
      deliveryZone: input.deliveryZone,
      status: (input.status as DeliveryAgentStatus | undefined) ?? "ACTIVE",
      joinedAt: input.joinedAt
    });
  }

  updateAgent(id: string, input: Partial<z.infer<typeof createDeliveryAgentSchema>>) {
    return this.deliveries.updateAgent(id, input);
  }

  deleteAgent(id: string) {
    return this.deliveries.deleteAgent(id);
  }

  listDeliveries(filter?: { status?: DeliveryStatus; agentId?: string }) {
    return this.deliveries.listDeliveries(filter);
  }

  getDeliveryByOrderId(orderId: string) {
    return this.deliveries.getDeliveryByOrderId(orderId);
  }

  assignToOrder(orderId: string, input: z.infer<typeof assignDeliverySchema>) {
    return this.deliveries.createOrUpdateDeliveryForOrder({
      orderId,
      agentId: input.agentId,
      deliveryChargeCents: input.deliveryChargeCents,
      status: (input.status as DeliveryStatus | undefined) ?? "ASSIGNED",
      paymentStatus: (input.paymentStatus as DeliveryPaymentStatus | undefined) ?? "UNPAID",
      deliveryDate: input.deliveryDate ?? null
    });
  }

  updateDelivery(
    orderId: string,
    input: Partial<Pick<z.infer<typeof assignDeliverySchema>, "status" | "paymentStatus" | "deliveryChargeCents" | "deliveryDate">>
  ) {
    return this.deliveries.updateDelivery(orderId, {
      status: input.status,
      paymentStatus: input.paymentStatus,
      deliveryChargeCents: input.deliveryChargeCents,
      deliveryDate: input.deliveryDate
    });
  }
}

