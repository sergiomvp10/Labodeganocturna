import HeroBanner from "@/components/HeroBanner";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedProducts from "@/components/FeaturedProducts";
import OffersSection from "@/components/OffersSection";
import { fetchSeoCategories, fetchSeoProducts } from "@/lib/seo";
import { PARTNER_CATEGORIES } from "@/lib/partners";
import { CITIES, CITY_LIST, PHONE, SITE, catalogBrands, catalogKeywords } from "@/lib/seoKeywords";
import type { Metadata } from "next";

/** Categorias con productos y sin aliados externos: son las paginas que existen. */
async function indexableCategories() {
  const [products, apiCategories] = await Promise.all([fetchSeoProducts(), fetchSeoCategories()]);
  const withProducts = new Set(products.map((p) => p.category.toLowerCase()));
  return apiCategories.filter(
    (c) => withProducts.has(c.name.toLowerCase()) && !PARTNER_CATEGORIES[c.slug]
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const products = await fetchSeoProducts();
  const brands = catalogBrands(products);
  return {
    description: `Licorería a domicilio 23 horas en ${CITY_LIST}, Boyacá. ${products.length} productos: whisky, tequila, aguardiente, ron, vinos, cervezas, cigarrillos y pasabocas. ${brands.slice(0, 10).join(", ")} y más. Envío gratis desde $200.000. Pide por WhatsApp.`,
    keywords: catalogKeywords(products).join(", "),
    alternates: {
      canonical: `${SITE}/`,
    },
  };
}

export default async function Home() {
  const products = await fetchSeoProducts();
  const categories = await indexableCategories();
  const brands = catalogBrands(products);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "La Bodega Nocturna 23",
    url: `${SITE}/`,
    inLanguage: "es-CO",
    publisher: { "@id": `${SITE}/#tienda` },
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>
        <h1>La Bodega Nocturna 23 - Licorería a Domicilio en {CITY_LIST}</h1>
        <p>Licorería a domicilio 23 horas en {CITY_LIST}, Boyacá. Whisky, tequila, aguardiente, ron, vinos, cervezas, cigarrillos y pasabocas. Entrega rápida, productos 100% originales, envío gratis desde $200.000.</p>
        <h2>Categorías</h2>
        <ul>
          {categories.map((c) => (
            <li key={c.slug}><a href={`/categoria/${c.slug}/`}>{c.name} a domicilio en {CITY_LIST}</a></li>
          ))}
        </ul>
        <h2>Catálogo completo</h2>
        <ul>
          {products.map((p) => (
            <li key={p.id}><a href={`/producto/${p.id}/`}>{p.name} - {p.brand} - ${p.price.toLocaleString("es-CO")} COP - {p.category} a domicilio en {CITY_LIST}</a></li>
          ))}
        </ul>
        <h2>Marcas disponibles</h2>
        <p>{brands.join(", ")}.</p>
        <h2>Cobertura</h2>
        <ul>
          {CITIES.map((c) => (
            <li key={c}>Licorería a domicilio en {c}, Boyacá</li>
          ))}
        </ul>
        <p>Pide por WhatsApp al {PHONE}. Domicilio en {CITY_LIST}.</p>
      </div>
      <HeroBanner />
      <CategoryGrid />
      <FeaturedProducts />
      <OffersSection />
    </>
  );
}
