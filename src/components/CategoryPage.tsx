"use client";

import { categories } from "@/data/products";
import { useProducts } from "@/context/ProductsContext";
import ProductCard from "./ProductCard";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function CategoryPage({ slug }: { slug: string }) {
  const category = categories.find((c) => c.slug === slug);
  const categoryName = category?.name || slug;
  const { products: allProducts, ready } = useProducts();

  const products = ready
    ? allProducts.filter((p) => p.category.toLowerCase() === categoryName.toLowerCase())
    : [];

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
          <h1 className="text-3xl md:text-4xl font-bold text-brand-text">{categoryName}</h1>
          <p className="text-brand-muted mt-2">
            {!ready ? "Cargando..." : `${products.length} productos`}
          </p>
        </div>

        {!ready ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-brand-dark2 rounded-xl border border-brand-gold/10 overflow-hidden animate-pulse">
                <div className="aspect-square bg-brand-dark" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-brand-dark rounded w-1/3" />
                  <div className="h-4 bg-brand-dark rounded w-2/3" />
                  <div className="h-5 bg-brand-dark rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-brand-muted text-lg">No hay productos en esta categoría.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
            {products.map((product, i) => (
              <div
                key={product.id}
                className="animate-[slideInRight_0.5s_ease-out_both]"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
