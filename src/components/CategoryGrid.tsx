"use client";

import { categories } from "@/data/products";
import Link from "next/link";

export default function CategoryGrid() {
  return (
    <section className="py-12 bg-brand-black">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="w-10 h-0.5 bg-brand-gold mb-3" />
            <h2 className="text-2xl md:text-3xl font-bold text-brand-text">
              Categorías
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/#${cat.slug}`}
              className="group relative rounded-lg overflow-hidden border border-brand-gold/10 hover:border-brand-gold/40 transition-all"
            >
              <div className="aspect-square">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/400x400/111/c9a84c?text=" + cat.name;
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                <h3 className="text-brand-gold font-bold text-xs md:text-sm uppercase tracking-wider">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
