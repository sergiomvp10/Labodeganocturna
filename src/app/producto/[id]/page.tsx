import { BUILD, fetchSeoCategories, fetchSeoProducts } from "@/lib/seo";
import { CITIES, CITY_LIST, PHONE } from "@/lib/seoKeywords";
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
      const res = await fetch(`${API}/api/products/${id}?build=${encodeURIComponent(BUILD)}`);
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
    ...allCities.map((c) => `${name} a domicilio ${c}`),
    ...allCities.map((c) => `${brand} a domicilio ${c}`),
    ...allCities.map((c) => `${category} a domicilio ${c}`),
    ...allCities.map((c) => `licorería a domicilio ${c}`),
    `comprar ${name} online`,
    `${name} precio`,
    `${brand} precio Colombia`,
    `${category} a domicilio Boyacá`,
    `${category} barato Boyacá`,
    "La Bodega Nocturna 23",
  ].join(", ");
  return {
    title: `${name} ${volume} | Domicilio en ${cityList} - La Bodega Nocturna 23`,
    description: `Compra ${name} de ${brand} a domicilio en ${cityList}. ${volume}. Precio: $${price?.toLocaleString("es-CO")} COP. Entrega rápida 23 horas. Productos 100% originales. Pide por WhatsApp.`,
    keywords: productKeywords,
    alternates: {
      canonical: `https://www.labodega23.co/producto/${id}/`,
    },
    openGraph: {
      type: "website",
      title: `${name} - $${price?.toLocaleString("es-CO")} | La Bodega Nocturna 23`,
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
  const inStock = apiProduct?.inStock;
  const volume = apiProduct?.volume;
  const category = apiProduct?.category;
  const [catalog, apiCategories] = await Promise.all([fetchSeoProducts(), fetchSeoCategories()]);
  const categorySlug = apiCategories.find((c) => c.name.toLowerCase() === category?.toLowerCase())?.slug;
  const related = catalog
    .filter((p) => p.id !== numId && p.category.toLowerCase() === category?.toLowerCase())
    .slice(0, 8);
  const jsonLd = name ? [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name,
      description,
      image: imageUrl(apiProduct?.image),
      brand: { "@type": "Brand", name: brand },
      category,
      sku: id,
      mpn: id,
      offers: {
        "@type": "Offer",
        url: `${SITE}/producto/${id}/`,
        priceCurrency: "COP",
        price,
        itemCondition: "https://schema.org/NewCondition",
        availability: inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        areaServed: CITIES.map((c) => ({ "@type": "City", name: c })),
        seller: { "@id": `${SITE}/#tienda`, "@type": "Organization", name: "La Bodega Nocturna 23" },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE}/` },
        ...(categorySlug && category
          ? [{ "@type": "ListItem", position: 2, name: category, item: `${SITE}/categoria/${categorySlug}/` }]
          : []),
        { "@type": "ListItem", position: categorySlug ? 3 : 2, name, item: `${SITE}/producto/${id}/` },
      ],
    },
  ] : null;
  const cityList = CITY_LIST;
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
          <p>Precio: ${price?.toLocaleString("es-CO")} COP</p>
          <p>{description}</p>
          <p>{inStock ? "Disponible para entrega inmediata" : "Agotado"}</p>
          <p>Domicilio a {cityList}. Entrega rápida 23 horas. Productos 100% originales.</p>
          <p>Compra {name} de {brand} a domicilio en {cityList}. Pide por WhatsApp al {PHONE}.</p>
          {categorySlug && (
            <p>
              <a href={`/categoria/${categorySlug}/`}>Ver todo {category} a domicilio en {cityList}</a>
            </p>
          )}
          {related.length > 0 && (
            <>
              <h2>También en {category}</h2>
              <ul>
                {related.map((p) => (
                  <li key={p.id}>
                    <a href={`/producto/${p.id}/`}>{p.name} - {p.brand} - ${p.price.toLocaleString("es-CO")} COP</a>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
      <ProductPageClient id={id} />
    </>
  );
}
