"use client";

import { useState } from "react";
import { products, categories } from "@/data/products";
import ProductCard from "./ProductCard";
import { SlidersHorizontal, ChevronDown } from "lucide-react";

export default function AllProducts() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [selectedSubcategory, setSelectedSubcategory] = useState("Todos");
  const [sortBy, setSortBy] = useState("relevance");
  const [showFilters, setShowFilters] = useState(false);

  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== "Todos" && p.category !== selectedCategory) return false;
    if (selectedSubcategory !== "Todos" && p.subcategory !== selectedSubcategory)
      return false;
    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "name":
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const currentCat = categories.find((c) => c.name === selectedCategory);

  return (
    <section id="catalogo" className="py-12 bg-brand-dark2">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="w-10 h-0.5 bg-brand-gold mb-3" />
            <h2 className="text-2xl md:text-3xl font-bold text-brand-text">
              Todo el Catálogo
            </h2>
          </div>
          <span className="text-sm text-brand-muted">
            {sortedProducts.length} productos
          </span>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden flex items-center gap-2 bg-brand-dark px-4 py-2 rounded text-sm font-medium text-brand-gold border border-brand-gold/20 cursor-pointer"
          >
            <SlidersHorizontal size={16} />
            Filtros
            <ChevronDown
              size={16}
              className={`transition-transform ${showFilters ? "rotate-180" : ""}`}
            />
          </button>

          <aside
            className={`lg:w-56 shrink-0 ${
              showFilters ? "block" : "hidden lg:block"
            }`}
          >
            <div className="bg-brand-dark rounded-lg p-4 sticky top-36 border border-brand-gold/10">
              <h3 className="font-bold text-xs text-brand-gold mb-3 uppercase tracking-widest">
                Categoría
              </h3>
              <ul className="space-y-1 mb-5">
                <li>
                  <button
                    onClick={() => {
                      setSelectedCategory("Todos");
                      setSelectedSubcategory("Todos");
                    }}
                    className={`w-full text-left px-3 py-2 rounded text-sm transition-colors cursor-pointer ${
                      selectedCategory === "Todos"
                        ? "bg-brand-gold text-brand-black font-medium"
                        : "hover:bg-white/5 text-brand-muted"
                    }`}
                  >
                    Todos
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat.slug}>
                    <button
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        setSelectedSubcategory("Todos");
                      }}
                      className={`w-full text-left px-3 py-2 rounded text-sm transition-colors cursor-pointer ${
                        selectedCategory === cat.name
                          ? "bg-brand-gold text-brand-black font-medium"
                          : "hover:bg-white/5 text-brand-muted"
                      }`}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>

              {currentCat && (
                <>
                  <h3 className="font-bold text-xs text-brand-gold mb-3 uppercase tracking-widest">
                    Subcategoría
                  </h3>
                  <ul className="space-y-1 mb-5">
                    <li>
                      <button
                        onClick={() => setSelectedSubcategory("Todos")}
                        className={`w-full text-left px-3 py-2 rounded text-sm transition-colors cursor-pointer ${
                          selectedSubcategory === "Todos"
                            ? "bg-brand-gold text-brand-black font-medium"
                            : "hover:bg-white/5 text-brand-muted"
                        }`}
                      >
                        Todos
                      </button>
                    </li>
                    {currentCat.subcategories.map((sub) => (
                      <li key={sub}>
                        <button
                          onClick={() => setSelectedSubcategory(sub)}
                          className={`w-full text-left px-3 py-2 rounded text-sm transition-colors cursor-pointer ${
                            selectedSubcategory === sub
                              ? "bg-brand-gold text-brand-black font-medium"
                              : "hover:bg-white/5 text-brand-muted"
                          }`}
                        >
                          {sub}
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <h3 className="font-bold text-xs text-brand-gold mb-3 uppercase tracking-widest">
                Ordenar por
              </h3>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full border border-brand-gold/20 rounded px-3 py-2 text-sm bg-brand-dark2 text-brand-text cursor-pointer"
              >
                <option value="relevance">Relevancia</option>
                <option value="price-asc">Precio: Menor a Mayor</option>
                <option value="price-desc">Precio: Mayor a Menor</option>
                <option value="rating">Mejor Calificación</option>
                <option value="name">Nombre A-Z</option>
              </select>
            </div>
          </aside>

          <div className="flex-1">
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-brand-muted text-lg">
                  No se encontraron productos en esta categoría.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
