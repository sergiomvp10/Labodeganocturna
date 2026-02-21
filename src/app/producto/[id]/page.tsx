import { products } from "@/data/products";
import ProductPageClient from "./ProductPageClient";
import type { Metadata } from "next";

export function generateStaticParams() {
  return products.map((p) => ({ id: String(p.id) }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((p) => p.id === parseInt(id));
  if (!product) return {};
  const allCities = ["Duitama", "Tunja", "Sogamoso"];
  const cityList = allCities.join(", ");
  const productKeywords = [
    product.name, product.brand,
    ...allCities.map((c) => `${product.name} ${c}`),
    ...allCities.map((c) => `${product.category} a domicilio ${c}`),
    `comprar ${product.name} online`,
    `${product.brand} precio Colombia`,
    `${product.category} a domicilio Boyacá`,
    "La Bodega Nocturna 23",
  ].join(", ");
  return {
    title: `${product.name} ${product.volume} | Domicilio en ${cityList} - La Bodega Nocturna 23`,
    description: `Compra ${product.name} de ${product.brand} a domicilio en ${cityList}. ${product.volume}. Precio: $${product.price.toLocaleString()} COP. Entrega rápida 23 horas. Productos 100% originales. Pide por WhatsApp.`,
    keywords: productKeywords,
    openGraph: {
      title: `${product.name} - $${product.price.toLocaleString()} | La Bodega Nocturna 23`,
      description: `${product.name} de ${product.brand}. ${product.volume}. Domicilio 23 horas en ${cityList}. Productos originales.`,
      url: `https://www.labodega23.co/producto/${product.id}`,
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = products.find((p) => p.id === parseInt(id));
  const jsonLd = product ? {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: `https://app-xeknkpjv.fly.dev/api/img/${product.id}`,
    brand: { "@type": "Brand", name: product.brand },
    sku: String(product.id),
    offers: {
      "@type": "Offer",
      url: `https://www.labodega23.co/producto/${product.id}`,
      priceCurrency: "COP",
      price: product.price,
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "La Bodega Nocturna 23" },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviews,
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
