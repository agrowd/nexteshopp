"use server";

import { MercadoPagoConfig, Preference } from 'mercadopago';

export async function createPreference(accessToken: string, orderData: any) {
  // Configurar MercadoPago con el token del vendedor (Tenant)
  const client = new MercadoPagoConfig({ accessToken });
  const preference = new Preference(client);

  const result = await preference.create({
    body: {
      items: orderData.items.map((i: any) => ({
        id: i.id,
        title: i.name,
        quantity: i.quantity,
        unit_price: i.price,
        currency_id: "ARS"
      })),
      shipments: {
        cost: orderData.shippingCost || 0,
      },
      payer: {
        email: orderData.customerEmail,
        name: orderData.customerName,
      },
      back_urls: {
        success: `${orderData.domain}/checkout/success`,
        failure: `${orderData.domain}/checkout/failure`,
        pending: `${orderData.domain}/checkout/pending`
      },
      auto_return: "approved",
      external_reference: orderData.orderId,
      // marketplace_fee: orderData.total * 0.05 // Descomentar para cobrar comisión de SaaS
    }
  });

  return result.init_point;
}
