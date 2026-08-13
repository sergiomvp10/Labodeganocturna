import { fetchSeoProducts } from "@/lib/seo";
import ProductPageClient from "./ProductPageClient";
import type { Metadata } from "next";

const API = process.env.NEXT_PUBLIC_API_URL || "https://labodega-nocturna-backend.fly.dev";
const SITE = "https://www.labodega23.co";

interface APIProduct {
  id: number;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  volume: string;
  brand: string;
  description: string;
  image: string;
  inStock: boolean;
  rating: number;
  reviews: number;
}

async function fetchProduct(id: number): Promise<APIProduct | null> {
  let lastError = "";
  for (let attempt = 0; attempt < 5; attempt++) {
    if (attempt > 0) await new Promise((r) => setTimeout(r, 3000 * attempt));
    try {
      const res = await fetch(`${API}/api/products/${id}`);
      if (res.status === 404) return null;
      if (!res.ok) {
        lastError = `HTTP ${res.status}`;
        continue;
      }
      return await res.json();
    } catch (e) {
      lastError = String(e);
    }
  }
  throw new Error(`No se pudo leer el producto ${id} de ${API} (${lastError}); se aborta el build`);
}

function imageUrl(image: string | undefined): string | undefined {
  if (!image || image.startsWith("data:")) return undefined;
  return image.startsWith("http") ? image : `${SITE}${image}`;
}

export async function generateStaticParams() {
  const catalog = await fetchSeoProducts();
  return catalog.map((p) => ({ id: String(p.id) }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const numId = parseInt(id);
  const apiProduct = await fetchProduct(numId);
  const name = apiProduct?.name;
  const brand = apiProduct?.brand;
  const category = apiProduct?.category;
  const volume = apiProduct?.volume;
  const price = apiProduct?.price;
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
      images: [imageUrl(apiProduct?.image)].filter(Boolean) as string[],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numId = parseInt(id);
  const apiProduct = await fetchProduct(numId);
  const name = apiProduct?.name;
  const brand = apiProduct?.brand;
  const description = apiProduct?.description;
  const price = apiProduct?.price;
  const rating = apiProduct?.rating;
  const reviews = apiProduct?.reviews;
  const inStock = apiProduct?.inStock;
  const jsonLd = name ? {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    image: imageUrl(apiProduct?.image),
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
  const volume = apiProduct?.volume;
  const category = apiProduct?.category;
  const allCities = ["Duitama", "Tunja", "Sogamoso"];
  const cityList = allCities.join(", ");
  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {name && (
        <div data-nosnippet="" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>
          <h1>{name} {volume} - La Bodega Nocturna 23</h1>
          <p>Marca: {brand}</p>
          <p>Categoría: {category}</p>
          <p>Volumen: {volume}</p>
          <p>Precio: ${price?.toLocaleString()} COP</p>
          <p>{description}</p>
          <p>{inStock ? "Disponible para entrega inmediata" : "Agotado"}</p>
          <p>Domicilio a {cityList}. Entrega rápida 23 horas. Productos 100% originales.</p>
          <p>Compra {name} de {brand} a domicilio en {cityList}. Pide por WhatsApp al +57 311 226 0769.</p>
        </div>
      )}
      <ProductPageClient id={id} />
    </>
  );
}
