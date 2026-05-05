import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, data, action } = body;

    console.log("MP Webhook Received:", { type, action, data });

    // 1. Manejar pagos de suscripción (Pre-approvals)
    if (type === "subscription_preapproval" || action === "subscription_preapproval.created") {
        const preapprovalId = data.id;
        
        // Consultar a MP para obtener el external_reference (tenantId)
        // Por ahora simularemos que el external_reference viene en el cuerpo o lo buscamos
        // En una implementación real usarías: await preApproval.get({ id: preapprovalId })

        // Supongamos que lo encontramos:
        const tenantId = body.external_reference; // Asegúrate de enviarlo en el create
        
        if (tenantId) {
            await prisma.tenant.update({
                where: { id: tenantId },
                data: {
                    status: "ACTIVE",
                    plan: "PRO",
                    subscriptionId: preapprovalId
                }
            });
            console.log(`Tenant ${tenantId} activado como PRO.`);
        }
    }

    // 2. Manejar pagos individuales (si no usamos el módulo de suscripciones puras)
    if (type === "payment" && action === "payment.created") {
        // Buscar el pago y verificar si pertenece a una suscripción de Tenant
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
