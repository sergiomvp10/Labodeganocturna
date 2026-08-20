"use client";

import { useCart } from "@/context/CartContext";
import { useFlyToCart } from "@/context/FlyToCartContext";
import { Product } from "@/data/products";
import { Plus } from "lucide-react";
import Link from "next/link";
import { MouseEvent } from "react";

export function ProductCardSkeleton() {
  return (
    <div className="bg-brand-dark2 rounded-xl border border-brand-gold/10 overflow-hidden animate-pulse">
      <div className="aspect-square bg-brand-dark" />
      <div className="p-3 space-y-2">
        <div className="h-2 w-1/3 bg-brand-gold/10 rounded" />
        <div className="h-3 w-4/5 bg-brand-gold/10 rounded" />
        <div className="h-4 w-1/2 bg-brand-gold/10 rounded" />
      </div>
    </div>
  );
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { fly } = useFlyToCart();

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="h-full flex flex-col bg-brand-dark2 rounded-xl border border-brand-gold/10 overflow-hidden group hover:border-brand-gold/30 transition-all duration-300">
      <Link href={`/producto/${product.id}/`} className="block">
        <div className="relative aspect-square bg-brand-dark p-4 flex items-center justify-center">
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              -{discount}%
            </span>
          )}
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            decoding="async"
            width={300}
            height={300}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://placehold.co/300x300/111/c9a84c?text=" + encodeURIComponent(product.name);
            }}
          />
        </div>
      </Link>

      <div className="flex-1 flex flex-col p-3 md:p-4">
        <p className="text-brand-gold/60 text-[10px] uppercase tracking-wider mb-0.5">
          {product.category}
        </p>
        <Link href={`/producto/${product.id}/`}>
          <h3 className="text-sm text-brand-text font-medium leading-snug mb-2 line-clamp-2 hover:text-brand-gold transition-colors">
            {product.name}
          </h3>
        </Link>

        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="price text-lg font-bold text-brand-gold leading-none">
              ${product.price.toLocaleString("es-CO")}
            </p>
            {product.originalPrice && (
              <p className="price text-xs text-brand-muted line-through mt-0.5">
                ${product.originalPrice.toLocaleString("es-CO")}
              </p>
            )}
          </div>
          <button
            onClick={(e: MouseEvent) => {
              const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
              fly(product.image, rect.left + rect.width / 2, rect.top);
              addToCart(product);
            }}
            aria-label={`Agregar ${product.name} al carrito`}
            className="shrink-0 bg-brand-gold text-brand-black p-2 rounded-md hover:bg-brand-goldLight transition-colors duration-200 cursor-pointer"
          >
            <Plus size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
