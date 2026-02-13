"use client";

import { products, categories } from "@/data/products";
import ProductCard from "./ProductCard";

export default function AllProducts() {
  return (
    <section className="py-10 md:py-14 bg-brand-dark">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        {categories.map((cat) => {
          const catProducts = products.filter((p) => p.category === cat.name);
          if (catProducts.length === 0) return null;
          return (
            <div key={cat.slug} id={cat.slug} className="mb-14 last:mb-0 scroll-mt-32">
              <div className="text-center" style={{ marginBottom: "5rem" }}>
                <p className="text-brand-gold text-sm md:text-base uppercase tracking-[0.25em] mb-3">
                  {cat.name}
                </p>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-text">
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
