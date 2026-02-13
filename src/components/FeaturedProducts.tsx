"use client";

import { products } from "@/data/products";
import ProductCard from "./ProductCard";

export default function FeaturedProducts() {
  const featured = products.filter((p) => p.featured);

  return (
    <section className="py-12 bg-brand-dark2">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="w-10 h-0.5 bg-brand-gold mb-3" />
            <h2 className="text-2xl md:text-3xl font-bold text-brand-text">
              Productos Destacados
            </h2>
            <p className="text-brand-muted text-sm mt-1 tracking-wide">
              Los más vendidos de la semana
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
