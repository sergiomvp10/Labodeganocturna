"use client";

import { products as defaultProducts, Product } from "@/data/products";
import ProductCard from "./ProductCard";
import { useRef, useEffect, useState } from "react";
import { useSiteConfig } from "@/context/SiteConfigContext";

export default function OffersSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { offerIds } = useSiteConfig();
  const [allProducts, setAllProducts] = useState<Product[]>(defaultProducts);

  useEffect(() => {
    const stored = localStorage.getItem("lbn_products");
    if (stored) setAllProducts(JSON.parse(stored));
  }, []);

  const offers = offerIds.length > 0
    ? allProducts.filter((p) => offerIds.includes(p.id)).slice(0, 12)
    : allProducts.filter((p) => p.originalPrice).slice(0, 12);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowH = window.innerHeight;
      const progress = Math.max(0, Math.min(1, (windowH - rect.top) / (windowH + rect.height)));
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (offers.length === 0) return null;

  const speeds = [0.3, -0.2, 0.4, -0.15, 0.25, -0.35, 0.2, -0.25, 0.35, -0.3, 0.15, -0.4];

  return (
    <section ref={sectionRef} className="pt-10 md:pt-14 bg-brand-black overflow-hidden" style={{ paddingBottom: "12rem" }}>
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="text-center" style={{ marginBottom: "5rem" }}>
          <p className="text-brand-gold text-sm md:text-base uppercase tracking-[0.25em] mb-3">
            Ahorra hoy
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-text">
            Ofertas especiales
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {offers.map((product, i) => {
            const speed = speeds[i % speeds.length];
            const offset = (scrollProgress - 0.5) * speed * 120;
            return (
              <div
                key={product.id}
                className="transition-opacity duration-500"
                style={{
                  transform: `translateY(${offset}px)`,
                  opacity: scrollProgress > 0.05 ? 1 : 0,
                  willChange: "transform",
                }}
              >
                <ProductCard product={product} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
