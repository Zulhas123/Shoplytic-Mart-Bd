import { DeliveryUseCases } from "@/application/use-cases/delivery";
import { OrderUseCases } from "@/application/use-cases/orders";
import { PrismaDeliveryRepository } from "@/infrastructure/repositories/PrismaDeliveryRepository";
import { PrismaOrderRepository } from "@/infrastructure/repositories/PrismaOrderRepository";
import { DeliveriesClient } from "@/presentation/components/admin/DeliveriesClient";

export const dynamic = "force-dynamic";

export default async function DeliveriesPage({
  searchParams
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const agents = await new DeliveryUseCases(new PrismaDeliveryRepository()).listAgents();
  const orders = await new OrderUseCases(new PrismaOrderRepository()).listAll();
  const sp = await searchParams;
  const status = (sp.status ?? "").toUpperCase();
  const initialFilter =
    status === "ASSIGNED" || status === "PENDING" || status === "COMPLETED" || status === "CANCELED" || status === "ALL"
      ? (status as any)
      : "ALL";

  const deliveries = await new DeliveryUseCases(new PrismaDeliveryRepository()).listDeliveries(
    initialFilter === "ALL" ? undefined : { status: initialFilter as any }
  );

  return (
    <DeliveriesClient
      initialAgents={agents.map((a) => ({ id: a.id, name: a.name, phone: a.phone, status: a.status }))}
      initialOrders={orders.map((o) => ({
        id: o.id,
        status: o.status,
        totalCents: o.totalCents,
        createdAt: o.createdAt,
        shippingName: o.shippingName,
        shippingPhone: o.shippingPhone
      }))}
      initialDeliveries={deliveries.map((d) => ({
        orderId: d.orderId,
        agentId: d.agentId,
        status: d.status,
        paymentStatus: d.paymentStatus,
        deliveryChargeCents: d.deliveryChargeCents,
        totalAmountCents: d.totalAmountCents,
        deliveryDate: d.deliveryDate,
        createdAt: d.createdAt,
        customerSnapshot: { name: d.customerSnapshot.name, phone: d.customerSnapshot.phone, email: d.customerSnapshot.email }
      }))}
      initialFilter={initialFilter}
    />
  );
}

