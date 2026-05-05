import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminDashboardPage() {
  // Métricas Globales
  const [tenantCount, productCount, orderCount, paidOrders] = await Promise.all([
    prisma.tenant.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.findMany({
      where: { status: "PAID" },
      select: { total: true }
    })
  ]);

  const totalRevenue = paidOrders.reduce((acc, order) => acc + order.total, 0);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Métricas Globales</h2>
        <p className="text-muted-foreground">Estado general de la plataforma Nexteshop.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 uppercase">Tiendas Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{tenantCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Vendedores activos</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 uppercase">Volumen de Ventas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">${totalRevenue.toLocaleString('es-AR')}</div>
            <p className="text-xs text-muted-foreground mt-1">Procesado en total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 uppercase">Órdenes Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{orderCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Pedidos generados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 uppercase">Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{productCount}</div>
            <p className="text-xs text-muted-foreground mt-1">En todos los catálogos</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm">
        <h3 className="text-lg font-bold mb-4">Próximos pasos para el Admin</h3>
        <ul className="list-disc list-inside space-y-2 text-slate-600 text-sm">
           <li>Habilitar vista de Webhooks de MercadoPago.</li>
           <li>Control de planes de suscripción mensuales.</li>
           <li>Reportes de facturación por tienda.</li>
        </ul>
      </div>
    </div>
  );
}
