import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (static files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};

export default function proxy(req: NextRequest) {
  const url = req.nextUrl;
  
  // Obtener el hostname (ej: mi-tienda.nexteshop.com, app.nexteshop.com, o midominio.com)
  const hostname = req.headers.get('host') || 'localhost:3000';

  // Dominio raíz (ej: nexteshop.com o localhost:3000)
  const mainDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000';
  
  // Extraer el subdominio o dejar el dominio personalizado
  let currentHost = hostname.replace(`.${mainDomain}`, '');

  // 1. Landing Page principal (nexteshop.com)
  if (hostname === mainDomain) {
    return NextResponse.rewrite(new URL(`/home${url.pathname}`, req.url));
  }

  // 2. Dashboard de Vendedores (app.nexteshop.com)
  if (currentHost === 'app') {
    return NextResponse.rewrite(new URL(`/app${url.pathname}`, req.url));
  }

  // 3. Tiendas de los Vendedores (Subdominios o Dominios Propios)
  // Reescribe a `/[domain]/path` (App Router procesará el segmento dinámico [domain])
  return NextResponse.rewrite(new URL(`/${currentHost}${url.pathname}`, req.url));
}
