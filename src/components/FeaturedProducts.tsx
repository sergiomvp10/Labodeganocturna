"use client";

import { Product, products as staticProducts } from "@/data/products";
import ProductCard from "./ProductCard";
import { useState, useEffect, useRef, useCallback } from "react";
import { api, ProductAPI } from "@/lib/api";
import { ChevronLeft, ChevronRight } from "lucide-react";

function toProduct(p: ProductAPI): Product {
  return { ...p, originalPrice: p.originalPrice ?? undefined, discount: p.discount ?? undefined };
}

const staticFeatured = staticProducts.filter((p) => p.featured);

export default function FeaturedProducts() {
  const [featured, setFeatured] = useState<Product[]>(staticFeatured);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftPos, setScrollLeftPos] = useState(0);
  const rafRef = useRef<number | null>(null);
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPausedRef = useRef(false);

  useEffect(() => {
    api.storefront.featured().then((data) => {
      if (data.length > 0) setFeatured(data.map(toProduct));
    }).catch(() => {});
  }, []);

  const animate = useCallback(() => {
    const el = scrollRef.current;
    if (el && !isPausedRef.current) {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 2) {
        el.scrollLeft = 0;
      } else {
        el.scrollLeft += 0.8;
      }
    }
    rafRef.current = requestAnimationFrame(animate);
  }, []);

  const pauseAutoScroll = useCallback(() => {
    isPausedRef.current = true;
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => {
      isPausedRef.current = false;
    }, 4000);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };
  }, [animate]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeftPos(scrollRef.current?.scrollLeft || 0);
    pauseAutoScroll();
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - (scrollRef.current.offsetLeft || 0);
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeftPos - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeftPos(scrollRef.current?.scrollLeft || 0);
    pauseAutoScroll();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!scrollRef.current) return;
    const x = e.touches[0].pageX - (scrollRef.current.offsetLeft || 0);
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeftPos - walk;
  };

  const scrollByAmount = (direction: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: direction * 280, behavior: "smooth" });
    pauseAutoScroll();
  };

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

        <div className="relative group">
          <button
            onClick={() => scrollByAmount(-1)}
            className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-brand-dark/90 border border-brand-gold/30 items-center justify-center text-brand-gold hover:bg-brand-gold hover:text-brand-black transition-all cursor-pointer opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft size={22} />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto px-4 sm:px-6 lg:px-10 scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch", cursor: isDragging ? "grabbing" : "grab" }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          >
            {[...featured, ...featured, ...featured].map((product, i) => (
              <div key={`${product.id}-${i}`} className="flex-shrink-0 w-56 md:w-64" style={{ userSelect: "none" }}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          <button
            onClick={() => scrollByAmount(1)}
            className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-brand-dark/90 border border-brand-gold/30 items-center justify-center text-brand-gold hover:bg-brand-gold hover:text-brand-black transition-all cursor-pointer opacity-0 group-hover:opacity-100"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>
    </section>
  );
}
