import type { MetadataRoute } from "next";
import { fetchCategoryRoutes, fetchSeoProducts } from "@/lib/seo";
import { PARTNER_CATEGORIES } from "@/lib/partners";
import { SITE } from "@/lib/seoKeywords";
import { categories as staticCategories } from "@/data/products";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, routes] = await Promise.all([
    fetchSeoProducts(),
    fetchCategoryRoutes(staticCategories),
  ]);
  const lastModified = new Date();
  const withProducts = new Set(products.map((p) => p.category.toLowerCase()));

  // Sin productos la pagina queda vacia, y las categorias aliadas salen del sitio.
  const indexable = routes.filter(
    (c) => withProducts.has(c.name.toLowerCase()) && !PARTNER_CATEGORIES[c.slug]
  );

  return [
    { url: `${SITE}/`, lastModified, changeFrequency: "daily", priority: 1 },
    ...indexable.map((c) => ({
      url: `${SITE}/categoria/${c.slug}/`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...products.map((p) => ({
      url: `${SITE}/producto/${p.id}/`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
