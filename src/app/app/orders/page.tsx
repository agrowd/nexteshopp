import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import OrdersList from "./_components/OrdersList";

export default async function OrdersPage() {
  const session = await auth();
  const tenantId = session?.user?.tenantId;

  if (!tenantId) return null;

  const orders = await prisma.order.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" },
    include: { lines: { include: { product: true } } }
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Pedidos</h2>
        <p className="text-muted-foreground">Administra las ventas de tu tienda.</p>
      </div>

      <OrdersList orders={orders} />
    </div>
  );
}
