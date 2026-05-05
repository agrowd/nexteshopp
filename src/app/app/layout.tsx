import React from 'react';
import Link from 'next/link';
import { Toaster } from "@/components/ui/sonner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-slate-50">
      <aside className="w-64 border-r bg-white flex flex-col">
        <div className="h-16 flex items-center border-b px-6">
          <span className="font-bold text-lg text-primary">Nexteshop</span>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            <li>
              <Link href="/app" className="block px-3 py-2 rounded-md hover:bg-slate-100 text-sm font-medium">Dashboard</Link>
            </li>
            <li>
              <Link href="/app/products" className="block px-3 py-2 rounded-md hover:bg-slate-100 text-sm font-medium text-slate-600">Productos</Link>
            </li>
            <li>
              <Link href="/app/categories" className="block px-3 py-2 rounded-md hover:bg-slate-100 text-sm font-medium text-slate-600">Categorías</Link>
            </li>
            <li>
              <Link href="/app/orders" className="block px-3 py-2 rounded-md hover:bg-slate-100 text-sm font-medium text-slate-600">Pedidos</Link>
            </li>
            <li>
              <Link href="/app/coupons" className="block px-3 py-2 rounded-md hover:bg-slate-100 text-sm font-medium text-slate-600">Cupones</Link>
            </li>
            <li>
              <Link href="/app/settings/store" className="block px-3 py-2 rounded-md hover:bg-slate-100 text-sm font-medium text-slate-600">Tienda y Diseño</Link>
            </li>
            <li>
              <Link href="/app/settings/payments" className="block px-3 py-2 rounded-md hover:bg-slate-100 text-sm font-medium text-slate-600">Cobros y Pagos</Link>
            </li>
          </ul>
        </nav>
      </aside>
      <main className="flex-1 flex flex-col">
        <header className="h-16 flex items-center justify-between border-b bg-white px-6">
          <h1 className="font-semibold">Mi Tienda</h1>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-slate-200"></div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-6">
          {children}
          <Toaster />
        </div>
      </main>
    </div>
  );
}
