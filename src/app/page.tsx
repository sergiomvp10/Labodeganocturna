import HeroBanner from "@/components/HeroBanner";
import CategoryGrid from "@/components/CategoryGrid";
import FeaturedProducts from "@/components/FeaturedProducts";
import OffersSection from "@/components/OffersSection";
import { categories } from "@/data/products";
import { fetchSeoProducts } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://www.labodega23.co/",
  },
};

export default async function Home() {
  const allCities = ["Duitama", "Tunja", "Sogamoso"];
  const cityList = allCities.join(", ");
  const products = await fetchSeoProducts();
  return (
    <>
      <div style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>
        <h1>La Bodega Nocturna 23 - Licorería a Domicilio en {cityList}</h1>
        <p>Licorería a domicilio 23 horas en {cityList}, Boyacá. Whisky, tequila, aguardiente, ron, vinos, cervezas y más. Entrega rápida, productos 100% originales.</p>
        <h2>Categorías</h2>
        <ul>
          {categories.map((c) => (
            <li key={c.slug}><a href={`/categoria/${c.slug}/`}>{c.name} a domicilio en {cityList}</a></li>
          ))}
        </ul>
        <h2>Productos Destacados</h2>
        <ul>
          {products.slice(0, 20).map((p) => (
            <li key={p.id}><a href={`/producto/${p.id}/`}>{p.name} - {p.brand} - ${p.price.toLocaleString()} COP</a></li>
          ))}
        </ul>
        <p>Pide por WhatsApp al +57 311 226 0769. Domicilio en {cityList}.</p>
      </div>
      <HeroBanner />
      <CategoryGrid />
      <FeaturedProducts />
      <OffersSection />
    </>
  );
}
