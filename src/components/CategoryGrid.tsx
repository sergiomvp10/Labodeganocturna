"use client";

import { categories } from "@/data/products";
import Link from "next/link";

export default function CategoryGrid() {
  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-brand-text">
            Compra por Categoría
          </h2>
          <Link
            href="/#"
            className="text-brand-red hover:underline text-sm font-medium"
          >
            Ver Todas →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/#${cat.slug}`}
              className="group relative rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow"
            >
              <div className="aspect-square">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/400x400/1a1a2e/d4a843?text=" + cat.name;
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-white font-bold text-base md:text-lg">
                  {cat.name}
                </h3>
                <p className="text-gray-300 text-xs">
                  {cat.subcategories.length} subcategorías
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
