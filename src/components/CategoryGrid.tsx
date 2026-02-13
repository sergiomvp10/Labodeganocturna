"use client";

import { categories } from "@/data/products";
import Link from "next/link";

export default function CategoryGrid() {
  return (
    <section className="pt-16 md:pt-20 pb-10 md:pb-14 bg-brand-black">
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="text-center mb-12">
          <p className="text-brand-gold text-sm md:text-base uppercase tracking-[0.25em] mb-3">
            Nuestras categorias
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-brand-text">
            Explora nuestra variedad
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 md:gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/#${cat.slug}`}
              className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-brand-gold/20 hover:border-brand-gold transition-all duration-300"
            >
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/400x400/111/c9a84c?text=" + encodeURIComponent(cat.name);
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4">
                <span className="text-sm md:text-base font-bold text-white drop-shadow-lg">
                  {cat.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
