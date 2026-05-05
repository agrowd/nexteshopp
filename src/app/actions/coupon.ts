"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// ── CRUD de Cupones (Dashboard del Vendedor) ──

export async function getCoupons() {
  const session = await auth();
  const tenantId = session?.user?.tenantId;
  if (!tenantId) throw new Error("No autorizado");

  return prisma.coupon.findMany({
    where: { tenantId },
    orderBy: { createdAt: "desc" }
  });
}

export async function createCoupon(formData: FormData) {
  const session = await auth();
  const tenantId = session?.user?.tenantId;
  if (!tenantId) throw new Error("No autorizado");

  const code = (formData.get("code") as string).toUpperCase().trim();
  const type = formData.get("type") as string;
  const value = parseFloat(formData.get("value") as string);
  const minAmount = formData.get("minAmount") ? parseFloat(formData.get("minAmount") as string) : null;
  const maxUses = formData.get("maxUses") ? parseInt(formData.get("maxUses") as string, 10) : null;
  const expiresAt = formData.get("expiresAt") ? new Date(formData.get("expiresAt") as string) : null;

  if (!code || isNaN(value)) throw new Error("Código y valor son obligatorios");

  await prisma.coupon.create({
    data: { tenantId, code, type, value, minAmount, maxUses, expiresAt }
  });

  revalidatePath("/app/coupons");
}

export async function deleteCoupon(id: string) {
  const session = await auth();
  const tenantId = session?.user?.tenantId;
  if (!tenantId) throw new Error("No autorizado");

  await prisma.coupon.delete({ where: { id, tenantId } });
  revalidatePath("/app/coupons");
}

export async function toggleCoupon(id: string) {
  const session = await auth();
  const tenantId = session?.user?.tenantId;
  if (!tenantId) throw new Error("No autorizado");

  const coupon = await prisma.coupon.findUnique({ where: { id, tenantId } });
  if (!coupon) throw new Error("Cupón no encontrado");

  await prisma.coupon.update({
    where: { id },
    data: { active: !coupon.active }
  });
  revalidatePath("/app/coupons");
}

// ── Validar cupón (Tienda Pública / Checkout) ──

export async function validateCoupon(tenantId: string, code: string, subtotal: number) {
  const coupon = await prisma.coupon.findUnique({
    where: { tenantId_code: { tenantId, code: code.toUpperCase().trim() } }
  });

  if (!coupon) return { valid: false, message: "Cupón no encontrado" };
  if (!coupon.active) return { valid: false, message: "Cupón inactivo" };
  if (coupon.expiresAt && coupon.expiresAt < new Date()) return { valid: false, message: "Cupón expirado" };
  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return { valid: false, message: "Cupón agotado" };
  if (coupon.minAmount && subtotal < coupon.minAmount) return { valid: false, message: `Compra mínima: $${coupon.minAmount.toLocaleString("es-AR")}` };

  const discount = coupon.type === "PERCENTAGE"
    ? Math.round(subtotal * (coupon.value / 100))
    : coupon.value;

  return {
    valid: true,
    discount,
    type: coupon.type,
    value: coupon.value,
    code: coupon.code,
    message: coupon.type === "PERCENTAGE" ? `${coupon.value}% de descuento` : `$${coupon.value.toLocaleString("es-AR")} de descuento`
  };
}
