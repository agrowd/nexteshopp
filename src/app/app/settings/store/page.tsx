import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { updateStoreSettings } from "@/app/actions/settings";

export default async function StoreSettingsPage() {
  const session = await auth();
  const tenantId = session?.user?.tenantId;
  
  if (!tenantId) return null;

  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
  if (!tenant) return null;

  const themeConfig = (tenant.theme as any) || { activeTheme: "minimalist" };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-10">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Tienda y Diseño</h2>
        <p className="text-muted-foreground">Configura el nombre, dominio y la apariencia de tu tienda.</p>
      </div>

      <form action={updateStoreSettings} className="space-y-8 bg-white p-6 rounded border shadow-sm" encType="multipart/form-data">
        <div className="space-y-6">
          <h3 className="text-lg font-bold border-b pb-2">Imágenes de la Tienda</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Logo de la Tienda</Label>
              {themeConfig.logoUrl && (
                <div className="mb-2">
                  <img src={themeConfig.logoUrl} alt="Logo" className="h-16 object-contain" />
                </div>
              )}
              <Input type="file" name="logoFile" accept="image/*" />
              <input type="hidden" name="logoUrl" value={themeConfig.logoUrl || ""} />
              <p className="text-xs text-slate-500">Formato JPG o PNG.</p>
            </div>

            <div className="space-y-2">
              <Label>Favicon (Icono de pestaña)</Label>
              {themeConfig.faviconUrl && (
                <div className="mb-2">
                  <img src={themeConfig.faviconUrl} alt="Favicon" className="h-8 object-contain" />
                </div>
              )}
              <Input type="file" name="faviconFile" accept="image/*" />
              <input type="hidden" name="faviconUrl" value={themeConfig.faviconUrl || ""} />
              <p className="text-xs text-slate-500">Opcional. Se mostrará en la pestaña del navegador.</p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Imagen de Portada (Hero Banner)</Label>
              {themeConfig.heroUrl && (
                <div className="mb-2">
                  <img src={themeConfig.heroUrl} alt="Hero" className="h-32 w-full object-cover rounded" />
                </div>
              )}
              <Input type="file" name="heroFile" accept="image/*" />
              <input type="hidden" name="heroUrl" value={themeConfig.heroUrl || ""} />
              <p className="text-xs text-slate-500">Banner principal que aparecerá arriba de todo.</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-bold border-b pb-2">Contacto y Redes Sociales</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>WhatsApp (Botón Flotante)</Label>
              <Input 
                type="text" 
                name="whatsapp" 
                defaultValue={themeConfig.whatsapp || ""} 
                placeholder="Ej: 549112345678" 
              />
              <p className="text-xs text-slate-500">Ingresa el número con código de país para habilitar el botón.</p>
            </div>
            <div className="space-y-2">
              <Label>Instagram (URL)</Label>
              <Input type="url" name="instagram" defaultValue={themeConfig.socialLinks?.instagram || ""} placeholder="https://instagram.com/mitienda" />
            </div>
            <div className="space-y-2">
              <Label>Facebook (URL)</Label>
              <Input type="url" name="facebook" defaultValue={themeConfig.socialLinks?.facebook || ""} placeholder="https://facebook.com/mitienda" />
            </div>
            <div className="space-y-2">
              <Label>TikTok (URL)</Label>
              <Input type="url" name="tiktok" defaultValue={themeConfig.socialLinks?.tiktok || ""} placeholder="https://tiktok.com/@mitienda" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-bold border-b pb-2">Páginas de la Tienda</h3>
          
          <div className="space-y-2">
            <Label>Sobre Nosotros (Nuestra historia)</Label>
            <textarea 
              name="aboutUs" 
              rows={4}
              defaultValue={themeConfig.aboutUs || ""} 
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Cuenta la historia de tu marca..." 
            ></textarea>
          </div>

          <div className="space-y-2">
            <Label>Ubicación de "Sobre Nosotros"</Label>
            <select 
              name="aboutUsPosition" 
              defaultValue={themeConfig.aboutUsPosition || "both"}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
            >
              <option value="both">Mostrar en Menú y en Cuerpo</option>
              <option value="navbar">Solo mostrar enlace en el Menú</option>
              <option value="body">Solo mostrar sección en el Cuerpo de la tienda</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Políticas de la Tienda (Devoluciones, Envíos)</Label>
            <textarea 
              name="policies" 
              rows={4}
              defaultValue={themeConfig.policies || ""} 
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              placeholder="Escribe tus políticas. Si lo dejas vacío se usará un texto estándar de 30 días de cambio." 
            ></textarea>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-bold border-b pb-2">Diseño y Tema</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Plantilla de la Tienda</Label>
              <select 
                name="theme" 
                defaultValue={themeConfig.activeTheme}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="minimalist">Minimalista (Estilo Zara / Apple)</option>
                <option value="vibrant">Vibrante (Estilo MercadoLibre)</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Tipografía (Fuente)</Label>
              <select 
                name="fontFamily" 
                defaultValue={themeConfig.fontFamily || "Inter"}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="Inter">Inter (Moderna / Limpia)</option>
                <option value="Roboto">Roboto (Clásica)</option>
                <option value="Playfair Display">Playfair Display (Elegante / Serif)</option>
                <option value="Montserrat">Montserrat (Geométrica)</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Color Principal (Acentos y Botones)</Label>
              <div className="flex items-center gap-2">
                <input 
                  type="color" 
                  name="primaryColor" 
                  defaultValue={themeConfig.primaryColor || "#000000"} 
                  className="h-10 w-14 rounded cursor-pointer border-0 p-1"
                />
                <span className="text-sm text-slate-500">Selecciona el color de tu marca</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-bold border-b pb-2">Dominios y URLs</h3>
          
          <div className="space-y-2">
            <Label>Subdominio de Nexteshop</Label>
            <div className="flex items-center gap-2">
              <Input 
                type="text" 
                name="subdomain" 
                defaultValue={tenant.subdomain} 
                required
                className="w-48"
              />
              <span className="text-slate-500">.nexteshop.com</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Dominio Personalizado (Opcional)</Label>
            <Input 
              type="text" 
              name="domain" 
              defaultValue={tenant.domain || ""} 
              placeholder="Ej: www.mitienda.com.ar" 
            />
            <p className="text-xs text-slate-500">
              Para usar tu propio dominio, debes configurar un registro CNAME en tu proveedor de dominio apuntando a <code>cname.nexteshop.com</code>.
            </p>
          </div>
        </div>


        <Button type="submit" size="lg" className="w-full">Guardar Configuración</Button>
      </form>
    </div>
  );
}
