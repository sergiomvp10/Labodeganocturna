"use client";

import { useState, useEffect } from "react";
import { Product, products as staticProducts, categories } from "@/data/products";
import { api, ProductAPI } from "@/lib/api";
import ProductCard from "./ProductCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

function toProduct(p: ProductAPI): Product {
  return { ...p, originalPrice: p.originalPrice ?? undefined, discount: p.discount ?? undefined };
}

function filterByCategory(list: Product[], name: string): Product[] {
  return list.filter((p) => p.category.toLowerCase() === name.toLowerCase());
}

export default function CategoryPage({ slug }: { slug: string }) {
  const category = categories.find((c) => c.slug === slug);
  const categoryName = category?.name || slug;
  const [products, setProducts] = useState<Product[]>(() =>
    filterByCategory(staticProducts, categoryName)
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.storefront.products()
      .then((data) => {
        const all = data.map(toProduct);
        setProducts(filterByCategory(all, categoryName));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [categoryName]);

  return (
    <div className="bg-brand-black min-h-screen">
      <div className="bg-brand-dark border-b border-brand-gold/10">
        <div className="w-full px-4 sm:px-6 lg:px-10 py-3">
          <div className="flex items-center gap-2 text-sm text-brand-muted">
            <Link href="/" className="hover:text-brand-gold transition-colors">
              Inicio
            </Link>
            <span className="text-brand-gold/30">/</span>
            <span className="text-brand-text font-medium">{categoryName}</span>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-10 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-brand-gold hover:text-brand-gold-light text-sm font-medium mb-6"
        >
          <ArrowLeft size={16} />
          Volver al inicio
        </Link>

        <div className="text-center mb-10">
          {category && (
            <img
              src={category.image}
              alt={categoryName}
              className="w-24 h-24 object-contain mx-auto mb-4"
            />
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-brand-text">{categoryName}</h1>
          <p className="text-brand-muted mt-2">
            {loading ? "Cargando productos..." : `${products.length} productos`}
          </p>
        </div>

        {!loading && products.length === 0 && (
          <div className="text-center py-16">
            <p className="text-brand-muted text-lg">No hay productos en esta categoría.</p>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
