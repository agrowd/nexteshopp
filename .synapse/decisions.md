# Decisiones Técnicas

| ID | Decisión Técnica | La Razón (The Why) | Estado |
|:---|:---|:---|:---|
| D-01 | **Arquitectura Multi-Tenant con Next.js Middleware** | Necesitamos servir múltiples tiendas desde un solo código base usando el header `Host`. | 🟢 ACTIVE |
| D-02 | **MercadoPago Connect (OAuth)** | Evita contacto B2B manual para que cada vendedor cobre; permite cobrar una comisión (`application_fee`). | 🟢 ACTIVE |
| D-03 | **Caddy Server (On-Demand TLS)** | Permite que cada tienda conecte su dominio propio y obtenga certificado SSL automático en el VPS sin reinicios manuales. | 🟢 ACTIVE |
| D-04 | **MercadoPago Suscripciones** | El cobro mensual a las tiendas se realizará automatizado por MP Suscripciones. | 🔒 LOCKED |
| D-05 | **Storage Local -> Cloudinary** | Las imágenes se guardarán localmente en el VPS inicialmente por costos, abstrayendo la lógica para migrar fácil a Cloudinary al escalar. | 🔒 LOCKED |
| D-06 | **UI con shadcn/ui + Tailwind** | Permite crear un dashboard premium y dinámico rápido sin atarse a librerías monolíticas. | 🔒 LOCKED |
| D-07 | **Soporte Multi-Tema (Storefront)** | Se implementarán motores de renderizado duales o inyección de CSS para permitir elegir entre temas Minimalistas y Vibrantes. | 🔒 LOCKED |
