"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product, products as staticProducts } from "@/data/products";
import { api, ProductAPI } from "@/lib/api";

function toProduct(p: ProductAPI): Product {
  return { ...p, originalPrice: p.originalPrice ?? undefined, discount: p.discount ?? undefined };
}

interface ProductsContextType {
  products: Product[];
  ready: boolean;
}

const ProductsContext = createContext<ProductsContextType>({
  products: staticProducts,
  ready: false,
});

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(staticProducts);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    api.storefront.products()
      .then((data) => setProducts(data.map(toProduct)))
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
