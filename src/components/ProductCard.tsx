"use client";

import { Star, ShoppingCart } from "lucide-react";
import { Product, formatPrice } from "@/data/products";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const renderStars = (rating: number) => {
    const stars = [];
    const full = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    for (let i = 0; i < 5; i++) {
      if (i < full) {
        stars.push(
          <Star
            key={i}
            size={14}
            className="fill-yellow-400 text-yellow-400"
          />
        );
      } else if (i === full && hasHalf) {
        stars.push(
          <Star
            key={i}
            size={14}
            className="fill-yellow-400/50 text-yellow-400"
          />
        );
      } else {
        stars.push(
          <Star key={i} size={14} className="text-gray-300" />
        );
      }
    }
    return stars;
  };

  return (
    <div className="bg-brand-dark border border-brand-gold/10 rounded-lg overflow-hidden hover:border-brand-gold/30 transition-all group relative">
      {product.discount && (
        <div className="absolute top-2 left-2 bg-brand-gold text-brand-black text-xs font-bold px-2 py-1 rounded z-10">
          {product.discount}
        </div>
      )}

      <Link href={`/producto/${product.id}`} className="block">
        <div className="relative aspect-square bg-brand-dark2 p-4 flex items-center justify-center overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://placehold.co/300x400/111/c9a84c?text=" +
                encodeURIComponent(product.name);
            }}
          />
        </div>
      </Link>

      <div className="p-3 md:p-4">
        <p className="text-xs text-brand-muted uppercase tracking-wider mb-1">
          {product.brand}
        </p>
        <Link href={`/producto/${product.id}`}>
          <h3 className="font-semibold text-sm md:text-base text-brand-text hover:text-brand-gold transition-colors line-clamp-2 min-h-10">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-brand-muted mt-1">{product.volume}</p>

        <div className="flex items-center gap-1 mt-2">
          <div className="flex">{renderStars(product.rating)}</div>
          <span className="text-xs text-brand-muted">
            ({product.reviews})
          </span>
        </div>

        <div className="mt-3 flex items-end gap-2">
          <span className="text-lg md:text-xl font-bold text-brand-gold">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-brand-muted line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        <button
          onClick={() => addToCart(product)}
          className="mt-3 w-full bg-brand-gold hover:bg-brand-gold-light text-brand-black font-medium py-2.5 px-4 rounded text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <ShoppingCart size={16} />
          Agregar al Carrito
        </button>

        {product.inStock ? (
          <p className="text-xs text-green-500 mt-2 font-medium">
            Disponible para entrega
          </p>
        ) : (
          <p className="text-xs text-red-400 mt-2 font-medium">
            Agotado
          </p>
        )}
      </div>
    </div>
  );
}
