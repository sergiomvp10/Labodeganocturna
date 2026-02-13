"use client";

import { categories } from "@/data/products";
import Link from "next/link";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CategoryGrid() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      const amount = 200;
      scrollRef.current.scrollBy({
        left: dir === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-10 md:py-14 bg-brand-black">
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="text-center mb-8">
          <p className="text-brand-gold text-xs uppercase tracking-[0.2em] mb-2">
            Nuestras categorías
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-brand-text">
            Explora nuestra variedad
          </h2>
        </div>

        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="absolute -left-1 top-1/2 -translate-y-1/2 z-10 bg-brand-dark border border-brand-gold/20 text-brand-gold p-1.5 rounded-full hover:bg-brand-gold hover:text-brand-black transition-colors cursor-pointer hidden md:flex"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute -right-1 top-1/2 -translate-y-1/2 z-10 bg-brand-dark border border-brand-gold/20 text-brand-gold p-1.5 rounded-full hover:bg-brand-gold hover:text-brand-black transition-colors cursor-pointer hidden md:flex"
          >
            <ChevronRight size={18} />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-6 md:gap-8 overflow-x-auto pb-2 justify-center"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/#${cat.slug}`}
                className="flex-shrink-0 flex flex-col items-center gap-3 group"
              >
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 border-brand-gold/20 group-hover:border-brand-gold transition-colors">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/200x200/111/c9a84c?text=" + encodeURIComponent(cat.name);
                    }}
                  />
                </div>
                <span className="text-xs text-brand-muted group-hover:text-brand-gold transition-colors text-center leading-tight font-medium">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
