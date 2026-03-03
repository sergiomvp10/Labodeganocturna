import { products } from "@/data/products";
import ProductPageClient from "./ProductPageClient";
import type { Metadata } from "next";

const API = "https://app-xeknkpjv.fly.dev";

interface APIProduct {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  volume: string;
  brand: string;
  description: string;
  in_stock: boolean;
  rating: number;
  reviews: number;
}

async function fetchAllProductIds(): Promise<number[]> {
  try {
    const res = await fetch(`${API}/api/products/lite`);
    const data: { id: number }[] = await res.json();
    return data.map((p) => p.id);
  } catch {
    return products.map((p) => p.id);
  }
}

async function fetchProduct(id: number): Promise<APIProduct | null> {
  try {
    const res = await fetch(`${API}/api/products/${id}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  const ids = await fetchAllProductIds();
  return ids.map((id) => ({ id: String(id) }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const numId = parseInt(id);
  const staticProduct = products.find((p) => p.id === numId);
  const apiProduct = !staticProduct ? await fetchProduct(numId) : null;
  const name = staticProduct?.name ?? apiProduct?.name;
  const brand = staticProduct?.brand ?? apiProduct?.brand;
  const category = staticProduct?.category ?? apiProduct?.category;
  const volume = staticProduct?.volume ?? apiProduct?.volume;
  const price = staticProduct?.price ?? apiProduct?.price;
  if (!name) return {};
  const allCities = ["Duitama", "Tunja", "Sogamoso"];
  const cityList = allCities.join(", ");
  const productKeywords = [
    name, brand,
    ...allCities.map((c) => `${name} ${c}`),
    ...allCities.map((c) => `${category} a domicilio ${c}`),
    `comprar ${name} online`,
    `${brand} precio Colombia`,
    `${category} a domicilio Boyacá`,
    "La Bodega Nocturna 23",
  ].join(", ");
  return {
    title: `${name} ${volume} | Domicilio en ${cityList} - La Bodega Nocturna 23`,
    description: `Compra ${name} de ${brand} a domicilio en ${cityList}. ${volume}. Precio: $${price?.toLocaleString()} COP. Entrega rápida 23 horas. Productos 100% originales. Pide por WhatsApp.`,
    keywords: productKeywords,
    alternates: {
      canonical: `https://www.labodega23.co/producto/${id}/`,
    },
    openGraph: {
      title: `${name} - $${price?.toLocaleString()} | La Bodega Nocturna 23`,
      description: `${name} de ${brand}. ${volume}. Domicilio 23 horas en ${cityList}. Productos originales.`,
      url: `https://www.labodega23.co/producto/${id}/`,
      images: [`${API}/api/img/${id}`],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numId = parseInt(id);
  const staticProduct = products.find((p) => p.id === numId);
  const apiProduct = !staticProduct ? await fetchProduct(numId) : null;
  const name = staticProduct?.name ?? apiProduct?.name;
  const brand = staticProduct?.brand ?? apiProduct?.brand;
  const description = staticProduct?.description ?? apiProduct?.description;
  const price = staticProduct?.price ?? apiProduct?.price;
  const rating = staticProduct?.rating ?? apiProduct?.rating;
  const reviews = staticProduct?.reviews ?? apiProduct?.reviews;
  const inStock = staticProduct?.inStock ?? apiProduct?.in_stock;
  const jsonLd = name ? {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: `${API}/api/img/${id}`,
    brand: { "@type": "Brand", name: brand },
    sku: id,
    offers: {
      "@type": "Offer",
      url: `https://www.labodega23.co/producto/${id}`,
      priceCurrency: "COP",
      price,
      availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "La Bodega Nocturna 23" },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: rating,
      reviewCount: reviews,
      bestRating: 5,
      worstRating: 1,
    },
  } : null;
  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <ProductPageClient id={id} />
    </>
  );
}
