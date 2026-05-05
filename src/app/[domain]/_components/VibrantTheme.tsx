"use client";

import React from "react";
import { useCartStore } from "@/lib/store/useCartStore";
import { CartDrawer } from "./CartDrawer";

export function VibrantTheme({ tenant, products, categories }: { tenant: any, products: any[], categories: any[] }) {
  const { items, addItem, setIsOpen } = useCartStore();
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [variantSelections, setVariantSelections] = React.useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = React.useState("");

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const themeSettings = tenant.theme || {};
  const primaryColor = themeSettings.primaryColor || "#009EE3";
  const fontFamily = themeSettings.fontFamily || "Roboto";
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
    <div style={{ fontFamily: `"${fontFamily}", sans-serif`, '--color-primary': primaryColor } as React.CSSProperties} className="bg-yellow-50 text-slate-800 min-h-screen relative pb-10">
      <header style={{ backgroundColor: primaryColor }} className="py-4 px-4 md:px-6 text-white flex justify-between items-center shadow-lg sticky top-0 z-50">
        {logoUrl ? (
          <img src={logoUrl} alt={tenant.name} className="h-12 object-contain bg-white/20 p-1 rounded-lg" />
        ) : (
          <h1 className="text-2xl font-black italic">{tenant.name}</h1>
        )}
        <nav className="flex items-center gap-4">
          <button onClick={() => setIsOpen(true)} className="bg-yellow-400 text-slate-900 px-4 py-2 rounded-full font-bold hover:bg-yellow-300 transition-colors text-sm shadow-md">
            🛒 Carrito ({totalItems})
          </button>
        </nav>
      </header>

      {/* Search Bar */}
      <div className="px-4 md:px-6 py-4 bg-yellow-50">
        <input 
          type="text"
          placeholder="🔍 Buscar productos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full max-w-lg mx-auto block px-5 py-3 border-2 border-slate-900 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-yellow-300 transition-shadow bg-white shadow-md"
        />
      </div>

      {/* Hero / Categories Section */}
      {!selectedCategory && !searchQuery && themeSettings.heroUrl && (
        <div className="w-full h-[300px] md:h-[400px]">
          <img src={themeSettings.heroUrl} alt="Hero" className="w-full h-full object-cover" />
        </div>
      )}

      <main className="px-4 md:px-6 py-8 md:py-12 max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-2 mb-10 overflow-x-auto pb-4 scrollbar-hide">
          <button 
            onClick={() => setSelectedCategory(null)}
            className={`px-6 py-2 rounded-full font-black text-sm transition-all shadow-md transform hover:scale-105 ${!selectedCategory ? 'bg-slate-900 text-white' : 'bg-white text-slate-900 border-2 border-slate-900'}`}
          >
            🔥 TODO
          </button>
          {categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-6 py-2 rounded-full font-black text-sm transition-all shadow-md transform hover:scale-105 ${selectedCategory === cat.id ? 'bg-slate-900 text-white' : 'bg-white text-slate-900 border-2 border-slate-900'}`}
            >
              {cat.name.toUpperCase()}
            </button>
          ))}
        </div>

        <h3 className="text-2xl font-black mb-6 flex items-center gap-2 uppercase tracking-tighter">
          {selectedCategory ? `📂 ${categories.find(c => c.id === selectedCategory)?.name}` : "🔥 Ofertas Destacadas"}
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
           {filteredProducts.length === 0 ? (
             <p className="col-span-full font-bold text-center py-20 text-slate-400">Aún no hay productos en esta sección.</p>
           ) : (
             filteredProducts.map(product => (
               <div key={product.id} className="bg-white p-4 rounded-3xl shadow-xl hover:shadow-2xl transition-all border-2 border-transparent hover:border-[var(--color-primary)] flex flex-col h-full group">
                 <div className="aspect-square bg-slate-100 rounded-2xl mb-4 overflow-hidden relative shadow-inner">
                   {product.images && product.images.length > 0 ? (
                     <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                   ) : (
                     <div className="w-full h-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-400">SIN IMAGEN</div>
                   )}
                   {product.category && (
                     <div className="absolute bottom-2 left-2 bg-yellow-400 text-slate-900 font-black px-2 py-1 text-[10px] uppercase rounded-lg shadow-md">
                       {product.category.name}
                     </div>
                   )}
                 </div>
                 
                 <div className="flex-1">
                   <h4 className="font-black text-base md:text-lg leading-tight mb-2 uppercase tracking-tight">{product.name}</h4>
                   <p style={{ color: primaryColor }} className="text-xl md:text-2xl font-black mb-4">${product.price.toLocaleString('es-AR')}</p>
                   
                   {/* Variant Selector */}
                   {product.variants?.length > 0 && (
                     <div className="mb-6 space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Elegir opción:</label>
                       <div className="flex flex-wrap gap-1">
                         {product.variants.map((v: any) => (
                           <button 
                             key={v.id}
                             onClick={() => setVariantSelections(prev => ({ ...prev, [product.id]: v.id }))}
                             className={`px-3 py-1 text-[10px] font-bold border-2 rounded-xl transition-all ${variantSelections[product.id] === v.id ? 'bg-slate-900 text-white border-slate-900 shadow-md' : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-slate-300'}`}
                           >
                             {v.value}
                           </button>
                         ))}
                       </div>
                     </div>
                   )}
                 </div>

                 <button 
                   onClick={() => handleAddToCart(product)}
                   style={{ backgroundColor: primaryColor }}
                   className="w-full text-white font-black py-3 rounded-2xl hover:opacity-90 transition-all mt-auto shadow-[0_5px_0_rgba(0,0,0,0.2)] active:translate-y-[2px] active:shadow-none"
                 >
                   AGREGAR
                 </button>
               </div>
             ))
           )}
        </div>

        {(themeSettings.aboutUsPosition === "both" || themeSettings.aboutUsPosition === "body") && themeSettings.aboutUs && (
          <div id="nosotros" className="mt-16 bg-white p-8 md:p-12 rounded-[40px] shadow-2xl text-center border-4 border-yellow-400 scroll-mt-24 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-4 bg-yellow-400 opacity-20"></div>
            <h3 className="text-3xl md:text-4xl font-black mb-6 uppercase tracking-tighter text-slate-800">
              ⚡ ¿Quiénes somos?
            </h3>
            <p className="text-slate-600 font-bold text-lg md:text-xl leading-relaxed whitespace-pre-wrap max-w-3xl mx-auto">{themeSettings.aboutUs}</p>
          </div>
        )}
      </main>

      <footer className="bg-slate-900 text-slate-300 py-16 px-6 mt-20 rounded-t-[50px] max-w-7xl mx-auto md:px-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <h4 className="text-2xl font-black text-white mb-6 uppercase italic tracking-tighter">{tenant.name}</h4>
          <div className="flex gap-4">
            {themeSettings.socialLinks?.instagram && <a href={themeSettings.socialLinks.instagram} target="_blank" rel="noreferrer" className="bg-slate-800 w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-700 transition-colors">IG</a>}
            {themeSettings.socialLinks?.facebook && <a href={themeSettings.socialLinks.facebook} target="_blank" rel="noreferrer" className="bg-slate-800 w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-700 transition-colors">FB</a>}
            {themeSettings.socialLinks?.tiktok && <a href={themeSettings.socialLinks.tiktok} target="_blank" rel="noreferrer" className="bg-slate-800 w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-700 transition-colors">TK</a>}
          </div>
        </div>
        <div>
          <h4 className="font-black text-white mb-6 uppercase tracking-widest text-sm">Información Legal</h4>
          <details className="cursor-pointer group">
            <summary className="text-slate-400 hover:text-white outline-none font-bold transition-colors">Políticas de la tienda</summary>
            <div className="mt-4 p-6 bg-slate-800 rounded-3xl text-sm whitespace-pre-wrap leading-relaxed shadow-inner border border-slate-700 text-slate-400 font-medium">
              {themeSettings.policies || "Consulte nuestras políticas de cambio y devolución."}
            </div>
          </details>
        </div>
        <div className="md:text-right text-slate-500 font-black flex flex-col justify-end">
          <p className="uppercase text-xs tracking-widest">&copy; {new Date().getFullYear()} {tenant.name}</p>
          <p className="text-[10px] mt-1 text-slate-700">POWERED BY NEXTESHOP</p>
        </div>
      </footer>

      {themeSettings.whatsapp && (
        <a 
          href={`https://wa.me/${themeSettings.whatsapp.replace(/[^0-9]/g, '')}`} 
          target="_blank" 
          rel="noreferrer"
          className="fixed bottom-6 right-6 bg-green-500 text-white w-16 h-16 rounded-[20px] flex items-center justify-center shadow-[0_8px_0_rgba(0,100,0,0.2)] hover:scale-110 active:translate-y-[4px] active:shadow-none transition-all z-50 text-4xl pb-1 border-4 border-white"
          title="Contactar por WhatsApp"
        >
          ☻
        </a>
      )}

      <CartDrawer />
    </div>
  );
}
