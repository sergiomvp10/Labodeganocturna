"use client";

import { products } from "@/data/products";
import ProductCard from "./ProductCard";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function FeaturedProducts() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const featured = products.filter((p) => p.featured).slice(0, 12);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  if (featured.length === 0) return null;

  return (
    <section className="pt-10 md:pt-14 bg-brand-dark" style={{ paddingBottom: "12rem" }}>
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="text-center" style={{ marginBottom: "5rem" }}>
          <p className="text-brand-gold text-sm md:text-base uppercase tracking-[0.25em] mb-3">
            Lo más vendido
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-text">
            Productos destacados
          </h2>
        </div>

        <div className="flex items-center justify-end gap-2 mb-4">
          <button
            onClick={() => scroll("left")}
            className="bg-brand-dark2 border border-brand-gold/20 text-brand-gold p-2 rounded-full hover:bg-brand-gold hover:text-brand-black transition-colors cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="bg-brand-dark2 border border-brand-gold/20 text-brand-gold p-2 rounded-full hover:bg-brand-gold hover:text-brand-black transition-colors cursor-pointer"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {featured.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-56 md:w-64">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
