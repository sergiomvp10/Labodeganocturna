"use client";

import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";

export default function CartSidebar() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={() => setIsCartOpen(false)}
      />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-brand-dark z-50 shadow-2xl flex flex-col border-l border-brand-gold/20">
        <div className="flex items-center justify-between p-4 border-b border-brand-gold/20 bg-brand-black">
          <div className="flex items-center gap-2 text-brand-gold">
            <ShoppingBag size={22} />
            <h2 className="font-bold text-lg">
              Mi Carrito ({totalItems})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="text-brand-muted hover:text-brand-gold transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <ShoppingBag size={64} className="text-brand-gray mb-4" />
            <h3 className="text-lg font-semibold text-brand-text mb-2">
              Tu carrito está vacío
            </h3>
            <p className="text-brand-muted text-sm">
              Agrega productos para comenzar tu pedido
            </p>
            <button
              onClick={() => setIsCartOpen(false)}
              className="mt-4 bg-brand-gold hover:bg-brand-gold-light text-brand-black font-medium py-2 px-6 rounded text-sm transition-colors cursor-pointer"
            >
              Seguir Comprando
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3 bg-brand-dark2 rounded-lg p-3 border border-brand-gold/5"
                >
                  <div className="w-16 h-16 shrink-0 bg-brand-black rounded flex items-center justify-center">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="max-h-full max-w-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/100x100/111/c9a84c?text=Img";
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-brand-text truncate">
                      {item.product.name}
                    </h4>
                    <p className="text-xs text-brand-muted">
                      {item.product.volume}
                    </p>
                    <p className="font-bold text-sm text-brand-gold mt-1">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="w-7 h-7 bg-brand-gray hover:bg-brand-gold/20 rounded flex items-center justify-center transition-colors cursor-pointer text-brand-text"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-medium w-6 text-center text-brand-text">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="w-7 h-7 bg-brand-gray hover:bg-brand-gold/20 rounded flex items-center justify-center transition-colors cursor-pointer text-brand-text"
                      >
                        <Plus size={14} />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="ml-auto text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-brand-gold/20 p-4 space-y-3 bg-brand-black">
              <div className="flex items-center justify-between text-sm">
                <span className="text-brand-muted">Subtotal:</span>
                <span className="font-semibold text-brand-text">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-brand-muted">Domicilio:</span>
                <span className="font-semibold text-green-400">
                  {totalPrice >= 50000 ? "Gratis" : formatPrice(5000)}
                </span>
              </div>
              <div className="flex items-center justify-between text-base border-t border-brand-gold/10 pt-3">
                <span className="font-bold text-brand-text">Total:</span>
                <span className="font-bold text-lg text-brand-gold">
                  {formatPrice(
                    totalPrice + (totalPrice >= 50000 ? 0 : 5000)
                  )}
                </span>
              </div>
              <button className="w-full bg-brand-gold hover:bg-brand-gold-light text-brand-black font-bold py-3 px-6 rounded text-sm transition-colors cursor-pointer uppercase tracking-wider">
                Finalizar Pedido por WhatsApp
              </button>
              <button
                onClick={clearCart}
                className="w-full text-brand-muted hover:text-red-400 text-sm py-1 transition-colors cursor-pointer"
              >
                Vaciar Carrito
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
