# Flujos de Lógica del Sistema

## Flujo de Pago Marketplace (MercadoPago Connect)
1. Vendedor autoriza a la app en MP.
2. Comprador inicia checkout.
3. Se crea preferencia con `access_token` del vendedor y `application_fee` para Nexteshop.
4. Pago procesado -> Webhook actualiza estado del pedido.
