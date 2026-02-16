"use client";

import { useState } from "react";
import { formatPrice } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useProducts } from "@/context/ProductsContext";
import { Star, ShoppingCart, Minus, Plus, ArrowLeft, Truck, Clock, Shield } from "lucide-react";
import Link from "next/link";

export default function ProductPageClient({ id }: { id: string }) {
  const { products: allProducts } = useProducts();
  const product = allProducts.find((p) => p.id === parseInt(id)) || null;
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
          className="text-brand-gold hover:underline font-medium"
        >
          Volver al inicio
        </Link>
      </div>
    );
  }

  const related = allProducts
    .filter((p) => p.category.toLowerCase() === product.category.toLowerCase() && p.id !== product.id)
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
    <div className="bg-brand-black min-h-screen">
      <div className="bg-brand-dark border-b border-brand-gold/10">
        <div className="w-full px-4 sm:px-6 lg:px-10 py-3">
          <div className="flex items-center gap-2 text-sm text-brand-muted">
            <Link href="/" className="hover:text-brand-gold transition-colors">
              Inicio
            </Link>
            <span className="text-brand-gold/30">/</span>
            <span>{product.category}</span>
            <span className="text-brand-gold/30">/</span>
            <span>{product.subcategory}</span>
            <span className="text-brand-gold/30">/</span>
            <span className="text-brand-text font-medium">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 lg:px-10 py-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-brand-gold hover:text-brand-gold-light text-sm font-medium mb-6"
        >
          <ArrowLeft size={16} />
          Volver al catalogo
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <div className="bg-brand-dark rounded-xl p-4 md:p-8 flex items-center justify-center h-[55vw] max-h-[350px] md:h-auto md:max-h-none md:aspect-square relative border border-brand-gold/10 overflow-hidden">
            {product.discount && (
              <div className="absolute top-4 left-4 bg-brand-gold text-brand-black text-sm font-bold px-3 py-1 rounded z-10">
                {product.discount}
              </div>
            )}
            <img
              src={product.image}
              alt={product.name}
              loading="eager"
              decoding="async"
              fetchPriority="high"
              width={500}
              height={500}
              className="w-full h-full object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://placehold.co/500x500/111/c9a84c?text=" +
                  encodeURIComponent(product.name);
              }}
            />
          </div>

          <div>
            <p className="text-sm text-brand-muted uppercase tracking-wider mb-1">
              {product.brand}
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-brand-text mb-2">
              {product.name}
            </h1>
            <p className="text-sm text-brand-muted mb-3">{product.volume}</p>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex">{renderStars(product.rating)}</div>
              <span className="text-sm text-brand-muted">
                {product.rating} ({product.reviews} resenas)
              </span>
            </div>

            <div className="flex items-end gap-3 mb-6">
              <span className="text-3xl md:text-4xl font-bold text-brand-gold">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-brand-muted line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            <p className="text-brand-muted text-sm leading-relaxed mb-6">
              {product.description}
            </p>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-medium text-brand-text">Cantidad:</span>
              <div className="flex items-center border border-brand-gold/20 rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer text-brand-text"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 h-10 flex items-center justify-center text-sm font-medium border-x border-brand-gold/20 text-brand-text">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-white/5 transition-colors cursor-pointer text-brand-text"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="w-full bg-brand-gold hover:bg-brand-gold-light text-brand-black font-bold py-3.5 px-6 rounded flex items-center justify-center gap-2 transition-colors cursor-pointer text-base mb-4 uppercase tracking-wider"
            >
              <ShoppingCart size={20} />
              Agregar - {formatPrice(product.price * quantity)}
            </button>

            {product.inStock ? (
              <p className="text-green-400 font-medium text-sm mb-6">
                Disponible para entrega inmediata
              </p>
            ) : (
              <p className="text-red-400 font-medium text-sm mb-6">Agotado</p>
            )}

            <div className="border-t border-brand-gold/10 pt-6 space-y-3">
              <div className="flex items-center gap-3 text-sm text-brand-muted">
                <Truck size={18} className="text-brand-gold shrink-0" />
                <span>Domicilio gratis en pedidos mayores a $50.000</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-brand-muted">
                <Clock size={18} className="text-brand-gold shrink-0" />
                <span>Entrega en 30-60 minutos aprox.</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-brand-muted">
                <Shield size={18} className="text-brand-gold shrink-0" />
                <span>Productos 100% originales garantizados</span>
              </div>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16 mb-8">
            <div className="w-10 h-0.5 bg-brand-gold mb-3" />
            <h2 className="text-xl md:text-2xl font-bold text-brand-text mb-6">
              Productos Relacionados
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/producto/${p.id}`}
                  className="bg-brand-dark border border-brand-gold/10 rounded-lg overflow-hidden hover:border-brand-gold/30 transition-all group"
                >
                  <div className="aspect-square bg-brand-dark2 p-4 flex items-center justify-center overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                      decoding="async"
                      width={300}
                      height={300}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/300x300/111/c9a84c?text=Img";
                      }}
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-brand-muted">{p.brand}</p>
                    <h3 className="font-semibold text-sm text-brand-text line-clamp-2">
                      {p.name}
                    </h3>
                    <p className="font-bold text-sm mt-1 text-brand-gold">{formatPrice(p.price)}</p>
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
