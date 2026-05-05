import { getTenant } from "@/lib/get-tenant";
import { notFound } from "next/navigation";
import { MinimalistTheme } from "./_components/MinimalistTheme";
import { VibrantTheme } from "./_components/VibrantTheme";

import { prisma } from "@/lib/prisma";

export default async function TenantPage({ 
  params 
}: { 
  params: Promise<{ domain: string }> 
}) {
  const { domain } = await params;
  const tenant = await getTenant(domain);

  if (!tenant) notFound();

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { tenantId: tenant.id },
      orderBy: { createdAt: 'desc' },
      include: { variants: true, category: true }
    }),
    prisma.category.findMany({
      where: { tenantId: tenant.id },
      orderBy: { name: 'asc' }
    })
  ]);

  // El vendedor puede elegir su diseño, por defecto 'minimalist'
  const themeSettings = (tenant.theme as { activeTheme?: string }) || { activeTheme: 'minimalist' };

  if (themeSettings.activeTheme === 'vibrant') {
    return <VibrantTheme tenant={tenant} products={products} categories={categories} />;
  }

  return <MinimalistTheme tenant={tenant} products={products} categories={categories} />;
}
