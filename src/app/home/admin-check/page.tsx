import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminCheckPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  // Si es Super Admin, se queda en este dominio en la ruta /admin
  if (session.user?.role === "SUPERADMIN") {
    redirect("/admin");
  }

  // Si es un vendedor (SELLER), lo mandamos a su subdominio de dashboard
  // Importante: NEXT_PUBLIC_APP_URL debe ser algo como "http://app.nexteshop.com:3000" o "https://app.nexteshop.com"
  const dashboardUrl = process.env.NEXT_PUBLIC_APP_URL || "http://app.localhost:3000";
  
  redirect(dashboardUrl);
}
