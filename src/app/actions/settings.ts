"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function updatePaymentSettings(formData: FormData) {
  const session = await auth();
  const tenantId = session?.user?.tenantId;
  if (!tenantId) throw new Error("No autorizado");

  const cashEnabled = formData.get("cashEnabled") === "on";
  const transferEnabled = formData.get("transferEnabled") === "on";
  const bankDetails = formData.get("bankDetails") as string;
  const flatRate = parseFloat(formData.get("flatRate") as string) || 0;
  const pickupEnabled = formData.get("pickupEnabled") === "on";

  await prisma.tenant.update({
    where: { id: tenantId },
    data: {
      paymentSettings: {
        cashEnabled,
        transferEnabled,
        bankDetails
      },
      shippingSettings: {
        flatRate,
        pickupEnabled
      }
    }
  });

  revalidatePath("/app/settings/payments");
}

export async function disconnectMercadoPago() {
  const session = await auth();
  const tenantId = session?.user?.tenantId;
  if (!tenantId) throw new Error("No autorizado");

  await prisma.tenant.update({
    where: { id: tenantId },
    data: {
      mpAccessToken: null,
      mpUserId: null
    }
  });
  revalidatePath("/app/settings/payments");
}

import { writeFile } from "fs/promises";
import { join } from "path";
import * as fs from "fs";

export async function updateStoreSettings(formData: FormData) {
  const session = await auth();
  const tenantId = session?.user?.tenantId;
  if (!tenantId) throw new Error("No autorizado");

  const name = formData.get("name") as string;
  const subdomain = formData.get("subdomain") as string;
  const domain = formData.get("domain") as string || null;
  
  const theme = formData.get("theme") as string;
  const primaryColor = formData.get("primaryColor") as string;
  const fontFamily = formData.get("fontFamily") as string;
  let logoUrl = formData.get("logoUrl") as string || null;

  let heroUrl = formData.get("heroUrl") as string || null;
  let faviconUrl = formData.get("faviconUrl") as string || null;

  const whatsapp = formData.get("whatsapp") as string || "";
  const instagram = formData.get("instagram") as string || "";
  const facebook = formData.get("facebook") as string || "";
  const tiktok = formData.get("tiktok") as string || "";
  
  const aboutUs = formData.get("aboutUs") as string || "";
  const aboutUsPosition = formData.get("aboutUsPosition") as string || "both";
  const policies = formData.get("policies") as string || "";

  const uploadFile = async (file: File | null) => {
    if (!file || file.size === 0) return null;
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, "");
    const filename = `${uniqueSuffix}-${cleanName}`;
    const uploadDir = join(process.cwd(), "public", "uploads");
    const path = join(uploadDir, filename);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    await writeFile(path, buffer);
    return `/uploads/${filename}`;
  };

  const newLogoUrl = await uploadFile(formData.get("logoFile") as File | null);
  if (newLogoUrl) logoUrl = newLogoUrl;

  const newHeroUrl = await uploadFile(formData.get("heroFile") as File | null);
  if (newHeroUrl) heroUrl = newHeroUrl;

  const newFaviconUrl = await uploadFile(formData.get("faviconFile") as File | null);
  if (newFaviconUrl) faviconUrl = newFaviconUrl;

  // Basic validation for subdomain uniqueness
  const existingSubdomain = await prisma.tenant.findUnique({ where: { subdomain } });
  if (existingSubdomain && existingSubdomain.id !== tenantId) {
    throw new Error("El subdominio ya está en uso");
  }

  // Basic validation for domain uniqueness
  if (domain) {
    const existingDomain = await prisma.tenant.findUnique({ where: { domain } });
    if (existingDomain && existingDomain.id !== tenantId) {
      throw new Error("El dominio ya está en uso por otra tienda");
    }
  }

  await prisma.tenant.update({
    where: { id: tenantId },
    data: {
      name,
      subdomain,
      domain,
      theme: { 
        activeTheme: theme,
        primaryColor: primaryColor || "#000000",
        fontFamily: fontFamily || "Inter",
        logoUrl,
        heroUrl,
        faviconUrl,
        whatsapp,
        socialLinks: {
          instagram,
          facebook,
          tiktok
        },
        aboutUs,
        aboutUsPosition,
        policies
      }
    }
  });

  revalidatePath("/app/settings/store");
}
