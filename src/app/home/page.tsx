import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 md:px-12 border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">N</div>
          <span className="text-xl font-bold tracking-tight text-slate-900">Nexteshop</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <a href="#features" className="hover:text-blue-600 transition-colors">Características</a>
          <a href="#pricing" className="hover:text-blue-600 transition-colors">Precios</a>
          <a href="#about" className="hover:text-blue-600 transition-colors">Nosotros</a>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-slate-600">Iniciar Sesión</Button>
          </Link>
          <Link href="/login">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">Empezar ahora</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 px-6 md:px-12 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-50/50 rounded-full blur-3xl -z-10"></div>
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 mb-6 leading-tight">
            La plataforma de <span className="text-blue-600">E-commerce</span> para la nueva era.
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Crea tu tienda profesional con dominio propio, pagos automáticos y diseño premium en menos de un minuto. Sin complicaciones técnicas.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button className="h-14 px-10 text-lg bg-slate-900 hover:bg-slate-800 text-white rounded-full">Crear mi tienda</Button>
            <Button variant="outline" className="h-14 px-10 text-lg rounded-full border-slate-200">Ver demostración</Button>
          </div>
          <div className="mt-16 relative">
             <div className="bg-slate-900 rounded-2xl p-2 shadow-2xl shadow-blue-200/50 transform -rotate-1 border border-slate-800">
                <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop" alt="Dashboard" className="rounded-xl w-full" />
             </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Todo lo que necesitas para vender</h2>
            <p className="text-slate-500">Diseñado para que te enfoques en tu negocio, no en el código.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Multi-Tenant", desc: "Cada tienda es única con su propio subdominio o dominio personalizado (.com).", icon: "🌐" },
              { title: "Pagos con MercadoPago", desc: "Integración nativa para cobrar con tarjeta, efectivo o transferencia.", icon: "💳" },
              { title: "Diseño Dinámico", desc: "Personaliza colores, fuentes y logos para que tu tienda refleje tu marca.", icon: "🎨" },
              { title: "Gestión de Pedidos", desc: "Un panel intuitivo para seguir tus ventas y estados de envío.", icon: "📦" },
              { title: "Carga de Productos", desc: "Sube fotos y gestiona stock de forma masiva y sencilla.", icon: "🚀" },
              { title: "SEO Optimizado", desc: "Tu tienda lista para aparecer en los buscadores desde el primer día.", icon: "📈" }
            ].map((f, i) => (
              <div key={i} className="p-8 bg-white rounded-2xl border border-slate-100 hover:shadow-xl transition-shadow group">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform inline-block">{f.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Un solo plan. Todo incluido.</h2>
          <p className="text-slate-500 mb-12">Sin comisiones ocultas, sin sorpresas. Escala tu negocio con tranquilidad.</p>
          
          <div className="bg-blue-600 rounded-3xl p-10 text-white shadow-2xl shadow-blue-500/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
               <span className="bg-white/20 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Suscripción Mensual</span>
            </div>
            <div className="text-sm font-medium opacity-80 uppercase tracking-widest mb-2">Plan Pro</div>
            <div className="text-6xl font-black mb-4">$10.000<span className="text-xl font-normal opacity-70">/mes</span></div>
            <p className="mb-8 opacity-90">Acceso a todas las funciones actuales y futuras sin límites.</p>
            <ul className="text-left space-y-4 mb-10 max-w-xs mx-auto">
              <li className="flex items-center gap-2">✓ Productos ilimitados</li>
              <li className="flex items-center gap-2">✓ Dominio personalizado</li>
              <li className="flex items-center gap-2">✓ Soporte prioritario</li>
              <li className="flex items-center gap-2">✓ Sin comisión por venta</li>
            </ul>
            <Button className="w-full h-14 bg-white text-blue-600 hover:bg-slate-100 font-bold text-lg rounded-2xl">Empezar prueba gratuita</Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">N</div>
            <span className="font-bold tracking-tight">Nexteshop</span>
          </div>
          <div className="flex gap-8 text-slate-400 text-sm">
            <a href="#" className="hover:text-white transition-colors">Términos</a>
            <a href="#" className="hover:text-white transition-colors">Privacidad</a>
            <a href="#" className="hover:text-white transition-colors">Contacto</a>
          </div>
          <div className="text-slate-500 text-xs text-center md:text-right">
            &copy; {new Date().getFullYear()} Nexteshop. Todos los derechos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
