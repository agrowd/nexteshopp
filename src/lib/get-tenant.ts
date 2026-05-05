import { prisma } from "./prisma";

export async function getTenant(domain: string) {
  // Si no se provee un dominio o es "localhost", "app", "admin", retornamos null.
  // El middleware ya los filtra, pero es doble seguridad.
  if (!domain || ['app', 'admin', 'localhost', '127.0.0.1'].includes(domain)) {
    return null;
  }

  // Buscar por subdominio primero
  let tenant = await prisma.tenant.findUnique({
    where: { subdomain: domain }
  });

  // Si no existe, buscar por dominio custom
  if (!tenant) {
    tenant = await prisma.tenant.findUnique({
      where: { domain: domain }
    });
  }

  return tenant;
}
