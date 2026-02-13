"use client";

import { products, categories } from "@/data/products";
import ProductCard from "./ProductCard";

export default function AllProducts() {
  return (
    <section className="py-10 md:py-14 bg-brand-dark">
      <div className="w-full px-4 sm:px-8 lg:px-12">
        {categories.map((cat) => {
          const catProducts = products.filter((p) => p.category === cat.name);
          if (catProducts.length === 0) return null;
          return (
            <div key={cat.slug} id={cat.slug} className="mb-14 last:mb-0 scroll-mt-32">
              <div className="mb-6">
                <p className="text-brand-gold text-xs uppercase tracking-[0.2em] mb-1">
                  {cat.name}
                </p>
                <h2 className="text-xl md:text-2xl font-bold text-brand-text">
                  {cat.name}
                </h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
                {catProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
