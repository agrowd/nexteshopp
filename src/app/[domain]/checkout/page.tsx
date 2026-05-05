import { getTenant } from "@/lib/get-tenant";
import { notFound } from "next/navigation";
import { CheckoutForm } from "./_components/CheckoutForm";

export default async function CheckoutPage({ params }: { params: Promise<{ domain: string }> }) {
  const { domain } = await params;
  const tenant = await getTenant(domain);

  if (!tenant) notFound();

  const paymentSettings = tenant.paymentSettings as any || { cashEnabled: true, transferEnabled: true, bankDetails: '' };
  const shippingSettings = tenant.shippingSettings as any || { flatRate: 0, pickupEnabled: true };
  const mpConnected = !!tenant.mpAccessToken;

  return (
    <div className="max-w-3xl mx-auto py-12 px-6 bg-white min-h-screen">
      <h1 className="text-3xl font-black mb-8">Finalizar Compra</h1>
      <CheckoutForm 
        tenantId={tenant.id} 
        paymentSettings={paymentSettings} 
        shippingSettings={shippingSettings} 
        mpConnected={mpConnected} 
      />
    </div>
  );
}
