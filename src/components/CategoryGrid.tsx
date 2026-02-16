"use client";

import { useEffect, useRef, useState } from "react";
import { useCategories } from "@/context/CategoriesContext";
import { CategoryAPI } from "@/lib/api";
import Link from "next/link";

function CategoryCard({ cat, index }: { cat: CategoryAPI; index: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Link
      ref={ref}
      key={cat.slug}
      href={`/categoria/${cat.slug}`}
      className="group flex flex-col items-center transition-all duration-700 ease-out"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(80px)",
        transitionDelay: `${index * 80}ms`,
      }}
    >
      <div className="relative w-full aspect-square overflow-hidden group-hover:scale-105 transition-transform duration-300">
        <img
          src={cat.image}
          alt={cat.name}
          loading="lazy"
          decoding="async"
          width={400}
          height={400}
          className="w-full h-full object-contain p-2 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://placehold.co/400x400/111/c9a84c?text=" + encodeURIComponent(cat.name);
          }}
        />
      </div>
      <span className="mt-3 text-base md:text-lg font-bold text-white tracking-wide text-center" style={{ fontFamily: "'Times New Roman', 'Georgia', serif" }}>
        {cat.name}
      </span>
    </Link>
  );
}

export default function CategoryGrid() {
  const { categories } = useCategories();

  return (
    <section className="pt-16 md:pt-20 bg-brand-black" style={{ paddingBottom: "12rem" }}>
      <div className="w-full flex flex-col items-center">
        <div className="text-center" style={{ marginBottom: "5rem" }}>
          <p className="text-brand-gold text-sm md:text-base uppercase tracking-[0.25em] mb-3">
            Nuestras categorias
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-text">
            Explora nuestra variedad
          </h2>
        </div>

        <div className="w-[90%] max-w-[1300px] grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
          {categories.map((cat, i) => (
            <CategoryCard key={cat.slug} cat={cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
