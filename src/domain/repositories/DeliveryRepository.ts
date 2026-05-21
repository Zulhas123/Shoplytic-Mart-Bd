import type { Delivery, DeliveryAgent, DeliveryAgentStatus, DeliveryPaymentStatus, DeliveryStatus } from "@/domain/entities/Delivery";

export type CreateDeliveryAgentInput = {
  name: string;
  phone: string;
  address: string;
  vehicleType: string;
  deliveryZone: string;
  status?: DeliveryAgentStatus;
  joinedAt?: Date;
};

export type UpdateDeliveryAgentInput = Partial<CreateDeliveryAgentInput>;

export type CreateDeliveryForOrderInput = {
  orderId: string;
  agentId: string;
  deliveryChargeCents: number;
  paymentStatus?: DeliveryPaymentStatus;
  status?: DeliveryStatus;
  deliveryDate?: Date | null;
};

export interface DeliveryRepository {
  listAgents(): Promise<DeliveryAgent[]>;
  getAgentById(id: string): Promise<DeliveryAgent | null>;
  createAgent(input: CreateDeliveryAgentInput): Promise<DeliveryAgent>;
  updateAgent(id: string, input: UpdateDeliveryAgentInput): Promise<DeliveryAgent>;
  deleteAgent(id: string): Promise<void>;

  listDeliveries(filter?: { status?: DeliveryStatus; agentId?: string }): Promise<Delivery[]>;
  getDeliveryByOrderId(orderId: string): Promise<Delivery | null>;
  createOrUpdateDeliveryForOrder(input: CreateDeliveryForOrderInput): Promise<Delivery>;
  updateDelivery(orderId: string, input: Partial<Pick<Delivery, "status" | "paymentStatus" | "deliveryChargeCents" | "deliveryDate">>): Promise<Delivery>;
}

