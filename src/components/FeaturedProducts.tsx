"use client";

import { products } from "@/data/products";
import ProductCard from "./ProductCard";

export default function FeaturedProducts() {
  const featured = products.filter((p) => p.featured);

  return (
    <section className="py-10 bg-brand-light">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-brand-text">
              Productos Destacados
            </h2>
            <p className="text-brand-muted text-sm mt-1">
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
