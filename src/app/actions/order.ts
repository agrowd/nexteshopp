"use server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(formData: FormData) {
  const session = await auth();
  const tenantId = session?.user?.tenantId;
  if (!tenantId) throw new Error("No autorizado");

  const orderId = formData.get("orderId") as string;
  const status = formData.get("status") as string;

  await prisma.order.update({
    where: { id: orderId, tenantId },
    data: { status }
  });

  revalidatePath("/app/orders");
}
