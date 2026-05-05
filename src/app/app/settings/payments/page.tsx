import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Button, buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { updatePaymentSettings, disconnectMercadoPago } from "@/app/actions/settings";
import Link from "next/link";

export default async function PaymentSettingsPage() {
  const session = await auth();
  const tenantId = session?.user?.tenantId;
  
  if (!tenantId) return null;

  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
  const settings = (tenant?.paymentSettings as any) || { cashEnabled: true, transferEnabled: false, bankDetails: "" };
  const shipping = (tenant?.shippingSettings as any) || { flatRate: 0, pickupEnabled: true };

  const clientId = process.env.MP_CLIENT_ID || "";
  const redirectUri = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/mp/callback`;
  const mpAuthUrl = `https://auth.mercadopago.com/authorization?client_id=${clientId}&response_type=code&platform_id=mp&state=random_id&redirect_uri=${encodeURIComponent(redirectUri)}`;

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-10">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Cobros y Envíos</h2>
        <p className="text-muted-foreground">Configura cómo tus clientes pueden pagarte y cómo entregas.</p>
      </div>

      <div className="bg-white p-6 rounded border shadow-sm space-y-6">
        <h3 className="text-lg font-bold">MercadoPago (Cobro Automático)</h3>
        {tenant?.mpAccessToken ? (
          <div className="space-y-4">
            <div className="bg-green-50 text-green-800 p-4 rounded border border-green-200 font-medium">
              ✅ Cuenta de MercadoPago vinculada exitosamente. ¡Ya puedes recibir pagos con tarjeta!
            </div>
            <form action={disconnectMercadoPago}>
              <Button variant="outline" type="submit" className="text-red-600 border-red-200 hover:bg-red-50">Desvincular Cuenta</Button>
            </form>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-slate-600">Vincula tu cuenta para cobrar con tarjetas y dinero en cuenta. El dinero irá directamente a tu cuenta de MercadoPago (menos nuestra mínima comisión).</p>
            <Link href={mpAuthUrl} className={buttonVariants({ className: "bg-blue-600 hover:bg-blue-700" })}>
              Vincular Cuenta de MercadoPago
            </Link>
          </div>
        )}
      </div>

      <form action={updatePaymentSettings} className="space-y-8 bg-white p-6 rounded border shadow-sm">
        <div className="space-y-6">
          <h3 className="text-lg font-bold border-b pb-2">Pagos Manuales</h3>
          <div className="space-y-4">
            <label className="flex items-center gap-2 font-bold cursor-pointer">
              <input type="checkbox" name="cashEnabled" defaultChecked={settings.cashEnabled} />
              Habilitar Pago en Efectivo (Acordar con vendedor)
            </label>
            <label className="flex items-center gap-2 font-bold cursor-pointer">
              <input type="checkbox" name="transferEnabled" defaultChecked={settings.transferEnabled} />
              Habilitar Transferencia Bancaria
            </label>
          </div>

          <div className="space-y-2">
            <Label>Datos Bancarios (CBU, Alias, Titular)</Label>
            <Textarea 
              name="bankDetails" 
              defaultValue={settings.bankDetails} 
              placeholder="Ej: Alias: mi.tienda.mp, CBU: 000..." 
              rows={4} 
            />
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-bold border-b pb-2">Logística y Envíos</h3>
          
          <label className="flex items-center gap-2 font-bold cursor-pointer">
            <input type="checkbox" name="pickupEnabled" defaultChecked={shipping.pickupEnabled} />
            Habilitar Retiro en Local (Gratis)
          </label>

          <div className="space-y-2">
            <Label>Costo de Envío a Domicilio Fijo ($)</Label>
            <Input 
              type="number" 
              name="flatRate" 
              defaultValue={shipping.flatRate} 
              placeholder="Ej: 3500" 
            />
            <p className="text-xs text-slate-500">Cobraremos este monto extra cuando el cliente pida envío a domicilio.</p>
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full">Guardar Configuración</Button>
      </form>
    </div>
  );
}
