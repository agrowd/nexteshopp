"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createCategory(name: string) {
  const session = await auth();
  const tenantId = session?.user?.tenantId;
  if (!tenantId) throw new Error("No autorizado");

  await prisma.category.create({
    data: {
      name,
      tenantId
    }
  });

  revalidatePath("/app/products");
}

export async function deleteCategory(id: string) {
  const session = await auth();
  const tenantId = session?.user?.tenantId;
  if (!tenantId) throw new Error("No autorizado");

  await prisma.category.delete({
    where: { id, tenantId }
  });

  revalidatePath("/app/products");
}
