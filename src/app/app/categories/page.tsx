import { getCategories } from "@/app/actions/product";
import { createCategory, deleteCategory } from "@/app/actions/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Categorías</h2>
        <p className="text-muted-foreground">Organiza tu catálogo para que tus clientes encuentren todo fácil.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <h3 className="font-bold mb-4">Nueva Categoría</h3>
        <form action={async (formData: FormData) => { "use server"; const name = formData.get("name") as string; await createCategory(name); }} className="flex gap-4">
          <Input name="name" placeholder="Ej: Calzado, Accesorios, Invierno..." required className="max-w-sm" />
          <Button type="submit">Agregar</Button>
        </form>
      </div>

      <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Productos</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-10 text-muted-foreground">
                  No tienes categorías todavía.
                </TableCell>
              </TableRow>
            ) : (
              categories.map((cat: any) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-bold">{cat.name}</TableCell>
                  <TableCell>{cat._count?.products ?? 0}</TableCell>
                  <TableCell className="text-right">
                    <form action={async () => { "use server"; await deleteCategory(cat.id); }} className="inline-block">
                      <Button variant="destructive" size="sm" type="submit">Eliminar</Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
