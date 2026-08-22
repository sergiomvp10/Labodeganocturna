"use client";

import { Product } from "@/data/products";
import ProductCard, { ProductCardSkeleton } from "./ProductCard";
import { useState, useEffect, useRef, useCallback } from "react";
import { api, ProductAPI } from "@/lib/api";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { isTobaccoCategoryName } from "@/lib/tobacco";

function toProduct(p: ProductAPI): Product {
  return { ...p, originalPrice: p.originalPrice ?? undefined, discount: p.discount ?? undefined };
}

export default function FeaturedProducts({ hideTobacco = false }: { hideTobacco?: boolean }) {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const innerRef = useRef<HTMLDivElement>(null);
  const [animPaused, setAnimPaused] = useState(false);
  const dragRef = useRef({ isDragging: false, startX: 0, startOffset: 0 });
  const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    api.storefront.featured()
      .then((data) =>
        setFeatured(
          data
            .map(toProduct)
            .filter((p) => !hideTobacco || !isTobaccoCategoryName(p.category))
        )
      )
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [hideTobacco]);

  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    };
  }, []);

  const getCurrentTranslateX = (): number => {
    if (!innerRef.current) return 0;
    const computed = window.getComputedStyle(innerRef.current);
    const t = computed.transform;
    if (t === "none") return 0;
    const match = t.match(/matrix.*\((.+)\)/);
    if (match) {
      const values = match[1].split(", ");
      return parseFloat(values[4]) || 0;
    }
    return 0;
  };

  const startDrag = (clientX: number) => {
    const currentX = getCurrentTranslateX();
    dragRef.current = { isDragging: true, startX: clientX, startOffset: currentX };
    setAnimPaused(true);
    if (innerRef.current) {
      innerRef.current.style.transform = `translateX(${currentX}px)`;
    }
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
  };

  const moveDrag = (clientX: number) => {
    if (!dragRef.current.isDragging || !innerRef.current) return;
    const delta = clientX - dragRef.current.startX;
    innerRef.current.style.transform = `translateX(${dragRef.current.startOffset + delta}px)`;
  };

  const endDrag = () => {
    dragRef.current.isDragging = false;
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => {
      if (innerRef.current) {
        innerRef.current.style.transform = "";
      }
      setAnimPaused(false);
    }, 3000);
  };

  const handleMouseDown = (e: React.MouseEvent) => { startDrag(e.clientX); };
  const handleMouseMove = (e: React.MouseEvent) => { if (dragRef.current.isDragging) e.preventDefault(); moveDrag(e.clientX); };
  const handleMouseUp = () => { endDrag(); };

  const handleTouchStart = (e: React.TouchEvent) => { startDrag(e.touches[0].clientX); };
  const handleTouchMove = (e: React.TouchEvent) => { moveDrag(e.touches[0].clientX); };
  const handleTouchEnd = () => { endDrag(); };

  const scrollByAmount = (direction: number) => {
    const currentX = getCurrentTranslateX();
    setAnimPaused(true);
    if (innerRef.current) {
      innerRef.current.style.transform = `translateX(${currentX + direction * -280}px)`;
    }
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current);
    pauseTimeoutRef.current = setTimeout(() => {
      if (innerRef.current) {
        innerRef.current.style.transform = "";
      }
      setAnimPaused(false);
    }, 3000);
  };

  if (featured.length === 0 && !loading) return null;

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

          <div className="overflow-hidden">
            <div
              ref={innerRef}
              className="flex gap-5 w-max"
              style={{
                animation: animPaused ? "none" : "marquee-featured 40s linear infinite",
                cursor: dragRef.current.isDragging ? "grabbing" : "grab",
              }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {featured.length === 0
                ? Array.from({ length: 8 }).map((_, i) => (
                    <div key={`skeleton-${i}`} className="flex-shrink-0 w-56 md:w-64">
                      <ProductCardSkeleton />
                    </div>
                  ))
                : [...featured, ...featured, ...featured].map((product, i) => (
                    <div key={`${product.id}-${i}`} className="flex-shrink-0 w-56 md:w-64" style={{ userSelect: "none" }}>
                      <ProductCard product={product} />
                    </div>
                  ))}
            </div>
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
