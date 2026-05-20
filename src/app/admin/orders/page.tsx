import { OrderUseCases } from "@/application/use-cases/orders";
import { PrismaOrderRepository } from "@/infrastructure/repositories/PrismaOrderRepository";
import { AdminOrdersClient } from "@/presentation/components/admin/AdminOrdersClient";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage({
  searchParams
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const orders = await new OrderUseCases(new PrismaOrderRepository()).listAll();
  const sp = await searchParams;
  const status = (sp.status ?? "").toUpperCase();
  const initialFilter =
    status === "PENDING" || status === "CONFIRMED" || status === "REJECTED" || status === "ALL"
      ? (status as "PENDING" | "CONFIRMED" | "REJECTED" | "ALL")
      : "PENDING";

  return <AdminOrdersClient initialOrders={orders} initialFilter={initialFilter} />;
}
