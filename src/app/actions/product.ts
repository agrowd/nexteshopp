"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// Función auxiliar para obtener el tenantId del usuario actual
async function getSessionTenantId() {
  const session = await auth();
  if (!session?.user?.tenantId) {
    throw new Error("No estás autorizado o no tienes una tienda asignada.");
  }
  return session.user.tenantId;
}

export async function getProducts() {
  const tenantId = await getSessionTenantId();
  return prisma.product.findMany({
    where: { tenantId },
    orderBy: { createdAt: 'desc' },
    include: { category: true, variants: true }
  });
}

export async function getCategories() {
  const tenantId = await getSessionTenantId();
  return prisma.category.findMany({
    where: { tenantId },
    orderBy: { name: 'asc' },
    include: { _count: { select: { products: true } } }
  });
}

export async function createProduct(formData: FormData) {
  const tenantId = await getSessionTenantId();
  
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string, 10);
  const categoryId = formData.get("categoryId") as string || null;
  const imageUrl = formData.get("imageUrl") as string || null;
  const variantsJson = formData.get("variants") as string;
  
  let variants = [];
  try {
    if (variantsJson) variants = JSON.parse(variantsJson);
  } catch (e) { console.error("Error parsing variants", e); }

  if (!name || isNaN(price)) {
    throw new Error("El nombre y el precio son obligatorios.");
  }

  const images = imageUrl ? [imageUrl] : [];

  await prisma.product.create({
    data: {
      tenantId,
      categoryId: categoryId === "none" ? null : categoryId,
      name,
      description,
      price,
      stock: isNaN(stock) ? 0 : stock,
      images,
      variants: {
        create: variants.map((v: any) => ({
          name: v.name,
          value: v.value,
          price: v.price ? parseFloat(v.price) : null,
          stock: parseInt(v.stock, 10) || 0
        }))
      }
    }
  });

  revalidatePath("/app/products");
}

export async function getProductById(id: string) {
  const tenantId = await getSessionTenantId();
  return prisma.product.findUnique({
    where: { id, tenantId },
    include: { variants: true }
  });
}

export async function updateProduct(id: string, formData: FormData) {
  const tenantId = await getSessionTenantId();
  
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseFloat(formData.get("price") as string);
  const stock = parseInt(formData.get("stock") as string, 10);
  const categoryId = formData.get("categoryId") as string || null;
  const imageUrl = formData.get("imageUrl") as string || null;
  const variantsJson = formData.get("variants") as string;
  
  let variants = [];
  try {
    if (variantsJson) variants = JSON.parse(variantsJson);
  } catch (e) { console.error("Error parsing variants", e); }

  if (!name || isNaN(price)) {
    throw new Error("El nombre y el precio son obligatorios.");
  }

  // Obtenemos el producto actual para mantener las imágenes si no se sube una nueva
  const currentProduct = await prisma.product.findUnique({ where: { id, tenantId } });
  if (!currentProduct) throw new Error("Producto no encontrado");

  let images = currentProduct.images;
  if (imageUrl) {
    images = [imageUrl];
  }

  // Actualizamos el producto y sus variantes
  // Para simplificar, borramos las variantes anteriores y creamos las nuevas
  await prisma.$transaction([
    prisma.productVariant.deleteMany({ where: { productId: id } }),
    prisma.product.update({
      where: { id },
      data: {
        categoryId: categoryId === "none" ? null : categoryId,
        name,
        description,
        price,
        stock: isNaN(stock) ? 0 : stock,
        images,
        variants: {
          create: variants.map((v: any) => ({
            name: v.name,
            value: v.value,
            price: v.price ? parseFloat(v.price) : null,
            stock: parseInt(v.stock, 10) || 0
          }))
        }
      }
    })
  ]);

  revalidatePath("/app/products");
}

export async function deleteProduct(id: string) {
  const tenantId = await getSessionTenantId();
  
  // Verificamos que el producto pertenezca al tenant actual por seguridad
  const product = await prisma.product.findUnique({ where: { id } });
  if (product?.tenantId !== tenantId) {
    throw new Error("No autorizado");
  }

  await prisma.product.delete({
    where: { id }
  });

  revalidatePath("/app/products");
}
