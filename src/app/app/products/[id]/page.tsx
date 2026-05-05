import { getProductById, getCategories } from "@/app/actions/product";
import ProductEditForm from "./_components/ProductEditForm";
import { notFound } from "next/navigation";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const product = await getProductById(id);
  const categories = await getCategories();

  if (!product) {
    notFound();
  }

  return <ProductEditForm product={product} categories={categories as any} />;
}
