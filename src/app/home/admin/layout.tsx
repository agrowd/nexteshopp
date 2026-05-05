import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Protección de Ruta: Solo SUPERADMIN
  if (!session || session.user?.role !== "SUPERADMIN") {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar Admin */}
      <aside className="w-64 bg-slate-900 text-white p-6 hidden md:block shrink-0">
        <h1 className="text-xl font-bold mb-8 text-blue-400">Nexteshop Admin</h1>
        <nav className="space-y-4">
          <Link href="/admin" className="block text-sm font-medium hover:text-blue-400 transition-colors">Dashboard Global</Link>
          <Link href="/admin/tenants" className="block text-sm font-medium hover:text-blue-400 transition-colors">Gestionar Tiendas</Link>
          <Link href="/admin/users" className="block text-sm font-medium hover:text-blue-400 transition-colors">Usuarios Globales</Link>
        </nav>
        <div className="mt-auto pt-8">
           <form action={async () => {
             "use server";
             // Aquí iría el logout
           }}>
             <Button variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800">Cerrar Sesión</Button>
           </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <header className="flex justify-between items-center mb-10">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Panel de Control General</h2>
          <div className="flex items-center gap-3">
             <span className="text-sm font-medium text-slate-600">{session.user?.email}</span>
             <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs">A</div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
