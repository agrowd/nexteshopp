"use server";

import { auth } from "@/auth";
import { MercadoPagoConfig, PreApproval } from "mercadopago";

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN || "" 
});

export async function createSubscriptionPreference() {
  const session = await auth();
  const tenantId = session?.user?.tenantId;
  const email = session?.user?.email;

  if (!tenantId || !email) throw new Error("No autorizado");

  const preApproval = new PreApproval(client);

  // NOTA: Para producción necesitas un preapproval_plan_id creado previamente.
  // Si no tienes uno, esto fallará. Por ahora crearemos una suscripción "ad-hoc"
  // o usaremos una variable de entorno.
  
  const planId = process.env.MP_PLAN_ID;
  
  if (!planId) {
    throw new Error("MP_PLAN_ID no configurado en el servidor");
  }

  const result = await preApproval.create({
    body: {
      preapproval_plan_id: planId,
      payer_email: email,
      back_url: `${process.env.NEXT_PUBLIC_APP_URL}/app/settings/subscription/success`,
      reason: "Suscripción Nexteshop Pro",
      external_reference: tenantId, // Vinculamos con el ID de la tienda
    }
  });
  
  return { initPoint: result.init_point };
}
