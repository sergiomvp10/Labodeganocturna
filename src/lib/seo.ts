import { products as staticProducts } from "@/data/products";

const API = process.env.NEXT_PUBLIC_API_URL || "https://labodega-nocturna-backend.fly.dev";

export interface SeoProduct {
  id: number;
  name: string;
  brand: string;
  price: number;
  category: string;
}

/** Catalogo para el HTML que ve el crawler; el catalogo local solo se usa si la API falla. */
export async function fetchSeoProducts(): Promise<SeoProduct[]> {
  try {
    const res = await fetch(`${API}/api/products/lite`);
    if (!res.ok) return staticProducts;
    const data: SeoProduct[] = await res.json();
    return data.length > 0 ? data : staticProducts;
  } catch {
    return staticProducts;
  }
}
