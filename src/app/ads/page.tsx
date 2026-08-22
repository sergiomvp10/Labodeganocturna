import HeroBanner from "@/components/HeroBanner";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedProducts from "@/components/FeaturedProducts";
import OffersSection from "@/components/OffersSection";
import { fetchSeoCategories, fetchSeoProducts } from "@/lib/seo";
import { PARTNER_CATEGORIES } from "@/lib/partners";
import { isTobaccoCategoryName, isTobaccoSlug } from "@/lib/tobacco";
import { PHONE, SITE, catalogBrands } from "@/lib/seoKeywords";
import type { Metadata } from "next";

const CITY = "Duitama";

/**
 * Landing para campanas de Google Ads: identica a la tienda pero sin tabaco,
 * que la politica de Google prohibe promocionar. No se indexa para no competir
 * con la home en organico.
 */
export const metadata: Metadata = {
  title: `Licores a Domicilio en ${CITY} | La Bodega Nocturna 23`,
  description: `Whisky, ron, tequila, aguardiente, vinos y cervezas a domicilio en ${CITY}, Boyacá. Envío gratis desde $200.000. Solo para mayores de 18 años.`,
  robots: { index: false, follow: false },
  alternates: { canonical: `${SITE}/ads/` },
  keywords: [
    `licores a domicilio ${CITY}`,
    `domicilios de licor ${CITY}`,
    `licorera a domicilio ${CITY}`,
    `whisky a domicilio ${CITY}`,
    `cerveza a domicilio ${CITY}`,
    `aguardiente a domicilio ${CITY}`,
    `ron a domicilio ${CITY}`,
  ].join(", "),
  openGraph: {
    title: `Licores a Domicilio en ${CITY} | La Bodega Nocturna 23`,
    description: `Whisky, ron, tequila, aguardiente, vinos y cervezas a domicilio en ${CITY}, Boyacá. Solo para mayores de 18 años.`,
    url: `${SITE}/ads/`,
    siteName: "La Bodega Nocturna 23",
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Licores a Domicilio en ${CITY}`,
    description: `Whisky, ron, tequila, aguardiente, vinos y cervezas a domicilio en ${CITY}, Boyacá.`,
  },
};

export default async function AdsLanding() {
  const [products, apiCategories] = await Promise.all([fetchSeoProducts(), fetchSeoCategories()]);
  const withoutTobacco = products.filter((p) => !isTobaccoCategoryName(p.category));
  const withProducts = new Set(withoutTobacco.map((p) => p.category.toLowerCase()));
  const categories = apiCategories.filter(
    (c) =>
      withProducts.has(c.name.toLowerCase()) &&
      !PARTNER_CATEGORIES[c.slug] &&
      !isTobaccoSlug(c.slug)
  );
  const brands = catalogBrands(withoutTobacco);
  return (
    <>
      <div style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>
        <h1>Licores a domicilio en {CITY} - La Bodega Nocturna 23</h1>
        <p>
          Venta y entrega de bebidas alcohólicas en {CITY}, Boyacá, exclusivamente para personas
          mayores de 18 años. Contenido alcohólico de los productos: hasta 45% Vol. El exceso de
          alcohol es perjudicial para la salud. Prohíbase el expendio de bebidas embriagantes a
          menores de edad.
        </p>
        <h2>Categorías disponibles</h2>
        <ul>
          {categories.map((c) => (
            <li key={c.slug}>
              <a href={`/categoria/${c.slug}/`}>{c.name} a domicilio en {CITY}</a>
            </li>
          ))}
        </ul>
        <h2>Marcas</h2>
        <p>{brands.join(", ")}.</p>
        <p>Domicilio $6.000 en {CITY}. Envío gratis desde $200.000. Pedidos por WhatsApp al {PHONE}.</p>
      </div>
      <HeroBanner />
      <CategoryGrid hideTobacco />
      <FeaturedProducts hideTobacco />
      <OffersSection hideTobacco />
      <section className="bg-brand-black px-4 pb-16 text-center">
        <p className="mx-auto max-w-3xl text-xs md:text-sm text-brand-muted leading-relaxed">
          Venta exclusiva para mayores de 18 años. Contenido alcohólico de los productos: hasta 45%
          Vol. El exceso de alcohol es perjudicial para la salud. Prohíbase el expendio de bebidas
          embriagantes a menores de edad.
        </p>
      </section>
    </>
  );
}
