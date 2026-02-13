"use client";

import { products } from "@/data/products";
import ProductCard from "./ProductCard";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function OffersSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const offers = products.filter((p) => p.originalPrice).slice(0, 12);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  if (offers.length === 0) return null;

  return (
    <section className="py-10 md:py-14 bg-brand-black">
      <div className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-brand-gold text-xs uppercase tracking-[0.2em] mb-2">
              Ahorra hoy
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-brand-text">
              Ofertas especiales
            </h2>
          </div>
          <div className="flex gap-2">
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
        </div>

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {offers.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-56 md:w-64">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
