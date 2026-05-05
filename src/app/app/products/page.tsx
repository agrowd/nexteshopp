import { getProducts, deleteProduct } from "@/app/actions/product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Link from "next/link";

export default async function ProductsPage() {
  const products = await getProducts();

  async function handleDelete(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await deleteProduct(id);
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Productos</h2>
          <p className="text-muted-foreground">Gestiona el catálogo de tu tienda.</p>
        </div>
        <Link href="/app/products/new">
          <Button>Agregar Producto</Button>
        </Link>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Variantes</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                  No tienes productos todavía.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product: any) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {product.images?.[0] && (
                        <img src={product.images[0]} alt="" className="w-10 h-10 rounded-md object-cover" />
                      )}
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {product.category ? (
                      <Badge variant="outline" className="text-xs">{product.category.name}</Badge>
                    ) : (
                      <span className="text-slate-400 text-xs">Sin categoría</span>
                    )}
                  </TableCell>
                  <TableCell className="font-bold">${product.price.toLocaleString("es-AR")}</TableCell>
                  <TableCell>
                    <Badge className={`${product.stock > 5 ? 'bg-green-100 text-green-700' : product.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'} hover:bg-inherit`}>
                      {product.stock} uds
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {product.variants?.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {product.variants.map((v: any) => (
                          <span key={v.id} className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-600">
                            {v.value} ({v.stock})
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link href={`/app/products/${product.id}`}>
                      <Button variant="outline" size="sm">Editar</Button>
                    </Link>
                    <form action={handleDelete} className="inline-block">
                      <input type="hidden" name="id" value={product.id} />
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

