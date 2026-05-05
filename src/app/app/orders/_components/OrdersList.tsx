"use client";

import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateOrderStatus } from "@/app/actions/order";
import { Badge } from "@/components/ui/badge";

export default function OrdersList({ orders }: { orders: any[] }) {
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const filteredOrders = orders.filter(order => 
    order.customerName?.toLowerCase().includes(search.toLowerCase()) ||
    order.customerEmail?.toLowerCase().includes(search.toLowerCase()) ||
    order.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Input 
          placeholder="Buscar por cliente o email..." 
          className="max-w-sm bg-white" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="rounded-md border bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Método</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Detalles / Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  No se encontraron pedidos.
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="text-xs">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="font-medium">{order.customerName}</div>
                    <div className="text-[10px] text-slate-500 uppercase">{order.whatsapp || order.customerEmail}</div>
                  </TableCell>
                  <TableCell className="font-bold">${order.total.toLocaleString("es-AR")}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px]">{order.paymentMethod}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold ${
                      order.status === 'PAID' ? 'bg-green-100 text-green-800' :
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-slate-100 text-slate-800'
                    }`}>
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedOrder(order)}>Detalles</Button>
                    {order.status === 'PENDING' && (
                      <form action={updateOrderStatus} className="inline-block">
                        <input type="hidden" name="orderId" value={order.id} />
                        <input type="hidden" name="status" value="PAID" />
                        <Button variant="default" size="sm" type="submit" className="bg-green-600 hover:bg-green-700">Pagar</Button>
                      </form>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modal de Detalles */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b bg-slate-50 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold">Detalle del Pedido #{selectedOrder.id.slice(-6)}</h3>
                <p className="text-sm text-slate-500">{new Date(selectedOrder.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-2xl hover:text-red-500 transition-colors">&times;</button>
            </div>
            
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Info Cliente */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <h4 className="text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-wider">Cliente</h4>
                  <p className="font-bold">{selectedOrder.customerName}</p>
                  <p className="text-sm">{selectedOrder.customerEmail}</p>
                  <p className="text-sm">{selectedOrder.whatsapp}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <h4 className="text-[10px] uppercase font-bold text-slate-400 mb-2 tracking-wider">Entrega</h4>
                  {selectedOrder.customerAddress ? (
                    <>
                      <p className="text-sm font-medium">{selectedOrder.customerAddress}</p>
                      <p className="text-xs text-slate-500">{selectedOrder.customerCity} - CP: {selectedOrder.customerZipCode}</p>
                    </>
                  ) : (
                    <p className="text-sm font-medium">Retiro en local</p>
                  )}
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="font-bold mb-3 border-b pb-1">Productos</h4>
                <div className="space-y-3">
                  {selectedOrder.lines.map((line: any) => (
                    <div key={line.id} className="flex justify-between items-center">
                      <div className="flex gap-3 items-center">
                        <div className="w-10 h-10 bg-slate-100 rounded border flex items-center justify-center overflow-hidden">
                          {line.product.images?.[0] ? <img src={line.product.images[0]} className="object-cover w-full h-full" /> : <span className="text-[8px]">SIN FOTO</span>}
                        </div>
                        <div>
                          <p className="text-sm font-bold">{line.product.name}</p>
                          {line.variantName && <p className="text-[10px] text-slate-500">{line.variantName}</p>}
                          <p className="text-xs text-slate-400">Cant: {line.quantity}</p>
                        </div>
                      </div>
                      <p className="font-bold text-sm">${(line.price * line.quantity).toLocaleString("es-AR")}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totales */}
              <div className="bg-slate-900 text-white p-4 rounded-xl space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Envío</span>
                  <span>${selectedOrder.shippingCost.toLocaleString("es-AR")}</span>
                </div>
                {selectedOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-xs text-green-400">
                    <span>Descuento ({selectedOrder.couponCode})</span>
                    <span>-${selectedOrder.discountAmount.toLocaleString("es-AR")}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg border-t border-slate-700 pt-2 mt-2">
                  <span>Total</span>
                  <span>${selectedOrder.total.toLocaleString("es-AR")}</span>
                </div>
              </div>

              {/* Comprobante */}
              {selectedOrder.paymentProof && (
                <div>
                  <h4 className="font-bold mb-3 border-b pb-1">Comprobante de Pago</h4>
                  <img src={selectedOrder.paymentProof} className="w-full rounded-xl border" alt="Comprobante" />
                </div>
              )}

              {/* Acciones de WhatsApp */}
              <div className="pt-4 border-t flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1 gap-2 border-green-600 text-green-700 hover:bg-green-50"
                  onClick={() => {
                    const statusMsg = selectedOrder.status === 'PAID' ? 'ya hemos registrado tu pago' : 
                                     selectedOrder.status === 'SHIPPED' ? 'tu pedido ya está en camino' :
                                     'estamos procesando tu pedido';
                    const message = encodeURIComponent(
                      `Hola ${selectedOrder.customerName}! 👋 Soy de la tienda.\n` +
                      `Te escribo por tu pedido #${selectedOrder.id.slice(-6)}. Queríamos avisarte que *${statusMsg}*.\n\n` +
                      `¡Gracias por tu compra!`
                    );
                    window.open(`https://wa.me/${selectedOrder.whatsapp?.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
                  }}
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217s.231.006.332.013c.105.007.25.013.391.357.144.354.491 1.191.534 1.278.043.087.072.188.014.303-.058.116-.087.188-.173.289-.087.101-.184.224-.263.303-.09.087-.181.181-.079.354.101.173.451.743.968 1.202.665.592 1.222.777 1.396.864.173.087.275.072.376-.043.101-.116.434-.506.549-.68.116-.173.231-.144.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824z"/></svg>
                  Notificar por WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
