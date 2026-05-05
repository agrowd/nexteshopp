import { MercadoPagoConfig, PreApprovalPlan } from "mercadopago";
import "dotenv/config";

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN || "" 
});

async function createPlan() {
  const plan = new PreApprovalPlan(client);

  try {
    const result = await plan.create({
      body: {
        reason: "Nexteshop Pro Plan",
        auto_recurring: {
          frequency: 1,
          frequency_type: "months",
          transaction_amount: 10000,
          currency_id: "ARS"
        },
        back_url: "https://nexteshop.com",
      }
    });

    console.log("¡Plan creado con éxito!");
    console.log("ID del Plan:", result.id);
    console.log("Copia este ID y ponlo en tu .env como MP_PLAN_ID");
  } catch (error) {
    console.error("Error creando el plan:", error);
  }
}

createPlan();
