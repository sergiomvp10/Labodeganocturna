"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { api, CategoryAPI } from "@/lib/api";
import { categories as staticCategories } from "@/data/products";

interface CategoriesContextType {
  categories: CategoryAPI[];
  loading: boolean;
  refresh: () => Promise<void>;
}

const CategoriesContext = createContext<CategoriesContextType>({
  categories: [],
  loading: true,
  refresh: async () => {},
});

const fallback: CategoryAPI[] = staticCategories.map((c, i) => ({
  id: i + 1,
  name: c.name,
  slug: c.slug,
  subcategories: c.subcategories,
  image: c.image,
}));

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<CategoryAPI[]>(fallback);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await api.storefront.categories();
      if (data && data.length > 0) {
        setCategories(data);
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <CategoriesContext.Provider value={{ categories, loading, refresh }}>
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  return useContext(CategoriesContext);
}
