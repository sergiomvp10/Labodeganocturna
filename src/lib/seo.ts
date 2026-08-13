const API = process.env.NEXT_PUBLIC_API_URL || "https://labodega-nocturna-backend.fly.dev";

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
      const res = await fetch(url);
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
