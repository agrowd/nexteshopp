import { getTenant } from "@/lib/get-tenant";
import { notFound } from "next/navigation";

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;
  const tenant = await getTenant(domain);

  if (!tenant) {
    notFound();
  }

  return (
    <div className="w-full">
      {children}
    </div>
  );
}

export async function generateMetadata({ params }: { params: Promise<{ domain: string }> }) {
  const { domain } = await params;
  const tenant = await getTenant(domain);
  if (!tenant) return {};

  const theme = tenant.theme as any || {};
  return {
    title: tenant.name,
    icons: theme.faviconUrl ? {
      icon: theme.faviconUrl,
    } : undefined,
  };
}
