"use client";

import { products, formatPrice } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { ShoppingCart, Tag } from "lucide-react";

export default function OffersSection() {
  const { addToCart } = useCart();
  const offers = products.filter((p) => p.discount);

  if (offers.length === 0) return null;

  return (
    <section id="ofertas" className="py-12 bg-brand-black">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex items-center gap-3 mb-8">
          <Tag size={24} className="text-brand-gold" />
          <h2 className="text-2xl md:text-3xl font-bold text-brand-text">
            Ofertas Especiales
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((product) => (
            <div
              key={product.id}
              className="bg-brand-dark rounded-lg p-5 flex gap-4 items-center border border-brand-gold/10 hover:border-brand-gold/30 transition-colors"
            >
              <div className="w-24 h-24 shrink-0 bg-brand-dark2 rounded-lg p-2 flex items-center justify-center">
                <img
                  src={product.image}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "https://placehold.co/200x200/111/c9a84c?text=" +
                      encodeURIComponent(product.name);
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <span className="inline-block bg-brand-gold text-brand-black text-xs font-bold px-2 py-0.5 rounded mb-2">
                  {product.discount}
                </span>
                <h3 className="text-brand-text font-semibold text-sm truncate">
                  {product.name}
                </h3>
                <p className="text-brand-muted text-xs">{product.volume}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-brand-gold font-bold text-lg">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-brand-muted text-sm line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => addToCart(product)}
                  className="mt-2 bg-brand-gold hover:bg-brand-gold-light text-brand-black font-medium py-1.5 px-4 rounded text-xs flex items-center gap-1 transition-colors cursor-pointer"
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
