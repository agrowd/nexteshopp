"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/lib/store/useCartStore";
import Link from "next/link";

export function CartDrawer() {
  const { items, removeItem, updateQuantity, isOpen, setIsOpen } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
      <div className="w-full max-w-md bg-white h-full shadow-xl relative flex flex-col animate-in slide-in-from-right duration-300">
        <div className="p-6 border-b flex justify-between items-center text-black">
          <h2 className="text-xl font-bold">Tu Carrito</h2>
          <button onClick={() => setIsOpen(false)} className="text-2xl">&times;</button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-black">
          {items.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">Tu carrito está vacío.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 border-b pb-4">
                <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-200" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">{item.name}</h3>
                  <p className="text-blue-600 font-medium">${item.price.toFixed(2)}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 rounded-full border flex items-center justify-center">-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 rounded-full border flex items-center justify-center">+</button>
                    <button onClick={() => removeItem(item.id)} className="ml-auto text-red-500 text-sm hover:underline">Quitar</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t bg-gray-50 text-black space-y-3">
            <div className="flex justify-between font-bold text-lg mb-2">
              <span>Total:</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            
            <Link href="/checkout" onClick={() => setIsOpen(false)} className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition block text-center shadow-lg">
              Pago Online / Web
            </Link>

            {tenant.theme?.whatsapp && (
              <button 
                onClick={() => {
                  const message = encodeURIComponent(
                    `¡Hola! 👋 Vengo de tu tienda *${tenant.name}*.\n\n` +
                    `Quiero realizar el siguiente pedido:\n` +
                    items.map(i => `• ${i.name} x${i.quantity} ($${(i.price * i.quantity).toFixed(2)})`).join('\n') +
                    `\n\n*Total: $${totalPrice.toFixed(2)}*\n\n` +
                    `¿Cómo coordinamos el pago y el envío?`
                  );
                  window.open(`https://wa.me/${tenant.theme.whatsapp.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
                  setIsOpen(false);
                }}
                className="w-full bg-green-500 text-white font-bold py-4 rounded-xl hover:bg-green-600 transition flex items-center justify-center gap-2 shadow-lg"
              >
                <span>Finalizar por WhatsApp</span>
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217s.231.006.332.013c.105.007.25.013.391.357.144.354.491 1.191.534 1.278.043.087.072.188.014.303-.058.116-.087.188-.173.289-.087.101-.184.224-.263.303-.09.087-.181.181-.079.354.101.173.451.743.968 1.202.665.592 1.222.777 1.396.864.173.087.275.072.376-.043.101-.116.434-.506.549-.68.116-.173.231-.144.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824z"/></svg>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
