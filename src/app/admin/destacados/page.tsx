"use client";

import { useState, useEffect } from "react";
import { useSiteConfig } from "@/context/SiteConfigContext";
import { Product } from "@/data/products";
import { Star, Tag, Search, Check, ShoppingCart } from "lucide-react";
import { api, ProductAPI } from "@/lib/api";

function toProduct(p: ProductAPI): Product {
  return { ...p, originalPrice: p.originalPrice ?? undefined, discount: p.discount ?? undefined };
}

type Tab = "featured" | "offers" | "suggestions";

export default function DestacadosPage() {
  const { featuredIds, setFeaturedIds, offerIds, setOfferIds, cartSuggestionIds, setCartSuggestionIds } = useSiteConfig();
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("featured");
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.getProducts().then((data) => {
      const prods = data.map(toProduct);
      setProducts(prods);

      if (featuredIds.length === 0) {
        const defaultFeatured = prods.filter((p) => p.featured).map((p) => p.id);
        setFeaturedIds(defaultFeatured);
      }
      if (offerIds.length === 0) {
        const defaultOffers = prods.filter((p) => p.discount).map((p) => p.id);
        setOfferIds(defaultOffers);
      }
    }).catch(() => {});
  }, []);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const activeIds =
    activeTab === "featured" ? featuredIds : activeTab === "offers" ? offerIds : cartSuggestionIds;
  const setActiveIds =
    activeTab === "featured" ? setFeaturedIds : activeTab === "offers" ? setOfferIds : setCartSuggestionIds;

  const toggleProduct = (id: number) => {
    if (activeIds.includes(id)) {
      setActiveIds(activeIds.filter((i) => i !== id));
    } else {
      setActiveIds([...activeIds, id]);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(price);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 border-b border-[#222] pb-3">
        <button
          onClick={() => setActiveTab("featured")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            activeTab === "featured"
              ? "bg-[#c9a84c]/20 text-[#c9a84c]"
              : "text-[#888] hover:text-white hover:bg-white/5"
          }`}
        >
          <Star size={16} />
          Productos Destacados ({featuredIds.length})
        </button>
        <button
          onClick={() => setActiveTab("offers")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            activeTab === "offers"
              ? "bg-[#c9a84c]/20 text-[#c9a84c]"
              : "text-[#888] hover:text-white hover:bg-white/5"
          }`}
        >
          <Tag size={16} />
          Ofertas Especiales ({offerIds.length})
        </button>
        <button
          onClick={() => setActiveTab("suggestions")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            activeTab === "suggestions"
              ? "bg-[#c9a84c]/20 text-[#c9a84c]"
              : "text-[#888] hover:text-white hover:bg-white/5"
          }`}
        >
          <ShoppingCart size={16} />
          Sugerencias del Carrito ({cartSuggestionIds.length})
        </button>
      </div>

      <p className="text-sm text-[#888]">
        {activeTab === "featured"
          ? "Selecciona los productos que aparecerán en la sección de Productos Destacados del inicio."
          : activeTab === "offers"
          ? "Selecciona los productos que aparecerán en la sección de Ofertas Especiales. Recuerda configurar el precio original y descuento en el módulo de Productos."
          : "Selecciona los productos que se ofrecerán en el carrito bajo \"Tal vez quisieras agregar...\". Si no seleccionas ninguno, el carrito sugiere automáticamente productos de la misma categoría."}
      </p>

      <div className="relative max-w-xs">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar producto..."
          className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg pl-9 pr-3 py-2 text-white text-sm focus:outline-none focus:border-[#c9a84c]"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filtered.map((product) => {
          const isSelected = activeIds.includes(product.id);
          return (
            <button
              key={product.id}
              onClick={() => toggleProduct(product.id)}
              className={`relative bg-[#111] border rounded-xl p-3 text-left transition-all cursor-pointer ${
                isSelected
                  ? "border-[#c9a84c] ring-1 ring-[#c9a84c]/30"
                  : "border-[#222] hover:border-[#444]"
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-[#c9a84c] rounded-full flex items-center justify-center">
                  <Check size={14} className="text-black" />
                </div>
              )}
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-lg bg-[#1a1a1a] overflow-hidden flex-shrink-0">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium truncate">{product.name}</div>
                  <div className="text-[#666] text-xs">{product.category}</div>
                  <div className="text-[#c9a84c] text-sm font-bold mt-1">{formatPrice(product.price)}</div>
                  {product.originalPrice && (
                    <div className="text-[#666] text-xs line-through">{formatPrice(product.originalPrice)}</div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
