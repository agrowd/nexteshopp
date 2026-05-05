import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardMetrics } from "@/app/actions/dashboard";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import SalesChart from "./_components/SalesChart";

export default async function DashboardPage() {
  const metrics = await getDashboardMetrics();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Bienvenido al Dashboard</h2>
        <p className="text-muted-foreground">Aquí puedes gestionar tu tienda y ver el rendimiento.</p>
      </div>

      {metrics.status === "SUSPENDED" && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-red-800 flex justify-between items-center">
          <div>
            <p className="font-bold text-sm">Tu tienda está suspendida</p>
            <p className="text-xs opacity-80">Por favor, regulariza tu suscripción para seguir vendiendo.</p>
          </div>
          <Button variant="destructive" size="sm">Pagar Suscripción</Button>
        </div>
      )}

      {metrics.plan === "FREE" && metrics.status === "ACTIVE" && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-blue-800 flex justify-between items-center shadow-sm">
          <div>
            <p className="font-bold text-sm">Plan Gratuito ($0/mes)</p>
            <p className="text-xs opacity-80">Sube de nivel para acceder a dominio propio y soporte prioritario.</p>
          </div>
          <Link href="/app/settings/subscription" className={buttonVariants({ size: "sm", className: "bg-blue-600 hover:bg-blue-700 text-white" })}>
            Mejorar a Pro ($10.000)
          </Link>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.revenue.toLocaleString('es-AR')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Pagados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{metrics.ordersPending}</div>
            <p className="text-xs text-muted-foreground">Listos para procesar</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visitas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.visits}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MercadoPago</CardTitle>
          </CardHeader>
          <CardContent>
            {metrics.mpConnected ? (
               <p className="text-xs font-semibold text-green-600 mb-1 mt-2">Conectado ✅</p>
            ) : (
              <>
                <p className="text-xs font-semibold text-red-500 mb-2 mt-1">No conectado</p>
                <Link href="/app/settings/payments" className={buttonVariants({ size: "xs", className: "bg-[#009EE3] hover:bg-blue-600" })}>
                  Vincular Cuenta
                </Link>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Rendimiento de Ventas</CardTitle>
          <CardDescription>Ventas netas de los últimos 7 días.</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <SalesChart data={metrics.salesHistory || []} />
        </CardContent>
      </Card>
    </div>
  );
}
