import type { SeoProduct } from "./seo";

export const SITE = "https://www.labodega23.co";
export const CITIES = ["Duitama", "Tunja", "Sogamoso"];
export const CITY_LIST = CITIES.join(", ");
export const PHONE = "+573112260769";

/** Marcas reales del catalogo, normalizadas y sin repetir. */
export function catalogBrands(products: SeoProduct[]): string[] {
  const seen = new Map<string, string>();
  for (const p of products) {
    const brand = p.brand?.trim();
    if (!brand) continue;
    const key = brand.toLowerCase();
    if (!seen.has(key)) seen.set(key, brand);
  }
  return [...seen.values()].sort((a, b) => a.localeCompare(b, "es"));
}

export function catalogCategories(products: SeoProduct[]): string[] {
  const seen = new Map<string, string>();
  for (const p of products) {
    const category = p.category?.trim();
    if (!category) continue;
    const key = category.toLowerCase();
    if (!seen.has(key)) seen.set(key, category);
  }
  return [...seen.values()].sort((a, b) => a.localeCompare(b, "es"));
}

/** Combina termino + ciudades: la mayoria de las busquedas locales llevan la ciudad. */
export function withCities(term: string): string[] {
  return CITIES.map((c) => `${term} a domicilio ${c}`);
}

/** Palabras clave construidas con las marcas y categorias que realmente vendemos. */
export function catalogKeywords(products: SeoProduct[]): string[] {
  const brands = catalogBrands(products);
  const categories = catalogCategories(products);
  return [
    ...categories.flatMap((c) => [`${c} a domicilio`, ...withCities(c), `comprar ${c} online Colombia`]),
    ...brands.flatMap((b) => [`${b} a domicilio`, `${b} precio Colombia`, `comprar ${b} Duitama`]),
    ...products.slice(0, 60).map((p) => `${p.name} a domicilio Duitama`),
  ];
}
