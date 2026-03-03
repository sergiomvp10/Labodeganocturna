import { categories, products } from "@/data/products";
import CategoryPage from "@/components/CategoryPage";
import type { Metadata } from "next";

export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = categories.find((c) => c.slug === slug);
  if (!category) return {};
  const allCities = ["Duitama", "Tunja", "Sogamoso"];
  const cityList = allCities.join(", ");
  const count = products.filter((p) => p.category.toLowerCase() === category.name.toLowerCase()).length;
  return {
    title: `${category.name} a Domicilio en ${cityList} | La Bodega Nocturna 23`,
    description: `Compra ${category.name} a domicilio en ${cityList}. ${count} productos disponibles. Entrega rápida 23 horas. Productos 100% originales. La Bodega Nocturna 23.`,
    keywords: [
      category.name,
      ...allCities.map((c) => `${category.name} a domicilio ${c}`),
      ...allCities.map((c) => `licorería ${c}`),
      `comprar ${category.name} online Colombia`,
      "La Bodega Nocturna 23",
    ].join(", "),
    alternates: {
      canonical: `https://www.labodega23.co/categoria/${slug}/`,
    },
    openGraph: {
      title: `${category.name} | La Bodega Nocturna 23`,
      description: `${count} productos de ${category.name} con domicilio en ${cityList}. Entrega rápida 23 horas.`,
      url: `https://www.labodega23.co/categoria/${slug}/`,
    },
  };
}

export default async function CategoriaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CategoryPage slug={slug} />;
}
