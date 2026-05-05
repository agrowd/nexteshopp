"use server";

import { prisma } from "@/lib/prisma";
import { createPreference } from "./mercadopago";
import { validateCoupon } from "./coupon";

export async function createOrder(tenantId: string, itemsJson: string, formData: FormData, originUrl: string) {
  const customerName = formData.get("customerName") as string;
  const customerEmail = formData.get("customerEmail") as string;
  const whatsapp = formData.get("whatsapp") as string;
  const paymentMethod = formData.get("paymentMethod") as string;
  const paymentProof = formData.get("paymentProofUrl") as string || null;
  const shippingType = formData.get("shippingType") as string;
  const customerAddress = formData.get("customerAddress") as string || null;
  const customerZipCode = formData.get("customerZipCode") as string || null;
  const customerCity = formData.get("customerCity") as string || null;
  const couponCode = (formData.get("couponCode") as string || "").trim().toUpperCase();

  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
  if (!tenant) throw new Error("Tenant no encontrado");

  const shippingSettings = (tenant.shippingSettings as any) || { flatRate: 0, pickupEnabled: true };
  const shippingCost = shippingType === "delivery" ? shippingSettings.flatRate : 0;

  const items = JSON.parse(itemsJson) as { id: string, name: string, price: number, quantity: number, variantName?: string }[];

  if (!items || items.length === 0) {
    throw new Error("El carrito está vacío");
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // ── Validar cupón ──
  let discountAmount = 0;
  let appliedCouponCode: string | null = null;

  if (couponCode) {
    const couponResult = await validateCoupon(tenantId, couponCode, subtotal);
    if (!couponResult.valid) {
      throw new Error(couponResult.message);
    }
    discountAmount = couponResult.discount!;
    appliedCouponCode = couponResult.code!;
  }

  const total = Math.max(0, subtotal + shippingCost - discountAmount);

  // ── Verificar y descontar stock ──
  for (const item of items) {
    const product = await prisma.product.findUnique({
      where: { id: item.id },
      include: { variants: true }
    });

    if (!product) throw new Error(`Producto "${item.name}" no encontrado`);

    // Si el nombre contiene una variante, buscamos por ella
    if (product.variants.length > 0 && item.variantName) {
      const variant = product.variants.find(v => `${v.name}: ${v.value}` === item.variantName);
      if (variant) {
        if (variant.stock < item.quantity) throw new Error(`Stock insuficiente para "${item.name}" (${item.variantName})`);
        await prisma.productVariant.update({
          where: { id: variant.id },
          data: { stock: { decrement: item.quantity } }
        });
      }
    } else {
      if (product.stock < item.quantity) throw new Error(`Stock insuficiente para "${item.name}"`);
      await prisma.product.update({
        where: { id: item.id },
        data: { stock: { decrement: item.quantity } }
      });
    }
  }

  // ── Crear la orden ──
  const order = await prisma.order.create({
    data: {
      tenantId,
      customerName,
      customerEmail,
      whatsapp,
      customerAddress,
      customerZipCode,
      customerCity,
      shippingCost,
      total,
      discountAmount,
      couponCode: appliedCouponCode,
      paymentMethod,
      paymentProof,
      status: "PENDING",
      lines: {
        create: items.map(item => ({
          productId: item.id,
          variantName: item.variantName || null,
          quantity: item.quantity,
          price: item.price
        }))
      }
    }
  });

  // ── Incrementar uso del cupón ──
  if (appliedCouponCode) {
    await prisma.coupon.update({
      where: { tenantId_code: { tenantId, code: appliedCouponCode } },
      data: { usedCount: { increment: 1 } }
    });
  }

  // ── Redirigir a MP si corresponde ──
  if (paymentMethod === "MERCADOPAGO" && tenant.mpAccessToken) {
    const initPoint = await createPreference(tenant.mpAccessToken, {
      items,
      shippingCost,
      customerEmail,
      customerName,
      orderId: order.id,
      total,
      domain: originUrl
    });
    
    await prisma.order.update({
      where: { id: order.id },
      data: { mpPreferenceId: initPoint }
    });

    return { success: true, orderId: order.id, initPoint };
  }

  return { success: true, orderId: order.id };
}

