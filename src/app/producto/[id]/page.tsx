import { products } from "@/data/products";
import ProductPageClient from "./ProductPageClient";

export function generateStaticParams() {
  return products.map((p) => ({ id: String(p.id) }));
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProductPageClient id={id} />;
}
