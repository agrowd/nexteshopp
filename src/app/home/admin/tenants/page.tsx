import { prisma } from "@/lib/prisma";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function AdminTenantsPage() {
  const tenants = await prisma.tenant.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { products: true, orders: true }
      }
    }
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Gestión de Tiendas</h2>
        <p className="text-muted-foreground">Listado de todos los vendedores registrados en Nexteshop.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-bold">Tienda</TableHead>
              <TableHead className="font-bold">Subdominio</TableHead>
              <TableHead className="font-bold">Plan</TableHead>
              <TableHead className="font-bold">Productos</TableHead>
              <TableHead className="font-bold">Órdenes</TableHead>
              <TableHead className="font-bold">MercadoPago</TableHead>
              <TableHead className="text-right font-bold">Estado Suscripción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tenants.map((tenant) => (
              <TableRow key={tenant.id} className="hover:bg-slate-50/50">
                <TableCell className="font-bold">{tenant.name}</TableCell>
                <TableCell className="text-slate-500">{tenant.subdomain}.nexteshop.com</TableCell>
                <TableCell>
                  <Badge variant="outline" className="border-blue-200 text-blue-700">
                    {tenant.plan === "PRO" ? "Plan Pro ($10.000)" : "Prueba Gratis"}
                  </Badge>
                </TableCell>
                <TableCell>{tenant._count.products}</TableCell>
                <TableCell>{tenant._count.orders}</TableCell>
                <TableCell>
                   {tenant.mpAccessToken ? (
                     <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Conectado</Badge>
                   ) : (
                     <Badge variant="outline" className="text-slate-400">Desconectado</Badge>
                   )}
                </TableCell>
                <TableCell className="text-right">
                  {tenant.status === "ACTIVE" ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200">Activa</Badge>
                  ) : (
                    <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">Suspendida</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {tenants.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-slate-400">
                  No hay tiendas registradas aún.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
