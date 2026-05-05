"use client";

import React from "react";
import { useCartStore } from "@/lib/store/useCartStore";
import { CartDrawer } from "./CartDrawer";

export function MinimalistTheme({ tenant, products, categories }: { tenant: any, products: any[], categories: any[] }) {
  const { items, addItem, setIsOpen } = useCartStore();
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [variantSelections, setVariantSelections] = React.useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = React.useState("");

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const themeSettings = tenant.theme || {};
  const primaryColor = themeSettings.primaryColor || "#0f172a";
  const fontFamily = themeSettings.fontFamily || "Inter";
  const logoUrl = themeSettings.logoUrl;

  const filteredProducts = products
    .filter(p => selectedCategory ? p.categoryId === selectedCategory : true)
    .filter(p => searchQuery ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) : true);

  const handleAddToCart = (product: any) => {
    const selectedVariantId = variantSelections[product.id];
    const variant = product.variants?.find((v: any) => v.id === selectedVariantId);
    
    if (product.variants?.length > 0 && !selectedVariantId) {
       const firstVariant = product.variants[0];
       addItem({ 
         id: product.id, 
         name: `${product.name} (${firstVariant.name}: ${firstVariant.value})`, 
         price: firstVariant.price || product.price, 
         imageUrl: product.images?.[0],
         variantName: `${firstVariant.name}: ${firstVariant.value}`
       });
    } else {
       addItem({ 
         id: product.id, 
         name: variant ? `${product.name} (${variant.name}: ${variant.value})` : product.name, 
         price: variant?.price || product.price, 
         imageUrl: product.images?.[0],
         variantName: variant ? `${variant.name}: ${variant.value}` : null
       });
    }
    setIsOpen(true);
  };

  return (
    <div style={{ fontFamily: `"${fontFamily}", sans-serif`, '--color-primary': primaryColor } as React.CSSProperties} className="bg-white text-slate-900 min-h-screen relative">
      <header className="py-6 px-4 md:px-10 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-sm z-40">
        {logoUrl ? (
          <img src={logoUrl} alt={tenant.name} className="h-10 object-contain" />
        ) : (
          <h1 className="text-xl font-light tracking-widest uppercase">{tenant.name}</h1>
        )}
        <nav className="space-x-4 md:space-x-8 text-sm tracking-wide hidden md:block">
          <button onClick={() => setSelectedCategory(null)} className={`hover:opacity-70 transition-opacity ${!selectedCategory ? 'font-bold underline' : ''}`}>Todos</button>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`hover:opacity-70 transition-opacity ${selectedCategory === cat.id ? 'font-bold underline' : ''}`}>{cat.name}</button>
          ))}
          {(themeSettings.aboutUsPosition === "both" || themeSettings.aboutUsPosition === "navbar") && themeSettings.aboutUs && (
            <a href="#nosotros" className="hover:opacity-70 transition-opacity">Nosotros</a>
          )}
          <button onClick={() => setIsOpen(true)} className="font-medium hover:opacity-70 transition-opacity">Carrito ({totalItems})</button>
        </nav>
        <button onClick={() => setIsOpen(true)} className="md:hidden text-sm font-medium">Carrito ({totalItems})</button>
      </header>

      {/* Search Bar */}
      <div className="px-4 md:px-10 py-4 border-b border-slate-50 bg-white">
        <input 
          type="text"
          placeholder="Buscar productos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-md mx-auto block px-4 py-2 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-slate-200 transition-shadow"
        />
      </div>

      {/* Hero Section */}
      {!selectedCategory && !searchQuery && themeSettings.heroUrl && (
        <div className="w-full h-[400px] md:h-[500px]">
          <img src={themeSettings.heroUrl} alt="Hero" className="w-full h-full object-cover" />
        </div>
      )}
      
      <main className="px-4 md:px-10 py-12 md:py-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
           {filteredProducts.length === 0 ? (
             <p className="col-span-full text-center text-slate-400 py-20">No hay productos en esta categoría.</p>
           ) : (
             filteredProducts.map(product => (
               <div key={product.id} className="group flex flex-col">
                 <div className="aspect-[3/4] bg-slate-50 mb-4 transition-transform duration-500 group-hover:scale-[1.01] overflow-hidden relative">
                   {product.images && product.images.length > 0 ? (
                     <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">Sin foto</div>
                   )}
                   {product.category && (
                     <span className="absolute top-4 left-4 bg-white/80 backdrop-blur-md px-2 py-1 text-[10px] uppercase tracking-widest text-slate-500 rounded">
                       {product.category.name}
                     </span>
                   )}
                 </div>
                 
                 <div className="flex-1">
                   <h3 className="text-sm font-medium">{product.name}</h3>
                   <p className="text-sm text-slate-500 mt-1">${product.price.toLocaleString('es-AR')}</p>
                   
                   {/* Variant Selector */}
                   {product.variants?.length > 0 && (
                     <div className="mt-4 space-y-2">
                       <label className="text-[10px] uppercase text-slate-400 block tracking-widest">Opciones disponibles:</label>
                       <div className="flex flex-wrap gap-2">
                         {product.variants.map((v: any) => (
                           <button 
                             key={v.id}
                             onClick={() => setVariantSelections(prev => ({ ...prev, [product.id]: v.id }))}
                             className={`px-3 py-1 text-xs border rounded-full transition-colors ${variantSelections[product.id] === v.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}
                           >
                             {v.value} {v.price ? `(+$${(v.price - product.price).toLocaleString()})` : ""}
                           </button>
                         ))}
                       </div>
                     </div>
                   )}
                 </div>

                 <button 
                   onClick={() => handleAddToCart(product)}
                   style={{ backgroundColor: primaryColor }}
                   className="mt-6 text-xs font-bold uppercase tracking-wider text-white px-4 py-3 hover:opacity-90 transition-opacity w-full shadow-sm"
                 >
                   Añadir al Carrito
                 </button>
               </div>
             ))
           )}
        </div>

        {(themeSettings.aboutUsPosition === "both" || themeSettings.aboutUsPosition === "body") && themeSettings.aboutUs && (
          <div id="nosotros" className="mt-24 pt-16 border-t border-slate-100 max-w-3xl mx-auto text-center scroll-mt-20">
            <h3 className="text-2xl font-light mb-6 tracking-widest uppercase">Sobre Nosotros</h3>
            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{themeSettings.aboutUs}</p>
          </div>
        )}
      </main>

      <footer className="bg-slate-50 py-16 px-4 md:px-10 mt-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-sm">
          <div>
            <h4 className="font-bold tracking-widest uppercase mb-4">{tenant.name}</h4>
            <div className="flex gap-4 mt-4 text-xs">
              {themeSettings.socialLinks?.instagram && <a href={themeSettings.socialLinks.instagram} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900">Instagram</a>}
              {themeSettings.socialLinks?.facebook && <a href={themeSettings.socialLinks.facebook} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900">Facebook</a>}
              {themeSettings.socialLinks?.tiktok && <a href={themeSettings.socialLinks.tiktok} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-slate-900">TikTok</a>}
            </div>
          </div>
          <div>
            <h4 className="font-bold tracking-widest uppercase mb-4">Información</h4>
            <details className="cursor-pointer group">
              <summary className="text-slate-500 hover:text-slate-900 outline-none">Políticas de la tienda</summary>
              <div className="mt-4 p-4 bg-white border border-slate-100 text-slate-600 rounded text-xs whitespace-pre-wrap leading-relaxed shadow-sm">
                {themeSettings.policies || "Consulte nuestras políticas de cambio y devolución."}
              </div>
            </details>
          </div>
          <div className="text-slate-400 md:text-right">
            <p>&copy; {new Date().getFullYear()} {tenant.name}.</p>
            <p className="mt-1 text-[10px] uppercase tracking-widest">Powered by Nexteshop</p>
          </div>
        </div>
      </footer>

      {themeSettings.whatsapp && (
        <a 
          href={`https://wa.me/${themeSettings.whatsapp.replace(/[^0-9]/g, '')}`} 
          target="_blank" 
          rel="noreferrer"
          className="fixed bottom-6 right-6 bg-green-500 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50 text-3xl pb-1"
          title="Contactar por WhatsApp"
        >
          ☻
        </a>
      )}

      <CartDrawer />
    </div>
  );
}
