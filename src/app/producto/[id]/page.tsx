"use client";

import { use } from "react";
import { useState } from "react";
import { products, formatPrice } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { Star, ShoppingCart, Minus, Plus, ArrowLeft, Truck, Clock, Shield } from "lucide-react";
import Link from "next/link";

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const product = products.find((p) => p.id === parseInt(id));
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h1 className="text-2xl font-bold text-brand-text mb-4">
          Producto no encontrado
        </h1>
        <Link
          href="/"
          className="text-brand-red hover:underline font-medium"
        >
          ← Volver al inicio
        </Link>
      </div>
    );
  }

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const renderStars = (rating: number) => {
    const stars = [];
    const full = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    for (let i = 0; i < 5; i++) {
      if (i < full) {
        stars.push(<Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />);
      } else if (i === full && hasHalf) {
        stars.push(<Star key={i} size={18} className="fill-yellow-400/50 text-yellow-400" />);
      } else {
        stars.push(<Star key={i} size={18} className="text-gray-300" />);
      }
    }
    return stars;
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="bg-brand-light border-b border-brand-gray">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-brand-muted">
            <Link href="/" className="hover:text-brand-red transition-colors">
              Inicio
            </Link>
            <span>/</span>
            <span>{product.category}</span>
            <span>/</span>
            <span>{product.subcategory}</span>
            <span>/</span>
            <span className="text-brand-text font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-brand-red hover:underline text-sm font-medium mb-6"
        >
          <ArrowLeft size={16} />
          Volver al catálogo
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <div className="bg-gray-50 rounded-xl p-8 flex items-center justify-center aspect-square relative">
            {product.discount && (
              <div className="absolute top-4 left-4 bg-brand-red text-white text-sm font-bold px-3 py-1 rounded">
                {product.discount}
              </div>
            )}
            <img
              src={product.image}
              alt={product.name}
              className="max-h-full max-w-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://placehold.co/500x500/1a1a2e/d4a843?text=" +
                  encodeURIComponent(product.name);
              }}
            />
          </div>

          <div>
            <p className="text-sm text-brand-muted uppercase tracking-wide mb-1">
              {product.brand}
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-brand-text mb-2">
              {product.name}
            </h1>
            <p className="text-sm text-brand-muted mb-3">{product.volume}</p>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex">{renderStars(product.rating)}</div>
              <span className="text-sm text-brand-muted">
                {product.rating} ({product.reviews} reseñas)
              </span>
            </div>

            <div className="flex items-end gap-3 mb-6">
              <span className="text-3xl md:text-4xl font-bold text-brand-text">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-brand-muted line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <p className="text-brand-text text-sm leading-relaxed mb-6">
              {product.description}
            </p>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium text-brand-text">Cantidad:</span>
              <div className="flex items-center border border-gray-300 rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 h-10 flex items-center justify-center text-sm font-medium border-x border-gray-300">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-brand-red hover:bg-red-700 text-white font-bold py-3.5 px-6 rounded-md flex items-center justify-center gap-2 transition-colors cursor-pointer text-base mb-4"
            >
              <ShoppingCart size={20} />
              Agregar al Carrito - {formatPrice(product.price * quantity)}
            </button>

            {product.inStock ? (
              <p className="text-green-600 font-medium text-sm mb-6">
                ✓ Disponible para entrega inmediata
              </p>
            ) : (
              <p className="text-red-500 font-medium text-sm mb-6">Agotado</p>
            )}

            <div className="border-t border-gray-200 pt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-brand-text">
                <Truck size={20} className="text-brand-red shrink-0" />
                <span>Domicilio gratis en pedidos mayores a $50.000</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-brand-text">
                <Clock size={20} className="text-brand-red shrink-0" />
                <span>Entrega en 30-60 minutos aprox.</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-brand-text">
                <Shield size={20} className="text-brand-red shrink-0" />
                <span>Productos 100% originales garantizados</span>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16 mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-brand-text mb-6">
              Productos Relacionados
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/producto/${p.id}`}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
                >
                  <div className="aspect-square bg-gray-50 p-4 flex items-center justify-center overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/300x300/eee/333?text=Img";
                      }}
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-brand-muted">{p.brand}</p>
                    <h3 className="font-semibold text-sm text-brand-text line-clamp-2">
                      {p.name}
                    </h3>
                    <p className="font-bold text-sm mt-1">{formatPrice(p.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
