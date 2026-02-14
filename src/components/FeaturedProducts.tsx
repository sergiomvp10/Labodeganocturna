"use client";

import { Product, products as staticProducts } from "@/data/products";
import ProductCard from "./ProductCard";
import { useState, useEffect } from "react";
import { api, ProductAPI } from "@/lib/api";

function toProduct(p: ProductAPI): Product {
  return { ...p, originalPrice: p.originalPrice ?? undefined, discount: p.discount ?? undefined };
}

const staticFeatured = staticProducts.filter((p) => p.featured);

export default function FeaturedProducts() {
  const [paused, setPaused] = useState(false);
  const [featured, setFeatured] = useState<Product[]>(staticFeatured);

  useEffect(() => {
    api.storefront.featured().then((data) => {
      if (data.length > 0) setFeatured(data.map(toProduct));
    }).catch(() => {});
  }, []);

  if (featured.length === 0) return null;

  return (
    <section className="pt-10 md:pt-14 bg-brand-dark" style={{ paddingBottom: "12rem" }}>
      <div className="w-full">
        <div className="text-center px-4 sm:px-6 lg:px-10" style={{ marginBottom: "5rem" }}>
          <p className="text-brand-gold text-sm md:text-base uppercase tracking-[0.25em] mb-3">
            Lo más vendido
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-text">
            Productos destacados
          </h2>
        </div>

        <div className="overflow-hidden">
          <div
            className="flex gap-5 w-max"
            style={{
              animation: "marquee-featured 40s linear infinite",
              animationPlayState: paused ? "paused" : "running",
            }}
            onMouseDown={() => setPaused(true)}
            onMouseUp={() => setPaused(false)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={() => setPaused(true)}
            onTouchEnd={() => setPaused(false)}
          >
            {[...featured, ...featured, ...featured].map((product, i) => (
              <div key={`${product.id}-${i}`} className="flex-shrink-0 w-56 md:w-64">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
