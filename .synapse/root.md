# Arquitectura Base - Nexteshop

**Estado:** Inicialización
**Proyecto:** Plataforma SaaS E-commerce (Multi-tenant)
**Stack Previsto:** Next.js (App Router), PostgreSQL, Prisma, Caddy (Reverse Proxy).

## Módulos Principales
- **Core Tenant:** Enrutamiento por subdominios y dominios customizados.
- **Ventas & Pagos:** Integración con MercadoPago Connect (Split Payments).
- **Logística:** Middleware de envíos (EnvioPack/Zipnova).
- **Personalización:** Plantillas inyectadas mediante CSS Variables desde la base de datos.
