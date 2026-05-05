import { getCoupons, createCoupon, deleteCoupon, toggleCoupon } from "@/app/actions/coupon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function CouponsPage() {
  const coupons = await getCoupons();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Cupones de Descuento</h2>
          <p className="text-muted-foreground">Crea códigos promocionales para tus clientes.</p>
        </div>
      </div>

      {/* Formulario de creación */}
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="font-bold mb-4">Crear Nuevo Cupón</h3>
        <form action={createCoupon} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label>Código</Label>
            <Input name="code" placeholder="HOTSALE20" required className="uppercase" />
          </div>
          <div className="space-y-2">
            <Label>Tipo</Label>
            <select name="type" className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="PERCENTAGE">Porcentaje (%)</option>
              <option value="FIXED">Monto Fijo ($)</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>Valor</Label>
            <Input name="value" type="number" step="0.01" required placeholder="10" />
          </div>
          <div className="space-y-2">
            <Label>Compra Mínima</Label>
            <Input name="minAmount" type="number" step="0.01" placeholder="Opcional" />
          </div>
          <div className="space-y-2">
            <Label>Usos Máximos</Label>
            <Input name="maxUses" type="number" placeholder="Ilimitados" />
          </div>
          <div className="space-y-2">
            <Label>Fecha de Expiración</Label>
            <Input name="expiresAt" type="date" />
          </div>
          <div className="col-span-2 flex items-end">
            <Button type="submit" className="w-full">Crear Cupón</Button>
          </div>
        </form>
      </div>

      {/* Listado */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Descuento</TableHead>
              <TableHead>Mínimo</TableHead>
              <TableHead>Usos</TableHead>
              <TableHead>Expira</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coupons.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  No tienes cupones creados.
                </TableCell>
              </TableRow>
            ) : (
              coupons.map((coupon) => (
                <TableRow key={coupon.id}>
                  <TableCell className="font-mono font-bold text-lg">{coupon.code}</TableCell>
                  <TableCell className="font-medium">
                    {coupon.type === "PERCENTAGE" ? `${coupon.value}%` : `$${coupon.value.toLocaleString("es-AR")}`}
                  </TableCell>
                  <TableCell>{coupon.minAmount ? `$${coupon.minAmount.toLocaleString("es-AR")}` : "-"}</TableCell>
                  <TableCell>{coupon.usedCount}{coupon.maxUses ? `/${coupon.maxUses}` : "/∞"}</TableCell>
                  <TableCell className="text-xs">{coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : "Sin límite"}</TableCell>
                  <TableCell>
                    <Badge className={coupon.active ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-red-100 text-red-700 hover:bg-red-100"}>
                      {coupon.active ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <form action={async () => { "use server"; await toggleCoupon(coupon.id); }} className="inline-block">
                      <Button variant="outline" size="sm" type="submit">{coupon.active ? "Desactivar" : "Activar"}</Button>
                    </form>
                    <form action={async () => { "use server"; await deleteCoupon(coupon.id); }} className="inline-block">
                      <Button variant="destructive" size="sm" type="submit">Eliminar</Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
