const API = process.env.NEXT_PUBLIC_API_URL || "https://labodega-nocturna-backend.fly.dev";

/**
 * La cache de fetch de Next sobrevive entre despliegues, asi que un build podia
 * generar el sitio (y el sitemap) con un catalogo viejo y publicar URLs ya borradas.
 * Un token distinto por build convierte cada peticion en una URL nueva y sin cache.
 */
export const BUILD = process.env.VERCEL_DEPLOYMENT_ID || process.env.VERCEL_GIT_COMMIT_SHA || String(Date.now());

function fresh(url: string): string {
  return `${url}${url.includes("?") ? "&" : "?"}build=${encodeURIComponent(BUILD)}`;
}

export interface SeoProduct {
  id: number;
  name: string;
  brand: string;
  price: number;
  category: string;
}

/**
 * Catalogo para el HTML que ve el crawler y para generateStaticParams.
 * Falla el build si la API no responde: es preferible mantener el sitio anterior
 * a publicar paginas con el catalogo demo.
 */
export async function fetchSeoProducts(): Promise<SeoProduct[]> {
  const url = `${API}/api/products/lite`;
  let lastError = "";
  // La maquina del backend duerme: el primer intento puede fallar mientras despierta.
  for (let attempt = 0; attempt < 5; attempt++) {
    if (attempt > 0) await new Promise((r) => setTimeout(r, 3000 * attempt));
    try {
      const res = await fetch(fresh(url));
      if (!res.ok) {
        lastError = `HTTP ${res.status}`;
        continue;
      }
      const data: SeoProduct[] = await res.json();
      if (data.length > 0) return data;
      lastError = "catalogo vacio";
    } catch (e) {
      lastError = String(e);
    }
  }
  throw new Error(`No se pudo leer el catalogo de ${url} (${lastError}); se aborta el build`);
}

export interface SeoCategory {
  name: string;
  slug: string;
}

/**
 * Categorias del backend: son la fuente de verdad de las rutas /categoria/<slug>/,
 * asi una categoria nueva o renombrada no queda como 404 en el sitio publicado.
 */
export async function fetchSeoCategories(): Promise<SeoCategory[]> {
  const url = `${API}/api/storefront/categories`;
  let lastError = "";
  for (let attempt = 0; attempt < 5; attempt++) {
    if (attempt > 0) await new Promise((r) => setTimeout(r, 3000 * attempt));
    try {
      const res = await fetch(fresh(url));
      if (!res.ok) {
        lastError = `HTTP ${res.status}`;
        continue;
      }
      const data: SeoCategory[] = await res.json();
      if (data.length > 0) return data.map((c) => ({ name: c.name, slug: c.slug }));
      lastError = "sin categorias";
    } catch (e) {
      lastError = String(e);
    }
  }
  throw new Error(`No se pudieron leer las categorias de ${url} (${lastError}); se aborta el build`);
}

/**
 * Rutas /categoria/<slug>/ que deben existir: las del backend mas las categorias
 * historicas del front que todavia tienen productos (evita 404 y paginas vacias).
 */
export async function fetchCategoryRoutes(staticCategories: SeoCategory[]): Promise<SeoCategory[]> {
  const [products, apiCategories] = await Promise.all([fetchSeoProducts(), fetchSeoCategories()]);
  const withProducts = new Set(products.map((p) => p.category.toLowerCase()));
  const routes = new Map(apiCategories.map((c) => [c.slug, c]));
  for (const c of staticCategories) {
    if (!routes.has(c.slug) && withProducts.has(c.name.toLowerCase())) routes.set(c.slug, c);
  }
  return [...routes.values()];
}
