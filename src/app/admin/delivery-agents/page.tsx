import { DeliveryUseCases } from "@/application/use-cases/delivery";
import { PrismaDeliveryRepository } from "@/infrastructure/repositories/PrismaDeliveryRepository";
import { DeliveryAgentsClient } from "@/presentation/components/admin/DeliveryAgentsClient";

export const dynamic = "force-dynamic";

export default async function DeliveryAgentsPage() {
  const agents = await new DeliveryUseCases(new PrismaDeliveryRepository()).listAgents();
  return <DeliveryAgentsClient initialAgents={agents} />;
}

