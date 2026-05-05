"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/lib/store/useCartStore";
import { createOrder } from "@/app/actions/checkout";
import { validateCoupon } from "@/app/actions/coupon";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CheckoutForm({ tenantId, paymentSettings, shippingSettings, mpConnected }: { tenantId: string, paymentSettings: any, shippingSettings: any, mpConnected: boolean }) {
  const { items, clearCart } = useCartStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [shippingType, setShippingType] = useState("pickup");
  const [method, setMethod] = useState("CASH");
  const [file, setFile] = useState<File | null>(null);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponResult, setCouponResult] = useState<{ valid: boolean, discount?: number, message?: string, code?: string } | null>(null);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  if (items.length === 0) return <p className="text-center py-20 text-xl font-bold">Tu carrito está vacío.</p>;

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = shippingType === "delivery" ? (shippingSettings.flatRate || 0) : 0;
  const discount = couponResult?.valid ? (couponResult.discount || 0) : 0;
  const total = Math.max(0, subtotal + shippingCost - discount);

  async function handleValidateCoupon() {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    try {
      const result = await validateCoupon(tenantId, couponCode, subtotal);
      setCouponResult(result);
      if (result.valid) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (e: any) {
      toast.error(e.message || "Error al validar cupón");
    } finally {
      setCouponLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      let paymentProofUrl = "";
      if (method === "TRANSFER" && file) {
        const fileData = new FormData();
        fileData.append("file", file);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: fileData });
        const uploadJson = await uploadRes.json();
        if (uploadJson.url) paymentProofUrl = uploadJson.url;
      }
      
      formData.append("paymentMethod", method);
      formData.append("paymentProofUrl", paymentProofUrl);
      formData.append("shippingType", shippingType);
      if (couponResult?.valid && couponResult.code) {
        formData.append("couponCode", couponResult.code);
      }

      const itemsJson = JSON.stringify(items);
      const res = await createOrder(tenantId, itemsJson, formData, window.location.origin);
      
      clearCart();
      toast.success("¡Pedido creado exitosamente!");

      if (res.initPoint) {
        window.location.href = res.initPoint;
      } else {
        router.push("/");
      }

    } catch (error: any) {
      toast.error(error.message || "Error al procesar el pedido");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-slate-50 p-6 rounded-lg border space-y-4">
        <h2 className="text-xl font-bold">1. Tus Datos</h2>
        <div className="space-y-2">
          <Label>Nombre Completo</Label>
          <Input name="customerName" required />
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input type="email" name="customerEmail" required />
        </div>
        <div className="space-y-2">
          <Label>WhatsApp</Label>
          <Input name="whatsapp" required />
        </div>
      </div>

      <div className="bg-slate-50 p-6 rounded-lg border space-y-4">
        <h2 className="text-xl font-bold">2. Entrega</h2>
        <div className="space-y-3">
          {shippingSettings.pickupEnabled !== false && (
            <label className="flex items-center gap-3 p-4 border rounded cursor-pointer bg-white">
              <input type="radio" name="shippingType" value="pickup" checked={shippingType === "pickup"} onChange={() => setShippingType("pickup")} />
              <span>Retiro en el local (Gratis)</span>
            </label>
          )}
          <label className="flex items-center gap-3 p-4 border rounded cursor-pointer bg-white">
            <input type="radio" name="shippingType" value="delivery" checked={shippingType === "delivery"} onChange={() => setShippingType("delivery")} />
            <span>Envío a domicilio (${shippingSettings.flatRate || 0})</span>
          </label>
        </div>

        {shippingType === "delivery" && (
          <div className="grid grid-cols-2 gap-4 mt-4 p-4 border rounded bg-white">
            <div className="space-y-2 col-span-2">
              <Label>Dirección Completa</Label>
              <Input name="customerAddress" required />
            </div>
            <div className="space-y-2">
              <Label>Código Postal</Label>
              <Input name="customerZipCode" required />
            </div>
            <div className="space-y-2">
              <Label>Ciudad / Provincia</Label>
              <Input name="customerCity" required />
            </div>
          </div>
        )}
      </div>

      <div className="bg-slate-50 p-6 rounded-lg border space-y-4">
        <h2 className="text-xl font-bold">3. Cupón de Descuento</h2>
        <div className="flex gap-2">
          <Input 
            placeholder="Ej: HOTSALE20" 
            value={couponCode} 
            onChange={(e) => { setCouponCode(e.target.value); setCouponResult(null); }} 
            className="uppercase max-w-xs"
          />
          <Button type="button" variant="outline" onClick={handleValidateCoupon} disabled={couponLoading || !couponCode.trim()}>
            {couponLoading ? "Validando..." : "Aplicar"}
          </Button>
        </div>
        {couponResult && (
          <div className={`p-3 rounded-lg text-sm font-medium ${couponResult.valid ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {couponResult.valid ? `✓ ${couponResult.message} (-$${discount.toLocaleString("es-AR")})` : `✗ ${couponResult.message}`}
          </div>
        )}
      </div>

      <div className="bg-slate-50 p-6 rounded-lg border space-y-4">
        <h2 className="text-xl font-bold">4. Método de Pago</h2>
        <div className="space-y-3">
          {mpConnected && (
            <label className="flex items-center gap-3 p-4 border rounded cursor-pointer bg-white border-blue-500 shadow-sm">
              <input type="radio" name="method" value="MERCADOPAGO" checked={method === "MERCADOPAGO"} onChange={() => setMethod("MERCADOPAGO")} />
              <span className="font-bold text-blue-600">MercadoPago (Tarjetas de crédito/débito y saldo)</span>
            </label>
          )}
          {paymentSettings.cashEnabled !== false && (
            <label className="flex items-center gap-3 p-4 border rounded cursor-pointer bg-white">
              <input type="radio" name="method" value="CASH" checked={method === "CASH"} onChange={() => setMethod("CASH")} />
              <span>Efectivo (Acordar con el vendedor)</span>
            </label>
          )}
          {paymentSettings.transferEnabled !== false && (
            <label className="flex items-center gap-3 p-4 border rounded cursor-pointer bg-white">
              <input type="radio" name="method" value="TRANSFER" checked={method === "TRANSFER"} onChange={() => setMethod("TRANSFER")} />
              <span>Transferencia Bancaria</span>
            </label>
          )}
        </div>

        {method === "TRANSFER" && (
          <div className="mt-4 p-4 bg-blue-50 text-blue-900 rounded border border-blue-200">
            <p className="font-bold mb-2">Datos para la transferencia:</p>
            <p className="whitespace-pre-wrap">{paymentSettings.bankDetails || "CBU: 00000000000000\nAlias: mi.tienda"}</p>
            <div className="mt-4 space-y-2">
              <Label>Sube tu comprobante</Label>
              <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} required />
            </div>
          </div>
        )}
      </div>

      <div className="bg-slate-900 text-white p-6 rounded-lg space-y-3">
        <div className="flex justify-between text-slate-400 text-sm">
          <span>Subtotal</span>
          <span>${subtotal.toLocaleString("es-AR")}</span>
        </div>
        {shippingCost > 0 && (
          <div className="flex justify-between text-slate-400 text-sm">
            <span>Envío</span>
            <span>${shippingCost.toLocaleString("es-AR")}</span>
          </div>
        )}
        {discount > 0 && (
          <div className="flex justify-between text-green-400 text-sm font-medium">
            <span>Descuento ({couponResult?.code})</span>
            <span>-${discount.toLocaleString("es-AR")}</span>
          </div>
        )}
        <div className="border-t border-slate-700 pt-3 flex justify-between items-center">
          <div>
            <p className="text-slate-400 text-xs">Total a pagar</p>
            <p className="text-3xl font-bold">${total.toLocaleString("es-AR")}</p>
          </div>
          <Button size="lg" disabled={loading} className="bg-white text-black hover:bg-slate-200 font-bold px-8">
            {loading ? "Procesando..." : "Confirmar Pedido"}
          </Button>
        </div>
      </div>
    </form>
  );
}

