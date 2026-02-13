"use client";

import { products } from "@/data/products";
import ProductCard from "./ProductCard";
import { useRef, useEffect, useCallback } from "react";

export default function FeaturedProducts() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);
  const pausedRef = useRef(false);
  const featured = products.filter((p) => p.featured).slice(0, 12);
  const doubledFeatured = [...featured, ...featured];

  const animate = useCallback(() => {
    const el = scrollRef.current;
    if (el && !pausedRef.current) {
      el.scrollLeft += 0.5;
      const halfScroll = el.scrollWidth / 2;
      if (el.scrollLeft >= halfScroll) {
        el.scrollLeft -= halfScroll;
      }
    }
    animRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    animRef.current = requestAnimationFrame(animate);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [animate]);

  const handleMouseDown = () => { pausedRef.current = true; };
  const handleMouseUp = () => { pausedRef.current = false; };
  const handleMouseLeave = () => { pausedRef.current = false; };

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

        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-hidden pb-4 cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleMouseDown}
          onTouchEnd={handleMouseUp}
        >
          {doubledFeatured.map((product, i) => (
            <div key={`${product.id}-${i}`} className="flex-shrink-0 w-56 md:w-64">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
