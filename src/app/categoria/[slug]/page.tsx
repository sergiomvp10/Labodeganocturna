import { categories as staticCategories } from "@/data/products";
import { fetchCategoryRoutes, fetchSeoProducts } from "@/lib/seo";
import { CITIES, CITY_LIST, PHONE, SITE, withCities } from "@/lib/seoKeywords";
import { PARTNER_CATEGORIES } from "@/lib/partners";
import CategoryPage from "@/components/CategoryPage";
import type { Metadata } from "next";

async function categoryBySlug(slug: string): Promise<{ name: string; slug: string } | undefined> {
  const routes = await fetchCategoryRoutes(staticCategories);
  return routes.find((c) => c.slug === slug);
}

export async function generateStaticParams() {
  const routes = await fetchCategoryRoutes(staticCategories);
  return routes.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = await categoryBySlug(slug);
  if (!category) return {};
  if (PARTNER_CATEGORIES[slug]) {
    return {
      title: `${category.name} | La Bodega Nocturna 23`,
      robots: { index: false, follow: true },
    };
  }
  const products = await fetchSeoProducts();
  const own = products.filter((p) => p.category.toLowerCase() === category.name.toLowerCase());
  const brands = [...new Set(own.map((p) => p.brand).filter(Boolean))];
  const cheapest = own.length ? Math.min(...own.map((p) => p.price)) : 0;
  const brandLine = brands.length ? ` Marcas: ${brands.slice(0, 8).join(", ")}.` : "";
  return {
    title: `${category.name} a Domicilio en ${CITY_LIST} | La Bodega Nocturna 23`,
    description: `Compra ${category.name} a domicilio en ${CITY_LIST}, Boyacá. ${own.length} productos disponibles desde $${cheapest.toLocaleString("es-CO")}.${brandLine} Entrega en 30 minutos, 23 horas al día, productos 100% originales.`,
    keywords: [
      category.name,
      ...withCities(category.name),
      ...CITIES.map((c) => `licorería ${c}`),
      ...brands.flatMap((b) => [`${b} a domicilio`, `${b} precio Colombia`]),
      ...own.slice(0, 25).map((p) => `${p.name} a domicilio`),
      `comprar ${category.name} online Colombia`,
      `${category.name} barato Boyacá`,
      "La Bodega Nocturna 23",
    ].join(", "),
    alternates: {
      canonical: `${SITE}/categoria/${slug}/`,
    },
    openGraph: {
      title: `${category.name} a Domicilio en ${CITY_LIST} | La Bodega Nocturna 23`,
      description: `${own.length} productos de ${category.name} con domicilio en ${CITY_LIST}. Entrega rápida 23 horas.${brandLine}`,
      url: `${SITE}/categoria/${slug}/`,
      images: [`${SITE}/logo.png`],
    },
  };
}

export default async function CategoriaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await categoryBySlug(slug);
  const products = await fetchSeoProducts();
  const categoryProducts = products.filter((p) => p.category.toLowerCase() === category?.name.toLowerCase());
  const jsonLd = category && !PARTNER_CATEGORIES[slug] ? [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: category.name, item: `${SITE}/categoria/${slug}/` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `${category.name} a domicilio en ${CITY_LIST}`,
      numberOfItems: categoryProducts.length,
      itemListElement: categoryProducts.map((p, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE}/producto/${p.id}/`,
        name: p.name,
      })),
    },
  ] : null;
  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {category && (
        <div style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>
          <h1>{category.name} a Domicilio en {CITY_LIST} - La Bodega Nocturna 23</h1>
          <p>Compra {category.name} a domicilio en {CITY_LIST}. {categoryProducts.length} productos disponibles. Entrega rápida 23 horas.</p>
          <ul>
            {categoryProducts.map((p) => (
              <li key={p.id}><a href={`/producto/${p.id}/`}>{p.name} - {p.brand} - ${p.price.toLocaleString("es-CO")} COP</a></li>
            ))}
          </ul>
          <p>Licorería a domicilio en {CITY_LIST}. Productos 100% originales. Pide por WhatsApp al {PHONE}.</p>
        </div>
      )}
      <CategoryPage slug={slug} />
    </>
  );
}
