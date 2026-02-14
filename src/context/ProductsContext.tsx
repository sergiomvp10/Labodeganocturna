"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product, products as staticProducts } from "@/data/products";
import { api, ProductAPI } from "@/lib/api";

const CACHE_KEY = "lbn_products_cache";

function toProduct(p: ProductAPI): Product {
  return { ...p, originalPrice: p.originalPrice ?? undefined, discount: p.discount ?? undefined };
}

function getCached(): Product[] | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Product[];
  } catch {
    return null;
  }
}

function setCache(products: Product[]) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(products));
  } catch {}
}

interface ProductsContextType {
  products: Product[];
  ready: boolean;
}

const ProductsContext = createContext<ProductsContextType>({
  products: [],
  ready: false,
});

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(staticProducts);
  const [ready, setReady] = useState(true);

  useEffect(() => {
    const cached = getCached();
    if (cached && cached.length > 0) {
      setProducts(cached);
    }
    api.storefront.products()
      .then((data) => {
        const fresh = data.map(toProduct);
        setProducts(fresh);
        setCache(fresh);
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  return (
    <ProductsContext.Provider value={{ products, ready }}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductsContext);
}
