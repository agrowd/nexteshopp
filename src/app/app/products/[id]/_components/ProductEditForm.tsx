"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateProduct } from "@/app/actions/product";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export default function ProductEditForm({ product, categories }: { product: any, categories: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [variants, setVariants] = useState<{ name: string, value: string, price?: string, stock: string }[]>(
    product.variants.map((v: any) => ({
      name: v.name,
      value: v.value,
      price: v.price?.toString() || "",
      stock: v.stock.toString()
    }))
  );

  const addVariant = () => {
    setVariants([...variants, { name: "Talle", value: "", stock: "0" }]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: string, val: string) => {
    const newVariants = [...variants];
    (newVariants[index] as any)[field] = val;
    setVariants(newVariants);
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const formElement = e.currentTarget;
      const formData = new FormData(formElement);

      let imageUrl = "";
      if (file) {
        const fileData = new FormData();
        fileData.append("file", file);
        
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: fileData
        });
        
        const uploadJson = await uploadRes.json();
        if (uploadJson.url) {
          imageUrl = uploadJson.url;
        } else {
          toast.error("Error al subir la imagen");
          setLoading(false);
          return;
        }
      }

      formData.append("imageUrl", imageUrl);
      formData.append("variants", JSON.stringify(variants));

      await updateProduct(product.id, formData);
      toast.success("Producto actualizado exitosamente");
      router.push("/app/products");
    } catch (error: any) {
      toast.error(error.message || "Error al actualizar producto");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/app/products">
          <Button variant="outline" size="sm">Volver</Button>
        </Link>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Editar Producto</h2>
        </div>
      </div>

      <div className="bg-white p-8 rounded-xl border border-slate-100 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h3 className="font-bold border-b pb-2 text-slate-800">Información Básica</h3>
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Producto *</Label>
                <Input id="name" name="name" required defaultValue={product.name} />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="categoryId">Categoría</Label>
                <select 
                  name="categoryId" 
                  id="categoryId"
                  defaultValue={product.categoryId || "none"}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="none">Sin categoría</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea id="description" name="description" rows={4} defaultValue={product.description || ""} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Precio Base *</Label>
                  <Input id="price" name="price" type="number" step="0.01" required defaultValue={product.price} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Total</Label>
                  <Input id="stock" name="stock" type="number" required defaultValue={product.stock} />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="font-bold border-b pb-2 text-slate-800">Multimedia</h3>
              <div className="space-y-4">
                {product.images?.[0] && (
                  <div>
                    <Label>Imagen Actual</Label>
                    <img src={product.images[0]} alt="Actual" className="w-full h-40 object-cover rounded-lg border" />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="image">Cambiar Imagen</Label>
                  <div className="border-2 border-dashed border-slate-100 rounded-xl p-4 text-center">
                    <Input 
                      id="image" 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="cursor-pointer"
                    />
                    {file && <p className="text-xs text-green-600 mt-2">Archivo seleccionado: {file.name}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-50">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Variantes</h3>
              <Button type="button" variant="outline" size="sm" onClick={addVariant}>+ Agregar Variante</Button>
            </div>
            
            {variants.length > 0 ? (
              <div className="space-y-3">
                {variants.map((v, i) => (
                  <div key={i} className="flex gap-2 items-end bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="flex-1 space-y-1">
                      <Label className="text-[10px] uppercase">Propiedad</Label>
                      <Input value={v.name} onChange={(e) => updateVariant(i, "name", e.target.value)} className="h-8 text-xs" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <Label className="text-[10px] uppercase">Valor</Label>
                      <Input value={v.value} onChange={(e) => updateVariant(i, "value", e.target.value)} className="h-8 text-xs" />
                    </div>
                    <div className="w-20 space-y-1">
                      <Label className="text-[10px] uppercase">Stock</Label>
                      <Input type="number" value={v.stock} onChange={(e) => updateVariant(i, "stock", e.target.value)} className="h-8 text-xs" />
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeVariant(i)} className="text-red-500 hover:text-red-700 h-8">✕</Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic">No hay variantes definidas.</p>
            )}
          </div>

          <Button type="submit" disabled={loading} className="w-full h-12 bg-slate-900 text-white font-bold text-lg rounded-xl shadow-lg hover:bg-slate-800 transition-all">
            {loading ? "Guardando..." : "Actualizar Producto"}
          </Button>
        </form>
      </div>
    </div>
  );
}
