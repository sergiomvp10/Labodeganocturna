"use client";

import { products, formatPrice } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Tag } from "lucide-react";

export default function OffersSection() {
  const { addToCart } = useCart();
  const offers = products.filter((p) => p.discount);

  if (offers.length === 0) return null;

  return (
    <section id="ofertas" className="py-10 bg-gradient-to-b from-brand-dark to-brand-darker">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-6">
          <Tag size={28} className="text-brand-gold" />
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Ofertas Especiales
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((product) => (
            <div
              key={product.id}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-5 flex gap-4 items-center border border-white/10 hover:border-brand-gold/40 transition-colors"
            >
              <div className="w-24 h-24 shrink-0 bg-white/5 rounded-lg p-2 flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/200x200/1a1a2e/d4a843?text=" +
                      encodeURIComponent(product.name);
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="inline-block bg-brand-red text-white text-xs font-bold px-2 py-0.5 rounded mb-2">
                  {product.discount}
                </span>
                <h3 className="text-white font-semibold text-sm truncate">
                  {product.name}
                </h3>
                <p className="text-gray-400 text-xs">{product.volume}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-brand-gold font-bold text-lg">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-gray-500 text-sm line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => addToCart(product)}
                  className="mt-2 bg-brand-gold hover:bg-yellow-600 text-brand-dark font-medium py-1.5 px-4 rounded text-xs flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <ShoppingCart size={14} />
                  Agregar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
